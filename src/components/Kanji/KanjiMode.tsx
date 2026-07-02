export function KanjiMode({ compact }: { compact: boolean }) {
  return <div className={compact ? "mode-compact" : "mode"}>Kanji mode</div>;
}
