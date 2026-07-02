import type { KanjiEntry } from "../../lib/types";

interface KanjiCardProps {
  entry: KanjiEntry;
  isStudied: boolean;
  onPlayAudio: () => void;
  onMarkStudied: () => void;
  compact?: boolean;
}

export function KanjiCard({ entry, isStudied, onPlayAudio, onMarkStudied, compact }: KanjiCardProps) {
  if (compact) {
    return (
      <div className="kanji-card kanji-card-compact">
        <div className="kanji-char">{entry.kanji}</div>
        <div className="kanji-meaning">{entry.meanings.join(", ")}</div>
        <div className="kanji-card-actions">
          <button className="kana-audio-btn" onClick={onPlayAudio} title="Play audio">
            🔊
          </button>
          <button onClick={onMarkStudied} disabled={isStudied}>
            {isStudied ? "✓ Studied" : "Mark studied"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kanji-card">
      <div className="kanji-card-header">
        <div className="kanji-char">{entry.kanji}</div>
        <button className="kana-audio-btn" onClick={onPlayAudio} title="Play audio">
          🔊
        </button>
      </div>

      <div className="kanji-jlpt-badge">{entry.jlpt}</div>

      <div className="kanji-detail">
        <div className="kanji-detail-row">
          <strong>Meaning:</strong> {entry.meanings.join(", ")}
        </div>
        {entry.onyomi.length > 0 && (
          <div className="kanji-detail-row">
            <strong>On&apos;yomi:</strong> {entry.onyomi.join("、")}
          </div>
        )}
        {entry.kunyomi.length > 0 && (
          <div className="kanji-detail-row">
            <strong>Kun&apos;yomi:</strong> {entry.kunyomi.join("、")}
          </div>
        )}
        {entry.strokes != null && (
          <div className="kanji-detail-row">
            <strong>Strokes:</strong> {entry.strokes}
          </div>
        )}
        {entry.exampleWords.length > 0 && (
          <div className="kanji-detail-row">
            <strong>Usage examples:</strong>
            <ul className="kanji-examples">
              {entry.exampleWords.map((w) => (
                <li key={w.word}>
                  {w.word} ({w.reading})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button className={isStudied ? "" : "primary"} onClick={onMarkStudied} disabled={isStudied}>
        {isStudied ? "✓ Studied today" : "Mark as studied"}
      </button>
    </div>
  );
}
