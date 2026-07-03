import { useAppStore } from "../../lib/store";

interface KanjiDailyProgressProps {
  studiedCount: number;
}

export function KanjiDailyProgress({ studiedCount }: KanjiDailyProgressProps) {
  const wordsPerDay = useAppStore((s) => s.settings.kanji.wordsPerDay);
  const updateKanjiSettings = useAppStore((s) => s.updateKanjiSettings);

  return (
    <>
      <label className="field-compact">
        Mỗi ngày
        <input
          type="number"
          min={1}
          max={50}
          value={wordsPerDay}
          onChange={(e) => updateKanjiSettings({ wordsPerDay: Number(e.target.value) })}
        />
      </label>
      <span className="progress-count">
        {studiedCount}/{wordsPerDay} hôm nay
      </span>
    </>
  );
}
