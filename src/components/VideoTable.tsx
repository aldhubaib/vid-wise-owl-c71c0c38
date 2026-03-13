import { useState } from "react";
import type { Video, PipelineStep } from "@/data/mock";
import { PIPELINE_STEPS } from "@/data/mock";
import { Eye, Play, Check, X, Loader2, Minus } from "lucide-react";

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

function PipelineDots({ pipeline }: { pipeline: PipelineStep[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-0.5 relative">
      {pipeline.map((step, i) => {
        const isLast = i === pipeline.length - 1;
        return (
          <div key={step.name} className="flex items-center">
            <div
              className="relative"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Dot */}
              <div
                className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all ${
                  step.status === "done"
                    ? "bg-success/15"
                    : step.status === "failed"
                    ? "bg-destructive/15"
                    : step.status === "running"
                    ? "bg-blue/15"
                    : "bg-elevated"
                }`}
              >
                {step.status === "done" && <Check className="w-2.5 h-2.5 text-success" />}
                {step.status === "failed" && <X className="w-2.5 h-2.5 text-destructive" />}
                {step.status === "running" && <Loader2 className="w-2.5 h-2.5 text-blue animate-spin" />}
                {step.status === "waiting" && <Minus className="w-1.5 h-1.5 text-dim/40" />}
              </div>

              {/* Tooltip */}
              {hovered === i && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-surface border border-border shadow-lg shadow-black/30 z-50 whitespace-nowrap pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-100">
                  <div className="text-[11px] font-medium text-foreground">{step.name}</div>
                  <div className={`text-[10px] font-mono ${
                    step.status === "done" ? "text-success" :
                    step.status === "failed" ? "text-destructive" :
                    step.status === "running" ? "text-blue" : "text-dim"
                  }`}>
                    {step.status === "done" ? `✓ ${step.time}` :
                     step.status === "failed" ? "✗ Failed" :
                     step.status === "running" ? "⟳ Running…" : "Waiting"}
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-border" />
                </div>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className={`w-1.5 h-px ${
                step.status === "done" && pipeline[i + 1].status !== "waiting"
                  ? "bg-success/30"
                  : "bg-border"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PipelineProgress({ pipeline }: { pipeline: PipelineStep[] }) {
  const total = pipeline.length;
  const done = pipeline.filter(s => s.status === "done").length;
  const hasFailed = pipeline.some(s => s.status === "failed");
  const isRunning = pipeline.some(s => s.status === "running");
  const allDone = done === total;

  return (
    <div className="flex items-center gap-2.5">
      <PipelineDots pipeline={pipeline} />
      <span className={`text-[10px] font-mono whitespace-nowrap ${
        allDone ? "text-success" :
        hasFailed ? "text-destructive" :
        isRunning ? "text-blue" : "text-dim"
      }`}>
        {allDone ? "Complete" :
         hasFailed ? `Failed ${done}/${total}` :
         isRunning ? `${done}/${total}` :
         `0/${total}`}
      </span>
    </div>
  );
}

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
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Date</th>
              <th className="text-[11px] text-dim font-medium py-2.5 px-3 text-left border-b border-border">Pipeline</th>
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
                    <span className="text-[13px] font-medium max-w-[280px] whitespace-nowrap overflow-hidden text-ellipsis block text-foreground" dir="rtl">
                      {v.title}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 border-b border-border text-[12px] font-mono text-sensor">{v.views}</td>
                <td className="py-2.5 px-3 border-b border-border text-[11px] font-mono text-dim">{v.date}</td>
                <td className="py-2.5 px-3 border-b border-border">
                  <PipelineProgress pipeline={v.pipeline} />
                </td>
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
            className="bg-background px-4 py-3 hover:bg-[#0d0d10] transition-colors border-b border-border last:border-b-0 cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
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
                <div className="text-[13px] font-medium truncate text-foreground" dir="rtl">{v.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-mono text-dim flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />{v.views}
                  </span>
                  <span className="text-[10px] text-dim">{v.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pl-[52px]">
              <PipelineProgress pipeline={v.pipeline} />
              <span className={`inline-flex items-center py-0.5 px-1.5 rounded text-[9px] font-mono font-medium ${statusClass[v.status]}`}>
                {statusLabel[v.status]}
              </span>
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
