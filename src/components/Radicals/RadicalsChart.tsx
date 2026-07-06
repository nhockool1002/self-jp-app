import { useMemo, useState } from "react";
import radicalsData from "../../data/radicals.json";
import type { RadicalEntry } from "../../lib/types";

const RADICALS: RadicalEntry[] = radicalsData as RadicalEntry[];

const BUCKETS = ["1 nét", "2 nét", "3 nét", "4 nét", "5 nét", "Nhiều nét"] as const;
type Bucket = (typeof BUCKETS)[number];

function bucketOf(strokes: number): Bucket {
  return strokes <= 5 ? (`${strokes} nét` as Bucket) : "Nhiều nét";
}

const GROUPS: { bucket: Bucket; items: RadicalEntry[] }[] = BUCKETS.map((bucket) => ({
  bucket,
  items: RADICALS.filter((r) => bucketOf(r.strokes) === bucket),
}));

/** Full 214 Kangxi radical reference, grouped by stroke-count bucket as a
 * card grid (big character + Hán Việt + meaning) rather than a plain table,
 * so it reads more like flashcards than a spreadsheet. */
export function RadicalsChart() {
  const [activeBucket, setActiveBucket] = useState<Bucket | null>(null);

  const visibleGroups = useMemo(
    () => (activeBucket === null ? GROUPS : GROUPS.filter((g) => g.bucket === activeBucket)),
    [activeBucket]
  );

  return (
    <div className="radicals-chart">
      <div className="radicals-chart-toggle">
        <button
          className={activeBucket === null ? "tab tab-active" : "tab"}
          onClick={() => setActiveBucket(null)}
        >
          Tất cả
        </button>
        {BUCKETS.map((bucket) => (
          <button
            key={bucket}
            className={activeBucket === bucket ? "tab tab-active" : "tab"}
            onClick={() => setActiveBucket(bucket)}
          >
            {bucket}
          </button>
        ))}
      </div>

      <div className="radicals-groups">
        {visibleGroups.map((group) => (
          <div key={group.bucket} className="radicals-group">
            <h3 className="radicals-group-title">
              {group.bucket} <span className="radicals-group-count">({group.items.length})</span>
            </h3>
            <div className="radicals-grid">
              {group.items.map((r) => (
                <div key={r.no} className="radical-card">
                  <span className="radical-card-strokes">{r.strokes}</span>
                  <div className="radical-card-char">
                    {r.char}
                    {r.variants && <span className="radical-card-variants"> {r.variants}</span>}
                  </div>
                  <div className="radical-card-hanviet">{r.hanviet}</div>
                  <div className="radical-card-meaning">{r.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
