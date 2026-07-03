import { useEffect, useRef, useState } from "react";

interface StrokeData {
  viewBox: string;
  strokes: string[];
}

let strokesCache: Record<string, StrokeData> | null = null;
let strokesPromise: Promise<Record<string, StrokeData>> | null = null;

function loadStrokes(): Promise<Record<string, StrokeData>> {
  if (strokesCache) return Promise.resolve(strokesCache);
  if (!strokesPromise) {
    strokesPromise = fetch("/data/strokes.json")
      .then((res) => res.json())
      .then((data) => {
        strokesCache = data;
        return data;
      });
  }
  return strokesPromise;
}

function strokeStart(d: string): { x: number; y: number } | null {
  const m = /^M\s*(-?[\d.]+)[,\s]+(-?[\d.]+)/.exec(d.trim());
  return m ? { x: Number(m[1]), y: Number(m[2]) } : null;
}

const STROKE_DELAY_MS = 450;
const STROKE_DURATION_MS = 500;

export function StrokeOrderDiagram({ char, size = 140 }: { char: string; size?: number }) {
  const [data, setData] = useState<StrokeData | null>(null);
  const [playKey, setPlayKey] = useState(0);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    void loadStrokes().then((all) => {
      if (!cancelled) setData(all[char] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [char]);

  useEffect(() => {
    if (!data) return;
    const paths = pathRefs.current;
    for (const path of paths) {
      if (!path) continue;
      const length = path.getTotalLength();
      path.style.transition = "none";
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    }
    // Force reflow so the transition below actually animates from the reset state.
    void paths[0]?.getBoundingClientRect();
    paths.forEach((path, i) => {
      if (!path) return;
      path.style.transition = `stroke-dashoffset ${STROKE_DURATION_MS}ms ease ${i * STROKE_DELAY_MS}ms`;
      path.style.strokeDashoffset = "0";
    });
  }, [data, playKey]);

  if (!data) return null;

  return (
    <div className="stroke-diagram">
      <svg
        viewBox={data.viewBox}
        width={size}
        height={size}
        className="stroke-diagram-svg"
      >
        {data.strokes.map((d, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
            fill="none"
            stroke="#0f0f0f"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {data.strokes.map((d, i) => {
          const start = strokeStart(d);
          if (!start) return null;
          return (
            <text key={`n${i}`} x={start.x - 4} y={start.y - 2} className="stroke-diagram-number">
              {i + 1}
            </text>
          );
        })}
      </svg>
      <button className="stroke-diagram-replay" onClick={() => setPlayKey((k) => k + 1)} title="Xem lại nét vẽ">
        ↻ Xem lại ({data.strokes.length} nét)
      </button>
    </div>
  );
}
