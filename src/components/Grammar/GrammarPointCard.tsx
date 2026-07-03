import type { GrammarPoint } from "../../lib/types";

interface GrammarPointCardProps {
  point: GrammarPoint;
  onPlayAudio: (text: string) => void;
  compact?: boolean;
}

export function GrammarPointCard({ point, onPlayAudio, compact }: GrammarPointCardProps) {
  const example = point.examples[0];

  return (
    <div className={compact ? "grammar-card grammar-card-compact" : "grammar-card"}>
      <div className="grammar-title">{point.title}</div>
      <div className="grammar-structure">{point.structure}</div>
      {!compact && <div className="grammar-explanation">{point.explanation}</div>}
      {example && (
        <div className="grammar-example">
          <div className="grammar-example-jp">
            {example.japanese}
            <button
              className="kana-audio-btn"
              onClick={() => onPlayAudio(example.reading)}
              title="Phát âm"
            >
              🔊
            </button>
          </div>
          <div className="grammar-example-reading">{example.reading}</div>
          <div className="grammar-example-meaning">{example.meaning}</div>
        </div>
      )}
    </div>
  );
}
