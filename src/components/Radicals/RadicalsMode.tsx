import { useMemo, useState } from "react";
import radicalsData from "../../data/radicals.json";
import type { RadicalEntry } from "../../lib/types";

const RADICALS: RadicalEntry[] = radicalsData as RadicalEntry[];

const STROKE_COUNTS = Array.from(new Set(RADICALS.map((r) => r.strokes))).sort((a, b) => a - b);

export function RadicalsMode({ compact }: { compact: boolean }) {
  const [strokeFilter, setStrokeFilter] = useState<number | null>(null);

  const filtered = useMemo(
    () => (strokeFilter === null ? RADICALS : RADICALS.filter((r) => r.strokes === strokeFilter)),
    [strokeFilter]
  );

  if (compact) {
    return <div className="mode-compact">214 bộ thủ — xem ở chế độ đầy đủ.</div>;
  }

  return (
    <div className="mode-page">
      <div className="mode-controls-bar">
        <button
          className={strokeFilter === null ? "tab tab-active" : "tab"}
          onClick={() => setStrokeFilter(null)}
        >
          Tất cả
        </button>
        <span className="control-divider" />
        {STROKE_COUNTS.map((count) => (
          <button
            key={count}
            className={strokeFilter === count ? "tab tab-active" : "tab"}
            onClick={() => setStrokeFilter(count)}
          >
            {count} nét
          </button>
        ))}
        <span className="progress-count">{filtered.length} / 214 bộ thủ</span>
      </div>

      <div className="mode-stage mode-stage-scroll">
        <table className="radicals-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Bộ thủ</th>
              <th>Số nét</th>
              <th>Hán Việt</th>
              <th>Ý nghĩa</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.no}>
                <td className="radicals-no">{r.no}</td>
                <td className="radicals-char">
                  {r.char}
                  {r.variants && <span className="radicals-variants"> ({r.variants})</span>}
                </td>
                <td>{r.strokes}</td>
                <td>{r.hanviet}</td>
                <td>{r.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
