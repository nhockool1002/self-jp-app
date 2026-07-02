export function KanaMode({ compact }: { compact: boolean }) {
  return <div className={compact ? "mode-compact" : "mode"}>Kana mode</div>;
}
