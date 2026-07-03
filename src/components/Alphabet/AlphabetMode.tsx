import { useMemo } from "react";
import kanaData from "../../data/kana.json";
import type { KanaEntry } from "../../lib/types";
import { groupByLatinLetter, LATIN_LETTERS } from "./romajiIndex";
import { AlphabetCell } from "./AlphabetCell";

const KANA: KanaEntry[] = kanaData as KanaEntry[];

/** Shows the full Latin alphabet (A-Z) and, for each letter, every kana
 * (hiragana + katakana) whose romaji starts with it — a reverse index from
 * "how is this Roman letter written in Japanese" rather than from kana. */
export function AlphabetMode({ compact }: { compact: boolean }) {
  const byLetter = useMemo(() => groupByLatinLetter(KANA), []);

  if (compact) {
    return <div className="mode-compact">Mở cửa sổ chính để xem bảng chữ cái Alphabet.</div>;
  }

  return (
    <div className="mode-page">
      <div className="mode-stage mode-stage-scroll">
        <div className="alphabet-sections">
          {LATIN_LETTERS.map((letter) => {
            const entries = byLetter.get(letter) ?? [];
            return (
              <div key={letter} className="alphabet-section">
                <h3 className="alphabet-section-title alphabet-letter-title">{letter}</h3>
                {entries.length > 0 ? (
                  <div className="alphabet-grid alphabet-grid-letter">
                    {entries.map((entry, i) => (
                      <AlphabetCell key={`${entry.type}-${entry.char}-${i}`} entry={entry} />
                    ))}
                  </div>
                ) : (
                  <div className="alphabet-letter-empty">Không có âm này trong tiếng Nhật</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
