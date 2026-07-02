import type { VocabEntry } from "../../lib/types";

interface VocabWordCardProps {
  entry: VocabEntry;
  onPlayAudio: () => void;
}

export function VocabWordCard({ entry, onPlayAudio }: VocabWordCardProps) {
  return (
    <div className="vocab-word-card">
      <div className="vocab-word-main">
        {entry.kanji && <span className="vocab-kanji">{entry.kanji}</span>}
        <span className="vocab-kana">{entry.kana}</span>
      </div>
      <div className="vocab-meaning">{entry.meaning}</div>
      <button className="kana-audio-btn" onClick={onPlayAudio} title="Play audio">
        🔊
      </button>
    </div>
  );
}
