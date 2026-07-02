import { useEffect, useRef, useState } from "react";
import kanaData from "../../data/kana.json";
import { playAudio } from "../../lib/audio";
import { useAppStore } from "../../lib/store";
import type { KanaEntry } from "../../lib/types";
import { KanaFlashcard } from "./KanaFlashcard";
import { KanaSettings } from "./KanaSettings";

const KANA: KanaEntry[] = kanaData as KanaEntry[];

function shuffled<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function speak(entry: KanaEntry) {
  void playAudio(
    entry.audioFile ? { type: "file", path: entry.audioFile } : { type: "tts", text: entry.char }
  );
}

export function KanaMode({ compact }: { compact: boolean }) {
  const intervalMs = useAppStore((s) => s.settings.kana.intervalMs);
  const [typeFilter, setTypeFilter] = useState<KanaEntry["type"] | "both">("both");
  const [session, setSession] = useState<KanaEntry[] | null>(null);
  const [index, setIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cardsPerSession = useAppStore((s) => s.settings.kana.cardsPerSession);

  function startSession() {
    const pool = typeFilter === "both" ? KANA : KANA.filter((k) => k.type === typeFilter);
    const cards = shuffled(pool).slice(0, cardsPerSession);
    setSession(cards);
    setIndex(0);
    setShowRomaji(false);
    setIsPlaying(true);
  }

  const current = session ? session[index] : null;

  useEffect(() => {
    if (current) speak(current);
    setShowRomaji(false);
  }, [current]);

  useEffect(() => {
    if (!isPlaying || !session) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => {
        if (i + 1 >= session.length) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, session, intervalMs]);

  function goNext() {
    if (!session) return;
    setIndex((i) => Math.min(i + 1, session.length - 1));
  }

  function goPrev() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  if (compact) {
    if (!current) {
      return <div className="mode-compact">Start a kana session from the main window.</div>;
    }
    return (
      <div className="mode-compact">
        <KanaFlashcard
          entry={current}
          showRomaji={showRomaji}
          onReveal={() => setShowRomaji((v) => !v)}
          onPlayAudio={() => speak(current)}
          compact
        />
        <div className="kana-progress">
          {index + 1} / {session!.length}
        </div>
      </div>
    );
  }

  return (
    <div className="mode kana-mode">
      <KanaSettings typeFilter={typeFilter} onTypeFilterChange={setTypeFilter} onStart={startSession} />

      {current && (
        <div className="kana-session">
          <KanaFlashcard
            entry={current}
            showRomaji={showRomaji}
            onReveal={() => setShowRomaji((v) => !v)}
            onPlayAudio={() => speak(current)}
          />
          <div className="kana-progress">
            {index + 1} / {session!.length}
          </div>
          <div className="kana-controls">
            <button onClick={goPrev} disabled={index === 0}>
              ◀ Prev
            </button>
            <button onClick={() => setIsPlaying((v) => !v)}>{isPlaying ? "Pause" : "Resume"}</button>
            <button onClick={goNext} disabled={index === session!.length - 1}>
              Next ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
