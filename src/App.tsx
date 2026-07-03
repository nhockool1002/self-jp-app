import { useEffect } from "react";
import { MainMenu } from "./components/Shell/MainMenu";
import { CompactBubble } from "./components/Shell/CompactBubble";
import { KanaMode } from "./components/Kana/KanaMode";
import { KanjiMode } from "./components/Kanji/KanjiMode";
import { VocabMode } from "./components/Vocab/VocabMode";
import { GrammarMode } from "./components/Grammar/GrammarMode";
import { AboutMode } from "./components/About/AboutMode";
import { useAppStore } from "./lib/store";
import "./App.css";

function App() {
  const mode = useAppStore((s) => s.mode);
  const isCompact = useAppStore((s) => s.isCompact);
  const hydrated = useAppStore((s) => s.hydrated);
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!hydrated) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className={isCompact ? "app app-compact" : "app"}>
      {isCompact ? <CompactBubble /> : <MainMenu />}
      <main className="mode-area">
        {mode === "kana" && <KanaMode compact={isCompact} />}
        {mode === "kanji" && <KanjiMode compact={isCompact} />}
        {mode === "vocab" && <VocabMode compact={isCompact} />}
        {mode === "grammar" && <GrammarMode compact={isCompact} />}
        {mode === "about" && <AboutMode compact={isCompact} />}
      </main>
      {!isCompact && <footer className="app-footer">NhutNguyen © 2026</footer>}
    </div>
  );
}

export default App;
