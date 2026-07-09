import type { AudioDirection, VocabEntry } from "../../lib/types";

interface AudioWordCardProps {
  entry: VocabEntry;
  lesson: number;
  direction: AudioDirection;
  revealed: boolean;
  onReveal: () => void;
  compact?: boolean;
}

export function AudioWordCard({ entry, lesson, direction, revealed, onReveal, compact }: AudioWordCardProps) {
  const japanese = (
    <div className="audio-word-main">
      {entry.kanji && <span className="audio-word-kanji jp-text">{entry.kanji}</span>}
      <span className="audio-word-kana jp-text">{entry.kana}</span>
    </div>
  );

  const isJpToVi = direction === "jp-to-vi";
  const prompt = isJpToVi ? japanese : <div className="audio-word-prompt">{entry.meaning}</div>;
  const answerHint = isJpToVi ? "Đoán nghĩa… (bấm để xem)" : "Nói thử bằng tiếng Nhật… (bấm để xem)";
  const answer = isJpToVi ? (
    <div className="audio-word-meaning">{entry.meaning}</div>
  ) : (
    japanese
  );

  return (
    <div
      className={compact ? "audio-word-card audio-word-card-compact" : "audio-word-card"}
      onClick={onReveal}
    >
      <span className="audio-word-lesson">Bài {lesson}</span>
      {prompt}
      {revealed ? answer : <div className="audio-word-meaning audio-word-meaning-hidden">{answerHint}</div>}
    </div>
  );
}
