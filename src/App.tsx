import { useEffect, useState } from "react";
import { MainMenu } from "./components/Shell/MainMenu";
import { CompactBubble } from "./components/Shell/CompactBubble";
import { SplashScreen } from "./components/Shell/SplashScreen";
import { KanaMode } from "./components/Kana/KanaMode";
import { KanjiMode } from "./components/Kanji/KanjiMode";
import { VocabMode } from "./components/Vocab/VocabMode";
import { GrammarMode } from "./components/Grammar/GrammarMode";
import { AudioMode } from "./components/Audio/AudioMode";
import { AboutMode } from "./components/About/AboutMode";
import { useAppStore } from "./lib/store";
import "./App.css";

// Keep the splash on screen for at least this long so it reads as an
// intentional intro rather than a flash, even when hydration is instant.
const MIN_SPLASH_MS = 1200;
const SPLASH_FADE_MS = 300;

function App() {
  const mode = useAppStore((s) => s.mode);
  const isCompact = useAppStore((s) => s.isCompact);
  const hydrated = useAppStore((s) => s.hydrated);
  const hydrate = useAppStore((s) => s.hydrate);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated || !minTimeElapsed) return;
    const timer = setTimeout(() => setSplashVisible(false), SPLASH_FADE_MS);
    return () => clearTimeout(timer);
  }, [hydrated, minTimeElapsed]);

  if (splashVisible) {
    return <SplashScreen fadingOut={hydrated && minTimeElapsed} />;
  }

  return (
    <div className={isCompact ? "app app-compact" : "app"}>
      {isCompact ? <CompactBubble /> : <MainMenu />}
      <main className="mode-area">
        {mode === "kana" && <KanaMode compact={isCompact} />}
        {mode === "kanji" && <KanjiMode compact={isCompact} />}
        {mode === "vocab" && <VocabMode compact={isCompact} />}
        {mode === "grammar" && <GrammarMode compact={isCompact} />}
        {mode === "audio" && <AudioMode compact={isCompact} />}
        {mode === "about" && <AboutMode compact={isCompact} />}
      </main>
      {!isCompact && <footer className="app-footer">NhutNguyen © 2026</footer>}
    </div>
  );
}

export default App;
