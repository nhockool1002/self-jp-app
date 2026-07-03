import { useMemo, useState } from "react";
import kanjiData from "../../data/kanji.json";
import { playAudio } from "../../lib/audio";
import { todayDateString, useAppStore } from "../../lib/store";
import type { KanjiDataset, KanjiEntry } from "../../lib/types";
import { KanjiCard } from "./KanjiCard";
import { KanjiDailyProgress } from "./KanjiDailyProgress";
import { KanjiLevelPicker } from "./KanjiLevelPicker";

const KANJI: KanjiDataset = kanjiData as KanjiDataset;

function speak(entry: KanjiEntry) {
  const reading = entry.onyomi[0] ?? entry.kunyomi[0] ?? entry.kanji;
  void playAudio({ type: "tts", text: reading });
}

export function KanjiMode({ compact }: { compact: boolean }) {
  const currentLevel = useAppStore((s) => s.settings.kanji.currentLevel);
  const wordsPerDay = useAppStore((s) => s.settings.kanji.wordsPerDay);
  const progress = useAppStore((s) => s.progress.kanji);
  const markKanjiStudied = useAppStore((s) => s.markKanjiStudied);
  const [index, setIndex] = useState(0);

  const studiedToday = useMemo(() => {
    const date = todayDateString();
    return new Set(progress.filter((r) => r.lastStudiedDate === date).map((r) => r.itemId));
  }, [progress]);

  const todaysList = useMemo(() => {
    const progressMap = new Map(progress.map((r) => [r.itemId, r]));
    const levelKanji = KANJI[currentLevel] ?? [];
    const sorted = [...levelKanji].sort((a, b) => {
      const pa = progressMap.get(a.kanji);
      const pb = progressMap.get(b.kanji);
      if (!pa && !pb) return 0;
      if (!pa) return -1;
      if (!pb) return 1;
      return pa.lastStudiedDate.localeCompare(pb.lastStudiedDate);
    });
    return sorted.slice(0, wordsPerDay);
  }, [currentLevel, wordsPerDay, progress]);

  const boundedIndex = Math.min(index, Math.max(todaysList.length - 1, 0));
  const current = todaysList[boundedIndex] ?? null;
  const studiedCount = todaysList.filter((k) => studiedToday.has(k.kanji)).length;

  if (compact) {
    if (!current) {
      return <div className="mode-compact">No kanji available for this level.</div>;
    }
    return (
      <div className="mode-compact">
        <KanjiCard
          entry={current}
          isStudied={studiedToday.has(current.kanji)}
          onPlayAudio={() => speak(current)}
          onMarkStudied={() => markKanjiStudied(current.kanji)}
          compact
        />
        <div className="kana-controls">
          <button onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={boundedIndex === 0}>
            ◀
          </button>
          <span className="kana-progress">
            {boundedIndex + 1} / {todaysList.length}
          </span>
          <button
            onClick={() => setIndex((i) => Math.min(i + 1, todaysList.length - 1))}
            disabled={boundedIndex === todaysList.length - 1}
          >
            ▶
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mode-page">
      <div className="mode-controls-bar">
        <KanjiLevelPicker />
        <span className="control-divider" />
        <KanjiDailyProgress studiedCount={studiedCount} />
        {current && (
          <>
            <span className="control-divider" />
            <button onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={boundedIndex === 0} title="Previous">
              ◀
            </button>
            <button
              onClick={() => setIndex((i) => Math.min(i + 1, todaysList.length - 1))}
              disabled={boundedIndex === todaysList.length - 1}
              title="Next"
            >
              ▶
            </button>
            <span className="kana-progress">
              {boundedIndex + 1} / {todaysList.length}
            </span>
          </>
        )}
      </div>

      <div className="mode-stage">
        {current ? (
          <KanjiCard
            entry={current}
            isStudied={studiedToday.has(current.kanji)}
            onPlayAudio={() => speak(current)}
            onMarkStudied={() => markKanjiStudied(current.kanji)}
          />
        ) : (
          <p>No kanji available for this level.</p>
        )}
      </div>
    </div>
  );
}
