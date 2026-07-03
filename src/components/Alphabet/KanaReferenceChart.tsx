import { useMemo, useState } from "react";
import kanaData from "../../data/kana.json";
import type { KanaEntry } from "../../lib/types";
import { alphabetSections } from "./alphabetLayout";
import { AlphabetCell } from "./AlphabetCell";

const KANA: KanaEntry[] = kanaData as KanaEntry[];

/** Full gojuon reference chart (seion/dakuten/handakuten/yoon), embedded as a
 * toggle-able view inside Kana mode rather than its own top-level tab. */
export function KanaReferenceChart() {
  const [type, setType] = useState<"hiragana" | "katakana">("hiragana");

  const byChar = useMemo(() => {
    const map = new Map<string, KanaEntry>();
    for (const entry of KANA) {
      if (entry.type === type) map.set(entry.char, entry);
    }
    return map;
  }, [type]);

  const sections = alphabetSections(type);

  return (
    <div className="kana-chart">
      <div className="kana-chart-toggle">
        <button
          className={type === "hiragana" ? "tab tab-active" : "tab"}
          onClick={() => setType("hiragana")}
        >
          Hiragana
        </button>
        <button
          className={type === "katakana" ? "tab tab-active" : "tab"}
          onClick={() => setType("katakana")}
        >
          Katakana
        </button>
      </div>

      <div className="alphabet-sections">
        {sections.map((section) => (
          <div key={section.title} className="alphabet-section">
            <h3 className="alphabet-section-title">{section.title}</h3>
            <div
              className="alphabet-grid"
              style={{ gridTemplateColumns: `repeat(${section.rows[0]?.length ?? 5}, 1fr)` }}
            >
              {section.rows.map((row, ri) =>
                row.map((char, ci) => (
                  <AlphabetCell key={`${ri}-${ci}`} entry={char ? (byChar.get(char) ?? null) : null} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
