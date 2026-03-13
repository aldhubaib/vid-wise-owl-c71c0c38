import type { Video } from "@/data/mock";
import { RotateCcw, ExternalLink } from "lucide-react";

interface PipelineStep {
  name: string;
  status: "done" | "failed" | "waiting";
  time: string;
}

interface VideoRightPanelProps {
  video: Video;
  visible: boolean;
  pipeline: PipelineStep[];
}

export function VideoRightPanel({ video, visible, pipeline }: VideoRightPanelProps) {
  return (
    <div
      className={`fixed top-12 right-0 w-[300px] h-[calc(100vh-48px)] overflow-y-auto bg-background border-l border-border px-5 py-6 transition-transform duration-200 ease-out z-50 hidden md:block ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <h3 className="text-[11px] text-dim font-mono uppercase tracking-widest mb-4">
        Video Info
      </h3>

      {[
        { key: "Views", val: video.views },
        { key: "Likes", val: video.likes },
        { key: "Comments", val: video.comments },
        { key: "Duration", val: video.duration },
        { key: "Published", val: video.date },
        { key: "Type", val: video.type },
      ].map((row) => (
        <div key={row.key} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
          <span className="text-[12px] text-dim">{row.key}</span>
          <span className="text-[12px] font-mono text-sensor text-right">{row.val}</span>
        </div>
      ))}

      <div className="h-px bg-border my-5" />

      {/* Analysis Pipeline */}
      <h4 className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">
        Pipeline
      </h4>

      <div className="relative pl-5">
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
        {pipeline.map((step, i) => (
          <div key={i} className="relative pb-3.5 last:pb-0">
            <div className={`absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full border-2 border-background ${
              step.status === "done"
                ? "bg-primary ring-[3px] ring-primary/10"
                : step.status === "failed"
                ? "bg-destructive ring-[3px] ring-destructive/10"
                : "bg-dim"
            }`} />
            <div className={`text-[12px] font-medium ${step.status === "failed" ? "text-destructive" : "text-sensor"}`}>
              {step.name}
            </div>
            <div className={`text-[10px] font-mono ${step.status === "failed" ? "text-destructive/60" : "text-dim"}`}>
              {step.time}
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-border my-5" />

      <h4 className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">
        Actions
      </h4>

      <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[12px] font-medium bg-primary/10 border border-primary/15 text-primary cursor-pointer transition-all hover:bg-primary/15 mb-1.5">
        <RotateCcw className="w-3.5 h-3.5" />
        Re-analyze
      </button>
      <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[12px] font-medium bg-elevated border border-border text-sensor cursor-pointer transition-all hover:bg-border hover:text-foreground">
        <ExternalLink className="w-3.5 h-3.5" />
        Open on YouTube
      </button>
    </div>
  );
}
