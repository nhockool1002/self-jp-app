import { useEffect, useState } from "react";
import vocabData from "../../data/vocab-mnn.json";
import { playAudio } from "../../lib/audio";
import { useAppStore } from "../../lib/store";
import type { VocabDataset, VocabEntry } from "../../lib/types";
import { AudioDirectionToggle } from "./AudioDirectionToggle";
import { AudioLessonPicker } from "./AudioLessonPicker";
import { AudioWordCard } from "./AudioWordCard";

const VOCAB: VocabDataset = vocabData as VocabDataset;
const LESSON_COUNT = Object.keys(VOCAB).length;
const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];
// How long the revealed meaning stays on screen before auto-advancing to
// the next word, so the transition doesn't feel abrupt.
const REVEAL_MS = 1500;

function shuffled<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function lessonOf(entry: VocabEntry): number {
  return Number(entry.id.split("-")[0]);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AudioMode({ compact }: { compact: boolean }) {
  const selectedLessons = useAppStore((s) => s.settings.audio.selectedLessons);
  const pauseSec = useAppStore((s) => s.settings.audio.pauseSec);
  const speed = useAppStore((s) => s.settings.audio.speed);
  const direction = useAppStore((s) => s.settings.audio.direction);
  const updateAudioSettings = useAppStore((s) => s.updateAudioSettings);

  const [session, setSession] = useState<VocabEntry[] | null>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  function buildSession() {
    const pool = selectedLessons.flatMap((n) => VOCAB[String(n)] ?? []);
    setSession(shuffled(pool));
    setIndex(0);
    setRevealed(false);
    setIsPlaying(false);
  }

  // Build an initial mixed-and-shuffled session on mount; the user reshuffles
  // manually afterwards (via the button) so playback never resets mid-session.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    buildSession();
  }, []);

  const current = session && session.length > 0 ? session[Math.min(index, session.length - 1)] : null;

  useEffect(() => {
    setRevealed(false);
  }, [index, direction]);

  // Drives the play/guess/reveal/advance loop. Re-runs whenever the current
  // word, playback state, or direction changes, and its cleanup cancels the
  // in-flight chain — so pausing, or jumping via next/previous, stops the
  // old word cleanly instead of racing with the new one.
  //
  // jp-to-vi (listening): speak the Japanese first, pause for the learner to
  // guess the meaning, then reveal the Vietnamese text.
  // vi-to-jp (speaking recall): the Vietnamese meaning is already visible as
  // the prompt, so pause first for the learner to attempt saying the
  // Japanese aloud, then reveal + speak the Japanese as the answer.
  useEffect(() => {
    if (!isPlaying || !session || session.length === 0) return;
    let cancelled = false;
    const word = session[index];
    // A failed TTS call (e.g. no voice installed) shouldn't hang the
    // session forever — fall through to the rest of the sequence regardless.
    const speak = () => playAudio({ type: "tts", text: word.kana, rate: speed }).catch(() => {});
    (async () => {
      if (direction === "jp-to-vi") {
        await speak();
        if (cancelled) return;
        await delay(pauseSec * 1000);
        if (cancelled) return;
        setRevealed(true);
      } else {
        await delay(pauseSec * 1000);
        if (cancelled) return;
        setRevealed(true);
        await speak();
        if (cancelled) return;
      }
      await delay(REVEAL_MS);
      if (cancelled) return;
      if (index + 1 >= session.length) {
        setIsPlaying(false);
        return;
      }
      setIndex(index + 1);
    })();
    return () => {
      cancelled = true;
    };
  }, [isPlaying, index, session, speed, pauseSec, direction]);

  function goNext() {
    if (!session) return;
    setIndex((i) => Math.min(i + 1, session.length - 1));
  }

  function goPrev() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  const playbackControls = current && session && (
    <>
      <AudioDirectionToggle />
      <span className="control-divider" />
      <select
        className="control-select"
        value={speed}
        onChange={(e) => updateAudioSettings({ speed: Number(e.target.value) })}
        title="Tốc độ đọc"
      >
        {SPEED_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}x
          </option>
        ))}
      </select>
      <label className="field-compact">
        Dừng
        <input
          type="number"
          min={1}
          max={15}
          value={pauseSec}
          onChange={(e) => updateAudioSettings({ pauseSec: Number(e.target.value) })}
        />
        giây
      </label>
      <button onClick={buildSession} title="Trộn lại">
        🔀
      </button>
      <span className="control-divider" />
      <button onClick={goPrev} disabled={index === 0} title="Trước">
        ◀
      </button>
      <button onClick={() => setIsPlaying((v) => !v)} title={isPlaying ? "Tạm dừng" : "Phát"}>
        {isPlaying ? "⏸" : "▶"}
      </button>
      <button onClick={goNext} disabled={index === session.length - 1} title="Tiếp">
        ▶
      </button>
      <span className="kana-progress">
        {index + 1} / {session.length} (Bài {lessonOf(current)})
      </span>
    </>
  );

  if (compact) {
    if (!current) {
      return <div className="mode-compact">Chưa có từ. Mở rộng để chọn bài.</div>;
    }
    return (
      <div className="mode-compact">
        <AudioWordCard
          entry={current}
          lesson={lessonOf(current)}
          direction={direction}
          revealed={revealed}
          onReveal={() => setRevealed((v) => !v)}
          compact
        />
        <div className="kana-controls">
          <button onClick={goPrev} disabled={index === 0}>
            ◀
          </button>
          <button onClick={() => setIsPlaying((v) => !v)}>{isPlaying ? "⏸" : "▶"}</button>
          <button onClick={goNext} disabled={!session || index === session.length - 1}>
            ▶
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mode-page">
      <div className="mode-controls-bar">
        <button
          className={showPicker ? "tab tab-active" : "tab"}
          onClick={() => setShowPicker((v) => !v)}
        >
          {showPicker ? "✕ Đóng" : `🎵 Chọn bài (${selectedLessons.length})`}
        </button>
        {!showPicker && playbackControls}
      </div>

      <div className={showPicker ? "mode-stage mode-stage-scroll" : "mode-stage"}>
        {showPicker ? (
          <AudioLessonPicker
            lessonCount={LESSON_COUNT}
            selectedLessons={selectedLessons}
            onChange={(lessons) => updateAudioSettings({ selectedLessons: lessons })}
          />
        ) : current ? (
          <AudioWordCard
            entry={current}
            lesson={lessonOf(current)}
            direction={direction}
            revealed={revealed}
            onReveal={() => setRevealed((v) => !v)}
          />
        ) : (
          <p>Chưa chọn bài nào. Bấm "🎵 Chọn bài" để bắt đầu.</p>
        )}
      </div>
    </div>
  );
}
