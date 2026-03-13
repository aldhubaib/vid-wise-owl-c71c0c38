import type { Channel } from "@/data/mock";
import { RefreshCw, Play, Trash2 } from "lucide-react";

interface ChannelRightPanelProps {
  channel: Channel;
  visible: boolean;
}

export function ChannelRightPanel({ channel, visible }: ChannelRightPanelProps) {
  return (
    <div
      className={`fixed top-12 right-0 w-[300px] h-[calc(100vh-48px)] overflow-y-auto bg-background border-l border-border px-5 py-6 transition-transform duration-200 ease-out z-50 hidden md:block ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <h3 className="text-[11px] text-dim font-mono uppercase tracking-widest mb-4">
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
        <div key={row.key} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
          <span className="text-[12px] text-dim">{row.key}</span>
          <span className={`text-[12px] font-mono text-right ${row.highlight ? "text-foreground" : "text-sensor"}`}>
            {row.val}
          </span>
        </div>
      ))}

      <div className="h-px bg-border my-5" />

      <h4 className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">
        Actions
      </h4>

      <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[12px] font-medium bg-elevated border border-border text-sensor cursor-pointer transition-all hover:bg-border hover:text-foreground mb-1.5">
        <RefreshCw className="w-3.5 h-3.5" />
        Sync Now
      </button>
      <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[12px] font-medium bg-primary/10 border border-primary/15 text-primary cursor-pointer transition-all hover:bg-primary/15 mb-1.5">
        <Play className="w-3.5 h-3.5" />
        Analyze All Videos
      </button>
      <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[12px] font-medium bg-transparent border border-destructive/15 text-destructive cursor-pointer transition-all hover:bg-destructive/[0.06]">
        <Trash2 className="w-3.5 h-3.5" />
        Remove Channel
      </button>
    </div>
  );
}
