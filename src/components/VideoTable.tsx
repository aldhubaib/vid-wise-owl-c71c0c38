import type { Video } from "@/data/mock";
import { Eye, Heart, MessageCircle, Clock, ArrowUpRight } from "lucide-react";

interface VideoTableProps {
  videos: Video[];
  onVideoClick: (videoId: string) => void;
}

const statusClass: Record<string, string> = {
  done: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  pending: "bg-elevated text-dim",
  analyzing: "bg-blue/10 text-blue",
};

const statusLabel: Record<string, string> = {
  done: "Done",
  failed: "Failed",
  pending: "Pending",
  analyzing: "Running",
};

export function VideoTable({ videos, onVideoClick }: VideoTableProps) {
  return (
    <>
      <div className="rounded-xl overflow-hidden border border-border" style={{ borderRadius: '12px' }}>
        {videos.map((v) => (
          <div
            key={v.id}
            onClick={() => onVideoClick(v.id)}
            className="bg-background flex items-center gap-3 px-4 py-3 hover:bg-[#0d0d10] transition-colors group border-b border-border last:border-b-0 cursor-pointer"
          >
            {/* Thumbnail placeholder */}
            <div className="w-10 h-10 rounded-lg bg-elevated shrink-0 flex items-center justify-center">
              <span className={`text-[9px] font-mono font-medium py-0.5 px-1 rounded ${
                v.type === "short"
                  ? "text-purple"
                  : "text-dim"
              }`}>
                {v.type === "short" ? "S" : "V"}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="text-[13px] font-medium text-foreground truncate"
                  dir="rtl"
                >
                  {v.title}
                </span>
                <ArrowUpRight className="w-3 h-3 text-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-dim font-mono flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {v.duration}
                </span>
                <span className="text-[10px] text-dim">{v.date}</span>
                <span className={`inline-flex items-center py-0.5 px-1.5 rounded text-[9px] font-mono font-medium whitespace-nowrap ${statusClass[v.status]}`}>
                  {statusLabel[v.status]}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-[12px] font-mono text-sensor">
                <Eye className="w-3 h-3 text-dim" />
                {v.views}
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-mono text-sensor">
                <Heart className="w-3 h-3 text-dim" />
                {v.likes}
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-mono text-sensor">
                <MessageCircle className="w-3 h-3 text-dim" />
                {v.comments}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-3 mt-2 flex-wrap gap-2">
        <span className="text-[11px] text-dim font-mono">1–{videos.length} of {videos.length}</span>
        <div className="flex items-center gap-1">
          <button disabled className="w-7 h-7 rounded-md border border-border bg-surface text-dim text-xs font-mono cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center">
            ‹
          </button>
          <button className="w-7 h-7 rounded-md border border-primary/30 bg-primary/10 text-primary text-xs font-mono flex items-center justify-center">
            1
          </button>
          <button disabled className="w-7 h-7 rounded-md border border-border bg-surface text-dim text-xs font-mono cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center">
            ›
          </button>
        </div>
      </div>
    </>
  );
}
