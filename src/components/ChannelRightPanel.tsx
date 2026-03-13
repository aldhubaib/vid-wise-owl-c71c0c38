import type { Channel } from "@/data/mock";
import { RefreshCw, Play, Trash2, Globe, Calendar, Hash, TrendingUp, Eye, Sparkles } from "lucide-react";

interface ChannelRightPanelProps {
  channel: Channel;
  visible: boolean;
}

const infoCards = (channel: Channel) => [
  { icon: Hash, label: "Handle", value: channel.handle },
  { icon: Globe, label: "Country", value: channel.country },
  { icon: Calendar, label: "Joined", value: channel.joinedDate },
  { icon: Sparkles, label: "Category", value: channel.topCategory },
  { icon: TrendingUp, label: "Eng. Rate", value: channel.engRate, highlight: true },
  { icon: Eye, label: "Avg Views", value: channel.avgViews, highlight: true },
];

export function ChannelRightPanel({ channel, visible }: ChannelRightPanelProps) {
  return (
    <div
      className={`fixed top-12 right-0 w-[300px] h-[calc(100vh-48px)] overflow-y-auto bg-background border-l border-border px-5 py-6 transition-transform duration-200 ease-out z-50 hidden md:block ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <h3 className="text-[11px] text-dim font-mono uppercase tracking-widest mb-4">
        Overview
      </h3>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {infoCards(channel).map((card) => (
          <div
            key={card.label}
            className="rounded-lg bg-elevated/60 border border-border/60 px-3 py-2.5 flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-1.5">
              <card.icon className="w-3 h-3 text-dim" />
              <span className="text-[10px] text-dim font-mono uppercase tracking-wider">{card.label}</span>
            </div>
            <span className={`text-[13px] font-mono font-medium truncate ${card.highlight ? "text-primary" : "text-foreground"}`}>
              {card.value}
            </span>
          </div>
        ))}
      </div>

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
