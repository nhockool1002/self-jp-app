import type { KanaEntry } from "../../lib/types";
import { playAudio } from "../../lib/audio";

function speak(entry: KanaEntry) {
  void playAudio(
    entry.audioFile ? { type: "file", path: entry.audioFile } : { type: "tts", text: entry.char }
  );
}

export function AlphabetCell({ entry }: { entry: KanaEntry | null }) {
  if (!entry) return <div className="alphabet-cell alphabet-cell-empty" />;
  return (
    <button className="alphabet-cell" onClick={() => speak(entry)} title={`Phát âm ${entry.char}`}>
      <span className="alphabet-cell-char">{entry.char}</span>
      <span className="alphabet-cell-romaji">{entry.romaji.replace(/\(.*\)/, "")}</span>
    </button>
  );
}
