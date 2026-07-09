import { useAppStore } from "../../lib/store";
import type { AppMode } from "../../lib/types";

const MODES: { id: AppMode; label: string; icon: string }[] = [
  { id: "kana", label: "Kana", icon: "🔤" },
  { id: "kanji", label: "Kanji", icon: "字" },
  { id: "vocab", label: "Từ vựng", icon: "📚" },
  { id: "grammar", label: "Ngữ pháp", icon: "📝" },
  { id: "audio", label: "Nghe từ vựng", icon: "🎧" },
];

const ABOUT_TAB = { id: "about" as const, label: "Giới thiệu", icon: "ℹ️" };

export function MainMenu() {
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);
  const setCompact = useAppStore((s) => s.setCompact);

  return (
    <>
      <nav className="main-menu">
        <div className="topbar-brand">
          <img src="/app-icon.png" alt="" className="topbar-logo" />
          <span className="topbar-title">Self JP App</span>
        </div>
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

      <nav className="bottom-nav">
        {[...MODES, ABOUT_TAB].map((m) => (
          <button
            key={m.id}
            className={mode === m.id ? "bottom-nav-item bottom-nav-item-active" : "bottom-nav-item"}
            onClick={() => setMode(m.id)}
          >
            <span className="bottom-nav-icon" aria-hidden="true">
              {m.icon}
            </span>
            <span className="bottom-nav-label">{m.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
