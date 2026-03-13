import type { Video } from "@/data/mock";
import { Eye, Heart, MessageCircle } from "lucide-react";

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
      {/* Desktop table */}
      <div className="hidden md:block border border-border rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface">
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Video</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Type</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border cursor-pointer hover:text-sensor">Views</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Likes</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Comments</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Date</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Status</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((v) => (
              <tr
                key={v.id}
                onClick={() => onVideoClick(v.id)}
                className="hover:bg-surface/50 cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-7 rounded bg-elevated shrink-0" />
                    <span className="text-[13px] font-medium max-w-[320px] whitespace-nowrap overflow-hidden text-ellipsis block text-foreground" dir="rtl">
                      {v.title}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 border-b border-border">
                  <span className={`text-[10px] font-mono py-0.5 px-1.5 rounded border ${
                    v.type === "short"
                      ? "bg-purple/10 text-purple border-purple/15"
                      : "bg-elevated text-dim border-border"
                  }`}>
                    {v.type}
                  </span>
                </td>
                <td className="py-2.5 px-3 border-b border-border text-[12px] font-mono text-sensor">{v.views}</td>
                <td className="py-2.5 px-3 border-b border-border text-[12px] font-mono text-sensor">{v.likes}</td>
                <td className="py-2.5 px-3 border-b border-border text-[12px] font-mono text-sensor">{v.comments}</td>
                <td className="py-2.5 px-3 border-b border-border text-[11px] font-mono text-dim">{v.date}</td>
                <td className="py-2.5 px-3 border-b border-border">
                  <span className={`inline-flex items-center py-0.5 px-2 rounded text-[10px] font-mono font-medium whitespace-nowrap ${statusClass[v.status]}`}>
                    {statusLabel[v.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-2 md:hidden">
        {videos.map((v) => (
          <div
            key={v.id}
            onClick={() => onVideoClick(v.id)}
            className="bg-surface border border-border rounded-lg p-3 flex gap-3 cursor-pointer hover:bg-elevated/50 transition-colors"
          >
            <div className="w-20 h-[46px] rounded bg-elevated shrink-0" />
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="text-[13px] font-medium line-clamp-2 text-foreground" dir="rtl" style={{ textAlign: "right" }}>
                {v.title}
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-3">
                  <span className="text-[11px] font-mono text-dim flex items-center gap-1">
                    <Eye className="w-3 h-3" />{v.views}
                  </span>
                  <span className="text-[11px] font-mono text-dim flex items-center gap-1">
                    <Heart className="w-3 h-3" />{v.likes}
                  </span>
                </div>
                <span className={`inline-flex items-center py-0.5 px-2 rounded text-[10px] font-mono font-medium whitespace-nowrap ${statusClass[v.status]}`}>
                  {statusLabel[v.status]}
                </span>
              </div>
              <div className="text-[10px] font-mono text-dim">{v.date}</div>
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
