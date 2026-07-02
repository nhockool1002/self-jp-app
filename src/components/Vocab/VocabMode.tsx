export function VocabMode({ compact }: { compact: boolean }) {
  return <div className={compact ? "mode-compact" : "mode"}>Vocab mode</div>;
}
