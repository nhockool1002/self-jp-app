import type { KanaEntry } from "../../lib/types";
import { StrokeOrderDiagram } from "../Strokes/StrokeOrderDiagram";

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
      <div className="kana-romaji">{showRomaji ? entry.romaji : " "}</div>
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
      {!compact && showRomaji && (
        <div onClick={(e) => e.stopPropagation()}>
          <StrokeOrderDiagram char={entry.char} />
        </div>
      )}
    </div>
  );
}
