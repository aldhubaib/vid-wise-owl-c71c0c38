import type { Channel } from "@/data/mock";

interface ChannelRightPanelProps {
  channel: Channel;
  visible: boolean;
}

export function ChannelRightPanel({ channel, visible }: ChannelRightPanelProps) {
  return (
    <div
      className={`fixed top-[49px] right-0 w-[300px] h-[calc(100vh-49px)] overflow-y-auto bg-background border-l border-border px-6 py-8 transition-transform duration-250 ease-out z-50 hidden md:block ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <h3 className="text-[11px] text-dim font-mono uppercase tracking-widest mb-5">
        Channel Info
      </h3>

      {[
        { key: "Handle", val: channel.handle },
        { key: "Country", val: channel.country },
        { key: "Joined", val: channel.joinedDate },
        { key: "Category", val: channel.topCategory },
        { key: "Eng. Rate", val: channel.engRate, highlight: true },
        { key: "Avg Views", val: channel.avgViews, highlight: true },
      ].map((row) => (
        <div key={row.key} className="flex justify-between items-center py-1.5 border-b border-border last:border-b-0">
          <span className="text-xs text-dim">{row.key}</span>
          <span className={`text-xs font-mono text-right ${row.highlight ? "text-foreground" : "text-sensor"}`}>
            {row.val}
          </span>
        </div>
      ))}

      <div className="h-px bg-border my-5" />

      <h4 className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">
        Actions
      </h4>

      <button className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-medium bg-elevated border border-border text-sensor cursor-pointer transition-all hover:bg-border hover:text-foreground mb-1.5">
        ⟳ Sync Now
      </button>
      <button className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-medium bg-elevated border border-border text-sensor cursor-pointer transition-all hover:bg-border hover:text-foreground mb-1.5 font-semibold border-dim text-foreground">
        ▶ Analyze All Videos
      </button>
      <button className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-medium bg-transparent border border-destructive/20 text-destructive cursor-pointer transition-all hover:bg-destructive/[0.08]">
        ✕ Remove Channel
      </button>
    </div>
  );
}
