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
    <div className="kana-settings">
      <h2>Kana Flashcards</h2>

      <label className="field">
        Character set
        <select value={typeFilter} onChange={(e) => onTypeFilterChange(e.target.value as typeof typeFilter)}>
          <option value="both">Hiragana + Katakana</option>
          <option value="hiragana">Hiragana only</option>
          <option value="katakana">Katakana only</option>
        </select>
      </label>

      <label className="field">
        Number of cards
        <input
          type="number"
          min={1}
          max={142}
          value={settings.cardsPerSession}
          onChange={(e) => updateKanaSettings({ cardsPerSession: Number(e.target.value) })}
        />
      </label>

      <label className="field">
        Speed (seconds per card)
        <input
          type="number"
          min={1}
          max={30}
          step={0.5}
          value={settings.intervalMs / 1000}
          onChange={(e) => updateKanaSettings({ intervalMs: Number(e.target.value) * 1000 })}
        />
      </label>

      <button className="primary" onClick={onStart}>
        Start session
      </button>
    </div>
  );
}
