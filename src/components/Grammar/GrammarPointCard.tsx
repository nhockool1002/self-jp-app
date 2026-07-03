import type { GrammarExample, GrammarPoint } from "../../lib/types";

interface GrammarPointCardProps {
  point: GrammarPoint;
  onPlayAudio: (text: string) => void;
  compact?: boolean;
}

function ExampleRow({
  example,
  onPlayAudio,
}: {
  example: GrammarExample;
  onPlayAudio: (text: string) => void;
}) {
  return (
    <div className="grammar-example">
      <div className="grammar-example-jp">
        {example.japanese}
        <button className="kana-audio-btn" onClick={() => onPlayAudio(example.reading)} title="Phát âm">
          🔊
        </button>
      </div>
      <div className="grammar-example-reading">{example.reading}</div>
      <div className="grammar-example-meaning">{example.meaning}</div>
    </div>
  );
}

export function GrammarPointCard({ point, onPlayAudio, compact }: GrammarPointCardProps) {
  if (compact) {
    const example = point.examples[0];
    return (
      <div className="grammar-card grammar-card-compact">
        <div className="grammar-title">{point.title}</div>
        <div className="grammar-structure">{point.structure}</div>
        {example && <ExampleRow example={example} onPlayAudio={onPlayAudio} />}
      </div>
    );
  }

  return (
    <div className="grammar-card">
      <div className="grammar-title">{point.title}</div>
      <div className="grammar-structure">{point.structure}</div>
      <div className="grammar-explanation">{point.explanation}</div>
      {point.note && (
        <div className="grammar-note">
          <strong>Lưu ý:</strong> {point.note}
        </div>
      )}
      {point.examples.map((example, i) => (
        <ExampleRow key={i} example={example} onPlayAudio={onPlayAudio} />
      ))}
    </div>
  );
}
