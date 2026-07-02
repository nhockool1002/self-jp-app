// One-off data preparation script. Run manually with `node scripts/build-data.mjs`
// whenever we want to refresh from upstream sources. Output is committed into
// src/data/ and imported statically by the app — the shipped app never fetches
// data at runtime.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as yaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "src", "data");

const KANJI_URL =
  "https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json";
const VOCAB_URL =
  "https://raw.githubusercontent.com/Bluskyo/JLPT_Vocabulary/main/data/vocab/results/JLPT_vocab_ALL.json";
const MINNA_URL =
  "https://raw.githubusercontent.com/vitto4/MinnaNoDS/main/minna-no-ds.yaml";

const JLPT_LEVEL_NAMES = { 5: "N5", 4: "N4", 3: "N3", 2: "N2", 1: "N1" };

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function buildKanji(vocabByWord) {
  const raw = await fetchJson(KANJI_URL);
  const byLevel = { N5: [], N4: [], N3: [], N2: [], N1: [] };

  for (const [char, entry] of Object.entries(raw)) {
    if (!entry.jlpt_new || !JLPT_LEVEL_NAMES[entry.jlpt_new]) continue;
    const level = JLPT_LEVEL_NAMES[entry.jlpt_new];

    const exampleWords = vocabByWord
      .filter(([word]) => word.includes(char))
      .slice(0, 3)
      .map(([word, readings]) => ({
        word,
        reading: readings[0]?.reading ?? "",
      }));

    byLevel[level].push({
      kanji: char,
      jlpt: level,
      strokes: entry.strokes ?? null,
      meanings: entry.meanings ?? [],
      onyomi: entry.readings_on ?? [],
      kunyomi: entry.readings_kun ?? [],
      exampleWords,
    });
  }

  return byLevel;
}

async function buildVocabLookup() {
  const raw = await fetchJson(VOCAB_URL);
  // Sort by shortest word first so example-word matching favors simpler vocab.
  return Object.entries(raw).sort((a, b) => a[0].length - b[0].length);
}

// The upstream YAML spans flow mappings/sequences (`{...}`, `[...]`) across
// multiple lines with a closing-bracket indentation js-yaml's strict parser
// rejects ("deficient indentation"). Collapse each flow block onto a single
// line before parsing — indentation rules don't apply within a single line.
function collapseMultilineFlowBlocks(text) {
  let depth = 0;
  let inString = false;
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      result += ch;
      if (ch === "\\") {
        result += text[++i];
        continue;
      }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      result += ch;
      continue;
    }
    if (ch === "#") {
      // Comments can contain stray {}/[] (e.g. "# meaning: {") that must not
      // be counted towards flow depth. At depth 0 keep the comment text
      // as-is; at depth > 0 strip it — it would otherwise run into the
      // collapsed single-line flow block and swallow real content after it.
      let j = i;
      while (j < text.length && text[j] !== "\n") j++;
      if (depth === 0) result += text.slice(i, j);
      i = j - 1;
      continue;
    }
    if (ch === "{" || ch === "[") depth++;
    if (ch === "}" || ch === "]") depth--;
    if (depth > 0 && ch === "\n") {
      result += " ";
      continue;
    }
    result += ch;
  }
  return result;
}

async function buildMinna() {
  const rawText = collapseMultilineFlowBlocks(await fetchText(MINNA_URL));
  const raw = yaml.load(rawText);
  const byLesson = {};

  for (const [key, entries] of Object.entries(raw)) {
    const match = /^lesson-(\d+)$/.exec(key);
    if (!match) continue;
    const lessonNumber = Number(match[1]);

    byLesson[lessonNumber] = entries.map((e) => ({
      id: e.id.join("-"),
      editions: e.edition,
      kanji: e.kanji ?? null,
      kana: e.kana,
      romaji: e.romaji,
      meaning: e.meaning?.en ?? "",
    }));
  }

  return byLesson;
}

// No external source needed — hand-authored gojuon table (seion, dakuten,
// handakuten) for both hiragana and katakana. Combination sounds (yoon, e.g.
// きゃ) are a deferred fast-follow to keep the MVP dataset small.
const SEION_ROWS = [
  ["a", "i", "u", "e", "o"],
  ["ka", "ki", "ku", "ke", "ko"],
  ["sa", "shi", "su", "se", "so"],
  ["ta", "chi", "tsu", "te", "to"],
  ["na", "ni", "nu", "ne", "no"],
  ["ha", "hi", "fu", "he", "ho"],
  ["ma", "mi", "mu", "me", "mo"],
  ["ya", null, "yu", null, "yo"],
  ["ra", "ri", "ru", "re", "ro"],
  ["wa", null, null, null, "wo"],
];
const N_ROW = ["n"];

const DAKUTEN_ROWS = [
  ["ga", "gi", "gu", "ge", "go"],
  ["za", "ji", "zu", "ze", "zo"],
  ["da", "ji", "zu", "de", "do"],
  ["ba", "bi", "bu", "be", "bo"],
];
const HANDAKUTEN_ROW = ["pa", "pi", "pu", "pe", "po"];

const HIRAGANA_CHARS = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  sa: "さ", shi: "し", su: "す", se: "せ", so: "そ",
  ta: "た", chi: "ち", tsu: "つ", te: "て", to: "と",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", fu: "ふ", he: "へ", ho: "ほ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を", n: "ん",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  za: "ざ", ji: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
};
// だ行's ぢ/づ share romaji (ji/zu) with ざ行 じ/ず — keyed separately by row+col below.
const HIRAGANA_DA_ROW = ["だ", "ぢ", "づ", "で", "ど"];

const KATAKANA_CHARS = {
  a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ",
  ka: "カ", ki: "キ", ku: "ク", ke: "ケ", ko: "コ",
  sa: "サ", shi: "シ", su: "ス", se: "セ", so: "ソ",
  ta: "タ", chi: "チ", tsu: "ツ", te: "テ", to: "ト",
  na: "ナ", ni: "ニ", nu: "ヌ", ne: "ネ", no: "ノ",
  ha: "ハ", hi: "ヒ", fu: "フ", he: "ヘ", ho: "ホ",
  ma: "マ", mi: "ミ", mu: "ム", me: "メ", mo: "モ",
  ya: "ヤ", yu: "ユ", yo: "ヨ",
  ra: "ラ", ri: "リ", ru: "ル", re: "レ", ro: "ロ",
  wa: "ワ", wo: "ヲ", n: "ン",
  ga: "ガ", gi: "ギ", gu: "グ", ge: "ゲ", go: "ゴ",
  za: "ザ", ji: "ジ", zu: "ズ", ze: "ゼ", zo: "ゾ",
  ba: "バ", bi: "ビ", bu: "ブ", be: "ベ", bo: "ボ",
  pa: "パ", pi: "ピ", pu: "プ", pe: "ペ", po: "ポ",
};
const KATAKANA_DA_ROW = ["ダ", "ヂ", "ヅ", "デ", "ド"];

function buildKana() {
  const entries = [];
  const push = (type, romaji, char) =>
    entries.push({ type, romaji, char, audioFile: null });

  // Seion (gojuon table) + ん
  for (const row of SEION_ROWS) {
    for (const romaji of row) {
      if (!romaji) continue;
      push("hiragana", romaji, HIRAGANA_CHARS[romaji]);
      push("katakana", romaji, KATAKANA_CHARS[romaji]);
    }
  }
  push("hiragana", "n", HIRAGANA_CHARS.n);
  push("katakana", "n", KATAKANA_CHARS.n);

  // Dakuten: が/ざ/ば rows read straight off HIRAGANA_CHARS/KATAKANA_CHARS.
  // だ row (だぢづでど) is handled separately below since its romaji (ji/zu)
  // collides with ざ row's — disambiguated with a "(だ)"/"(ダ)" suffix.
  for (const row of [DAKUTEN_ROWS[0], DAKUTEN_ROWS[1], DAKUTEN_ROWS[3]]) {
    for (const romaji of row) {
      push("hiragana", romaji, HIRAGANA_CHARS[romaji]);
      push("katakana", romaji, KATAKANA_CHARS[romaji]);
    }
  }
  ["da", "ji", "zu", "de", "do"].forEach((romaji, idx) => {
    push("hiragana", `${romaji}(だ)`, HIRAGANA_DA_ROW[idx]);
    push("katakana", `${romaji}(ダ)`, KATAKANA_DA_ROW[idx]);
  });

  // Handakuten
  for (const romaji of HANDAKUTEN_ROW) {
    push("hiragana", romaji, HIRAGANA_CHARS[romaji]);
    push("katakana", romaji, KATAKANA_CHARS[romaji]);
  }

  return entries;
}

async function main() {
  console.log("Fetching JLPT vocabulary (for kanji example words)...");
  const vocabByWord = await buildVocabLookup();

  console.log("Building kanji.json...");
  const kanji = await buildKanji(vocabByWord);
  writeFileSync(join(dataDir, "kanji.json"), JSON.stringify(kanji, null, 2));
  for (const [level, entries] of Object.entries(kanji)) {
    console.log(`  ${level}: ${entries.length} kanji`);
  }

  console.log("Building vocab-mnn.json...");
  const minna = await buildMinna();
  writeFileSync(
    join(dataDir, "vocab-mnn.json"),
    JSON.stringify(minna, null, 2)
  );
  console.log(`  ${Object.keys(minna).length} lessons`);

  console.log("Building kana.json...");
  const kana = buildKana();
  writeFileSync(join(dataDir, "kana.json"), JSON.stringify(kana, null, 2));
  console.log(`  ${kana.length} kana entries`);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
