import { useAppStore } from "../../lib/store";
import type { AudioDirection } from "../../lib/types";

const OPTIONS: { id: AudioDirection; label: string }[] = [
  { id: "jp-to-vi", label: "🎧 Nghe → Đoán nghĩa" },
  { id: "vi-to-jp", label: "💬 Đọc nghĩa → Nói tiếng Nhật" },
];

export function AudioDirectionToggle() {
  const direction = useAppStore((s) => s.settings.audio.direction);
  const updateAudioSettings = useAppStore((s) => s.updateAudioSettings);

  return (
    <div className="audio-direction-toggle">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          className={o.id === direction ? "tab tab-active" : "tab"}
          onClick={() => updateAudioSettings({ direction: o.id })}
          title={o.label}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
