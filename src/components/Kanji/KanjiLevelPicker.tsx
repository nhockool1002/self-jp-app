import { useAppStore } from "../../lib/store";
import type { JlptLevel } from "../../lib/types";

const LEVELS: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export function KanjiLevelPicker() {
  const currentLevel = useAppStore((s) => s.settings.kanji.currentLevel);
  const updateKanjiSettings = useAppStore((s) => s.updateKanjiSettings);

  return (
    <div className="kanji-level-picker">
      {LEVELS.map((level) => (
        <button
          key={level}
          className={level === currentLevel ? "tab tab-active" : "tab"}
          onClick={() => updateKanjiSettings({ currentLevel: level })}
        >
          {level}
        </button>
      ))}
    </div>
  );
}
