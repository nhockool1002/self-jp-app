// One-off script to fetch stroke-order data for every kana/kanji character
// used by the app, from KanjiVG (https://kanjivg.tagaini.net), and write a
// compact combined JSON to public/data/strokes.json (served as a static
// asset, fetched lazily at runtime rather than bundled into the JS chunk).
//
// KanjiVG is (C) Ulrich Apel, licensed CC-BY-SA 3.0 — see README.md for
// attribution. Run with `node scripts/build-strokes.mjs`.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDataDir = join(__dirname, "..", "public", "data");

const KANJIVG_BASE = "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/";
const CONCURRENCY = 16;

function codepointHex(char) {
  return char.codePointAt(0).toString(16).padStart(5, "0");
}

function parseStrokes(svgText) {
  const viewBoxMatch = svgText.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 109 109";

  const pathMatches = [...svgText.matchAll(/<path\s[^>]*\bd="([^"]+)"/g)];
  const strokes = pathMatches.map((m) => m[1]);

  return strokes.length ? { viewBox, strokes } : null;
}

async function fetchStrokesFor(char) {
  const hex = codepointHex(char);
  const url = `${KANJIVG_BASE}${hex}.svg`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const svgText = await res.text();
  return parseStrokes(svgText);
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

async function main() {
  const dataDir = join(__dirname, "..", "src", "data");
  const kana = JSON.parse(readFileSync(join(dataDir, "kana.json"), "utf8"));
  const kanji = JSON.parse(readFileSync(join(dataDir, "kanji.json"), "utf8"));

  const chars = new Set(kana.map((k) => k.char));
  for (const entries of Object.values(kanji)) {
    for (const e of entries) chars.add(e.kanji);
  }
  const charList = [...chars];
  console.log(`Fetching stroke data for ${charList.length} characters...`);

  const strokeData = {};
  let done = 0;
  let missing = 0;
  await mapWithConcurrency(charList, CONCURRENCY, async (char) => {
    try {
      const data = await fetchStrokesFor(char);
      if (data) {
        strokeData[char] = data;
      } else {
        missing++;
      }
    } catch (err) {
      missing++;
      console.error(`  failed for ${char}:`, err.message);
    }
    done++;
    if (done % 200 === 0) console.log(`  ${done}/${charList.length}`);
  });

  mkdirSync(publicDataDir, { recursive: true });
  writeFileSync(join(publicDataDir, "strokes.json"), JSON.stringify(strokeData));

  console.log(`Done. ${Object.keys(strokeData).length} characters with stroke data, ${missing} missing.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
