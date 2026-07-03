import { useAppStore } from "../../lib/store";
import type { KanaEntry } from "../../lib/types";

interface KanaSettingsProps {
  typeFilter: KanaEntry["type"] | "both";
  onTypeFilterChange: (filter: KanaEntry["type"] | "both") => void;
  onStart: () => void;
}

export function KanaSettings({ typeFilter, onTypeFilterChange, onStart }: KanaSettingsProps) {
  const settings = useAppStore((s) => s.settings.kana);
  const updateKanaSettings = useAppStore((s) => s.updateKanaSettings);

  return (
    <>
      <select
        className="control-select"
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value as typeof typeFilter)}
      >
        <option value="hiragana">Hiragana</option>
        <option value="katakana">Katakana</option>
        <option value="both">Cả hai</option>
      </select>

      <label className="field-compact">
        Số thẻ
        <input
          type="number"
          min={1}
          max={142}
          value={settings.cardsPerSession}
          onChange={(e) => updateKanaSettings({ cardsPerSession: Number(e.target.value) })}
        />
      </label>

      <label className="field-compact">
        Tốc độ
        <input
          type="number"
          min={1}
          max={30}
          step={0.5}
          value={settings.intervalMs / 1000}
          onChange={(e) => updateKanaSettings({ intervalMs: Number(e.target.value) * 1000 })}
        />
        giây
      </label>

      <button onClick={onStart}>Phiên mới</button>
    </>
  );
}
