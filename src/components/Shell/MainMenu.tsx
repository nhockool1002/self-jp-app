import { useAppStore } from "../../lib/store";
import type { AppMode } from "../../lib/types";

const MODES: { id: AppMode; label: string }[] = [
  { id: "kana", label: "Kana" },
  { id: "kanji", label: "Kanji" },
  { id: "vocab", label: "Từ vựng" },
  { id: "grammar", label: "Ngữ pháp" },
  { id: "alphabet", label: "Alphabet" },
];

export function MainMenu() {
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);
  const setCompact = useAppStore((s) => s.setCompact);

  return (
    <nav className="main-menu">
      <div className="main-menu-tabs">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={mode === m.id ? "tab tab-active" : "tab"}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="main-menu-tools">
        <button
          className={mode === "about" ? "tab tab-active" : "tab"}
          onClick={() => setMode("about")}
          title="Giới thiệu"
        >
          ⓘ
        </button>
        <button className="compact-toggle" onClick={() => setCompact(true)} title="Chế độ thu nhỏ">
          ⤡
        </button>
      </div>
    </nav>
  );
}
