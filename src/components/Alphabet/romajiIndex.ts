import type { KanaEntry } from "../../lib/types";

export const LATIN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Groups every kana entry (hiragana + katakana, all categories) by the
 * first letter of its base romaji — e.g. "kya" and "ka" both fall under K,
 * while だ行's ぢ/づ fall under J/Z since their romaji is "ji"/"zu", not D. */
export function groupByLatinLetter(kana: KanaEntry[]): Map<string, KanaEntry[]> {
  const map = new Map<string, KanaEntry[]>();
  for (const letter of LATIN_LETTERS) map.set(letter, []);

  for (const entry of kana) {
    const base = entry.romaji.replace(/\(.*\)/, "");
    const letter = base[0]?.toUpperCase();
    if (letter && map.has(letter)) {
      map.get(letter)!.push(entry);
    }
  }
  return map;
}
