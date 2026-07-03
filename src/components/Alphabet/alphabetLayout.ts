// Grid layouts for the Alphabet reference chart, keyed by character (not
// romaji) since romaji alone is ambiguous for the だ/ぢ/づ/で/ど row (its
// romaji collides with ざ行's in src/data/kana.json). "" marks a blank cell
// that keeps the grid aligned (e.g. や行 has no yi/ye).
export const SEION_HIRAGANA = [
  ["あ", "い", "う", "え", "お"],
  ["か", "き", "く", "け", "こ"],
  ["さ", "し", "す", "せ", "そ"],
  ["た", "ち", "つ", "て", "と"],
  ["な", "に", "ぬ", "ね", "の"],
  ["は", "ひ", "ふ", "へ", "ほ"],
  ["ま", "み", "む", "め", "も"],
  ["や", "", "ゆ", "", "よ"],
  ["ら", "り", "る", "れ", "ろ"],
  ["わ", "", "", "", "を"],
  ["ん", "", "", "", ""],
];

export const SEION_KATAKANA = [
  ["ア", "イ", "ウ", "エ", "オ"],
  ["カ", "キ", "ク", "ケ", "コ"],
  ["サ", "シ", "ス", "セ", "ソ"],
  ["タ", "チ", "ツ", "テ", "ト"],
  ["ナ", "ニ", "ヌ", "ネ", "ノ"],
  ["ハ", "ヒ", "フ", "ヘ", "ホ"],
  ["マ", "ミ", "ム", "メ", "モ"],
  ["ヤ", "", "ユ", "", "ヨ"],
  ["ラ", "リ", "ル", "レ", "ロ"],
  ["ワ", "", "", "", "ヲ"],
  ["ン", "", "", "", ""],
];

export const DAKUTEN_HIRAGANA = [
  ["が", "ぎ", "ぐ", "げ", "ご"],
  ["ざ", "じ", "ず", "ぜ", "ぞ"],
  ["だ", "ぢ", "づ", "で", "ど"],
  ["ば", "び", "ぶ", "べ", "ぼ"],
];

export const DAKUTEN_KATAKANA = [
  ["ガ", "ギ", "グ", "ゲ", "ゴ"],
  ["ザ", "ジ", "ズ", "ゼ", "ゾ"],
  ["ダ", "ヂ", "ヅ", "デ", "ド"],
  ["バ", "ビ", "ブ", "ベ", "ボ"],
];

export const HANDAKUTEN_HIRAGANA = [["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"]];
export const HANDAKUTEN_KATAKANA = [["パ", "ピ", "プ", "ペ", "ポ"]];

export const YOON_HIRAGANA = [
  ["きゃ", "きゅ", "きょ"],
  ["しゃ", "しゅ", "しょ"],
  ["ちゃ", "ちゅ", "ちょ"],
  ["にゃ", "にゅ", "にょ"],
  ["ひゃ", "ひゅ", "ひょ"],
  ["みゃ", "みゅ", "みょ"],
  ["りゃ", "りゅ", "りょ"],
  ["ぎゃ", "ぎゅ", "ぎょ"],
  ["じゃ", "じゅ", "じょ"],
  ["びゃ", "びゅ", "びょ"],
  ["ぴゃ", "ぴゅ", "ぴょ"],
];

export const YOON_KATAKANA = [
  ["キャ", "キュ", "キョ"],
  ["シャ", "シュ", "ショ"],
  ["チャ", "チュ", "チョ"],
  ["ニャ", "ニュ", "ニョ"],
  ["ヒャ", "ヒュ", "ヒョ"],
  ["ミャ", "ミュ", "ミョ"],
  ["リャ", "リュ", "リョ"],
  ["ギャ", "ギュ", "ギョ"],
  ["ジャ", "ジュ", "ジョ"],
  ["ビャ", "ビュ", "ビョ"],
  ["ピャ", "ピュ", "ピョ"],
];

export interface AlphabetSection {
  title: string;
  rows: string[][];
}

export function alphabetSections(type: "hiragana" | "katakana"): AlphabetSection[] {
  const isHira = type === "hiragana";
  return [
    { title: "Âm cơ bản (Seion)", rows: isHira ? SEION_HIRAGANA : SEION_KATAKANA },
    { title: "Âm đục (Dakuten)", rows: isHira ? DAKUTEN_HIRAGANA : DAKUTEN_KATAKANA },
    { title: "Âm bán đục (Handakuten)", rows: isHira ? HANDAKUTEN_HIRAGANA : HANDAKUTEN_KATAKANA },
    { title: "Âm ghép (Yōon)", rows: isHira ? YOON_HIRAGANA : YOON_KATAKANA },
  ];
}
