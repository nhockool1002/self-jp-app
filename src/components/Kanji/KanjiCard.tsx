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
        {entry.hanviet && <div className="kanji-hanviet">{entry.hanviet}</div>}
        <div className="kanji-meaning">{entry.meanings.join(", ")}</div>
        <div className="kanji-card-actions">
          <button className="kana-audio-btn" onClick={onPlayAudio} title="Phát âm">
            🔊
          </button>
          <button onClick={onMarkStudied} disabled={isStudied}>
            {isStudied ? "✓ Đã học" : "Đã học"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kanji-card">
      <div className="kanji-card-columns">
        <div className="kanji-card-left">
          <div className="kanji-char">{entry.kanji}</div>
          <button className="kana-audio-btn" onClick={onPlayAudio} title="Phát âm">
            🔊
          </button>
          {entry.hanviet && <div className="kanji-hanviet">Hán Việt: {entry.hanviet}</div>}
          <div className="kanji-jlpt-badge">{entry.jlpt}</div>
        </div>

        <div className="kanji-detail">
          <div className="kanji-detail-row">
            <strong>Nghĩa:</strong> {entry.meanings.join(", ")}
          </div>
          {entry.onyomi.length > 0 && (
            <div className="kanji-detail-row">
              <strong>Âm On:</strong> {entry.onyomi.join("、")}
            </div>
          )}
          {entry.kunyomi.length > 0 && (
            <div className="kanji-detail-row">
              <strong>Âm Kun:</strong> {entry.kunyomi.join("、")}
            </div>
          )}
          {entry.strokes != null && (
            <div className="kanji-detail-row">
              <strong>Số nét:</strong> {entry.strokes}
            </div>
          )}
          {entry.exampleWords.length > 0 && (
            <div className="kanji-detail-row">
              <strong>Ví dụ:</strong>
              <ul className="kanji-examples">
                {entry.exampleWords.map((w) => (
                  <li key={w.word}>
                    {w.word} ({w.reading}) — {w.meaning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <button className={isStudied ? "" : "primary"} onClick={onMarkStudied} disabled={isStudied}>
        {isStudied ? "✓ Đã học hôm nay" : "Đánh dấu đã học"}
      </button>
    </div>
  );
}
