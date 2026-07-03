import { useEffect, useRef, useState } from "react";
import kanaData from "../../data/kana.json";
import { playAudio } from "../../lib/audio";
import { useAppStore } from "../../lib/store";
import type { KanaEntry } from "../../lib/types";
import { KanaFlashcard } from "./KanaFlashcard";
import { KanaSettings } from "./KanaSettings";
import { KanaReferenceChart } from "../Alphabet/KanaReferenceChart";

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
  const cardsPerSession = useAppStore((s) => s.settings.kana.cardsPerSession);
  const [typeFilter, setTypeFilter] = useState<KanaEntry["type"] | "both">("hiragana");
  const [session, setSession] = useState<KanaEntry[] | null>(null);
  const [index, setIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startSession() {
    const pool = typeFilter === "both" ? KANA : KANA.filter((k) => k.type === typeFilter);
    const cards = shuffled(pool).slice(0, cardsPerSession);
    setSession(cards);
    setIndex(0);
    setShowRomaji(false);
    setIsPlaying(true);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    startSession();
  }, []);

  const current = session ? session[index] : null;

  useEffect(() => {
    setShowRomaji(false);
  }, [current]);

  useEffect(() => {
    if (!isPlaying || !session || showChart) return;
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
  }, [isPlaying, session, intervalMs, showChart]);

  function goNext() {
    if (!session) return;
    setIndex((i) => Math.min(i + 1, session.length - 1));
  }

  function goPrev() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  if (compact) {
    if (!current) {
      return <div className="mode-compact">Đang bắt đầu phiên học…</div>;
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
    <div className="mode-page">
      <div className="mode-controls-bar">
        <button
          className={showChart ? "tab tab-active" : "tab"}
          onClick={() => setShowChart((v) => !v)}
        >
          {showChart ? "✕ Đóng bảng chữ cái" : "📖 Bảng chữ cái"}
        </button>
        {!showChart && (
          <>
            <span className="control-divider" />
            <KanaSettings typeFilter={typeFilter} onTypeFilterChange={setTypeFilter} onStart={startSession} />
            {current && session && (
              <>
                <span className="control-divider" />
                <button onClick={goPrev} disabled={index === 0} title="Trước">
                  ◀
                </button>
                <button onClick={() => setIsPlaying((v) => !v)}>{isPlaying ? "⏸" : "▶"}</button>
                <button onClick={goNext} disabled={index === session.length - 1} title="Tiếp">
                  ▶
                </button>
                <span className="kana-progress">
                  {index + 1} / {session.length}
                </span>
              </>
            )}
          </>
        )}
      </div>

      <div className={showChart ? "mode-stage mode-stage-scroll" : "mode-stage"}>
        {showChart ? (
          <KanaReferenceChart />
        ) : (
          current && (
            <KanaFlashcard
              entry={current}
              showRomaji={showRomaji}
              onReveal={() => setShowRomaji((v) => !v)}
              onPlayAudio={() => speak(current)}
            />
          )
        )}
      </div>
    </div>
  );
}
