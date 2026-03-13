import type { Video } from "@/data/mock";
import { Eye, Play, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";

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
      <div className="hidden md:block rounded-xl overflow-hidden border border-border" style={{ borderRadius: '12px' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-elevated/40">
              <th className="text-[11px] text-dim font-medium py-2.5 px-4 text-left border-b border-border">Title</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Views</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Likes</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Date</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Status</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((v) => (
              <tr
                key={v.id}
                onClick={() => onVideoClick(v.id)}
                className="bg-background hover:bg-[#0d0d10] cursor-pointer transition-colors group"
              >
                <td className="py-2.5 px-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-elevated shrink-0 overflow-hidden">
                      {v.thumbnail ? (
                        <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-3 h-3 text-dim" />
                        </div>
                      )}
                    </div>
                    <span className="text-[13px] font-medium max-w-[320px] whitespace-nowrap overflow-hidden text-ellipsis block text-foreground" dir="rtl">
                      {v.title}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 border-b border-border text-[12px] font-mono text-sensor">{v.views}</td>
                <td className="py-2.5 px-3 border-b border-border text-[12px] font-mono text-sensor">{v.likes}</td>
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
      <div className="flex flex-col md:hidden rounded-xl overflow-hidden border border-border" style={{ borderRadius: '12px' }}>
        {videos.map((v) => (
          <div
            key={v.id}
            onClick={() => onVideoClick(v.id)}
            className="bg-background flex items-center gap-3 px-4 py-3 hover:bg-[#0d0d10] transition-colors border-b border-border last:border-b-0 cursor-pointer"
          >
            <div className="w-10 h-7 rounded bg-elevated shrink-0 overflow-hidden">
              {v.thumbnail ? (
                <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-3 h-3 text-dim" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate text-foreground mb-0.5" dir="rtl">{v.title}</div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-dim flex items-center gap-1">
                  <Eye className="w-2.5 h-2.5" />{v.views}
                </span>
                <span className="text-[10px] text-dim">{v.date}</span>
                <span className={`inline-flex items-center py-0.5 px-1.5 rounded text-[9px] font-mono font-medium ${statusClass[v.status]}`}>
                  {statusLabel[v.status]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-3 mt-2 flex-wrap gap-2">
        <span className="text-[11px] text-dim font-mono">Showing 1–{videos.length} of {videos.length}</span>
        <div className="flex items-center gap-1">
          <button disabled className="w-7 h-7 rounded-md border border-border bg-surface text-dim text-xs font-mono cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center">«</button>
          <button disabled className="w-7 h-7 rounded-md border border-border bg-surface text-dim text-xs font-mono cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center">‹</button>
          <button className="w-7 h-7 rounded-md border border-primary/30 bg-primary/10 text-primary text-xs font-mono flex items-center justify-center">1</button>
          <button disabled className="w-7 h-7 rounded-md border border-border bg-surface text-dim text-xs font-mono cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center">›</button>
          <button disabled className="w-7 h-7 rounded-md border border-border bg-surface text-dim text-xs font-mono cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center">»</button>
        </div>
      </div>
    </>
  );
}
