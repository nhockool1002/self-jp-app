import type { KanaEntry } from "../../lib/types";

interface KanaFlashcardProps {
  entry: KanaEntry;
  showRomaji: boolean;
  onReveal: () => void;
  onPlayAudio: () => void;
  compact?: boolean;
}

export function KanaFlashcard({ entry, showRomaji, onReveal, onPlayAudio, compact }: KanaFlashcardProps) {
  return (
    <div className={compact ? "kana-card kana-card-compact" : "kana-card"} onClick={onReveal}>
      <div className="kana-char">{entry.char}</div>
      <div className="kana-romaji">{showRomaji ? entry.romaji : " "}</div>
      <button
        className="kana-audio-btn"
        onClick={(e) => {
          e.stopPropagation();
          onPlayAudio();
        }}
        title="Play audio"
      >
        🔊
      </button>
    </div>
  );
}
