import { useAppStore } from "../../lib/store";

export function CompactBubble() {
  const setCompact = useAppStore((s) => s.setCompact);

  return (
    <div className="compact-header">
      <button className="compact-restore" onClick={() => setCompact(false)} title="Restore">
        ⤢
      </button>
    </div>
  );
}
