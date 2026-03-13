import { useRef, useEffect } from "react";
import type { Channel } from "@/data/mock";
import { RefreshCw, Play, Trash2, Calendar, Hash, TrendingUp, X, Film, Zap, Users, Eye, CircleDot, Clock, Timer } from "lucide-react";

interface ChannelRightPanelProps {
  channel: Channel;
  visible: boolean;
  onClose: () => void;
  videoCount?: number;
  shortCount?: number;
}

interface InfoRow {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
  status?: boolean;
}

const buildRows = (channel: Channel, videoCount?: number, shortCount?: number): InfoRow[] => [
  { icon: Hash, label: "Handle", value: channel.handle },
  { icon: Calendar, label: "Added", value: "Jan 15, 2026" },
  { icon: Film, label: "Videos", value: String(videoCount ?? 0) },
  { icon: Zap, label: "Shorts", value: String(shortCount ?? 0) },
  { icon: Users, label: "Subscribers", value: channel.subscribers },
  { icon: Eye, label: "Total Views", value: channel.views },
  { icon: TrendingUp, label: "Engagement", value: `${channel.engRate} ↑`, highlight: true },
  { icon: CircleDot, label: "Status", value: "● Active", status: true },
  { icon: Clock, label: "Last sync", value: channel.lastSynced.includes(",") ? `Today · ${channel.lastSynced.split(", ")[1]}` : channel.lastSynced },
  { icon: Timer, label: "Next sync", value: "Today · 7:59 AM" },
];

export function ChannelRightPanel({ channel, visible, onClose, videoCount, shortCount }: ChannelRightPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [visible, onClose]);

  if (!visible) return null;

  const rows = buildRows(channel, videoCount, shortCount);

  return (
    <div
      ref={ref}
      className="absolute top-2 right-2 w-[260px] rounded-xl bg-surface border border-border shadow-xl shadow-black/30 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-[11px] text-dim font-mono uppercase tracking-widest">Overview</span>
        <button onClick={onClose} className="w-5 h-5 rounded flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors">
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Info rows */}
      <div className="px-4 py-3 space-y-0">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-1.5">
              <row.icon className="w-3 h-3 text-dim" />
              <span className="text-[11px] text-dim">{row.label}</span>
            </div>
            <span className={`text-[12px] font-mono font-medium ${
              row.status ? "text-success" : row.highlight ? "text-primary" : "text-foreground"
            }`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-border space-y-1.5">
        <button className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-[11px] font-medium bg-elevated border border-border text-sensor cursor-pointer transition-all hover:bg-border hover:text-foreground">
          <RefreshCw className="w-3 h-3" />
          Sync Now
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-[11px] font-medium bg-primary/10 border border-primary/15 text-primary cursor-pointer transition-all hover:bg-primary/15">
          <Play className="w-3 h-3" />
          Analyze All
        </button>
        <button className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-[11px] font-medium bg-transparent border border-destructive/15 text-destructive cursor-pointer transition-all hover:bg-destructive/[0.06]">
          <Trash2 className="w-3 h-3" />
          Remove
        </button>
      </div>
    </div>
  );
}
