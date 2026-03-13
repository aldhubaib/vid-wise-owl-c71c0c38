import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCw, Pause, Circle, ChevronDown, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { channels } from "@/data/mock";
import { pipelineStats, pipelineStages, type PipelineStageData, type PipelineItem } from "@/data/pipelineMock";

export default function Pipeline() {
  const s = pipelineStats;
  const [countdown, setCountdown] = useState(21);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 0 ? 21 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-[#151619] shrink-0 max-lg:px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-[13px] font-medium text-foreground">Pipeline</h1>
          <span className="text-[11px] text-dim font-mono">Est. ~1h 57m · Refreshing in 21s</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/15 text-success text-[11px] font-medium">
            <Circle className="w-2 h-2 fill-current" />
            System running
          </span>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-[11px] text-dim font-medium hover:text-sensor transition-colors">
            <Pause className="w-3 h-3" />
            Pause
          </button>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-[11px] text-dim font-medium hover:text-sensor transition-colors">
            <RotateCw className="w-3 h-3" />
            Retry all failed (8)
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto">
      {/* Stats row */}
      <div className="px-6 max-lg:px-4 mb-5 pt-5">
        <div className="flex rounded-xl overflow-hidden">
          {/* Total */}
          <div className="px-5 py-4 bg-background border-r border-background min-w-[140px]">
            <div className="text-2xl font-semibold font-mono tracking-tight">{s.totalVideos}</div>
            <div className="text-[10px] text-dim font-mono uppercase tracking-wider mt-1">Total Videos</div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-dim font-mono">
              <span>{s.inPipeline} in pipeline</span>
              <span>{s.done} done</span>
            </div>
          </div>
          {/* Stage stats */}
          {s.stages.map((stage) => {
            const colorClass = stage.color === "orange" ? "text-orange" : stage.color === "blue" ? "text-blue" : stage.color === "purple" ? "text-purple" : stage.color === "success" ? "text-success" : stage.color === "destructive" ? "text-destructive" : "text-primary";
            return (
            <div key={stage.label} className="flex-1 px-5 py-4 bg-background border-r border-background last:border-r-0">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-semibold font-mono tracking-tight ${colorClass}`}>{stage.count}</span>
                {stage.eta && (
                  <span className="text-[10px] text-dim font-mono">{stage.eta} ⏱</span>
                )}
              </div>
              <div className="text-[10px] text-dim font-mono uppercase tracking-wider mt-1">{stage.label}</div>
              <div className="flex items-center justify-between mt-2 text-[11px] font-mono">
                <span className="text-dim">{stage.active} active</span>
                <span className="text-orange">{stage.remaining} left</span>
              </div>
            </div>
            );
          })}
          {/* Failed */}
          <div className="px-5 py-4 bg-background min-w-[120px]">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold font-mono tracking-tight text-destructive">{s.failed.count}</span>
              <span className="text-[10px] text-dim font-mono">{s.failed.errors}</span>
            </div>
            <div className="text-[10px] text-dim font-mono uppercase tracking-wider mt-1">FAILED</div>
            <div className="mt-2 text-[11px] font-mono text-destructive">{s.failed.needsRetry}</div>
          </div>
        </div>
      </div>

      {/* Stage columns */}
      <div className="flex-1 px-6 pb-8 max-lg:px-4 overflow-x-auto">
        {/* Top row: first 3 stages */}
        <div className="grid grid-cols-3 gap-4 mb-4 max-lg:grid-cols-1 items-start">
          {pipelineStages.slice(0, 3).map((stage) => (
            <StageColumn key={stage.id} stage={stage} />
          ))}
        </div>
        {/* Bottom row: analysis + failed */}
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1 items-start">
          {pipelineStages.slice(3).map((stage) => (
            <StageColumn key={stage.id} stage={stage} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

function StageColumn({ stage }: { stage: PipelineStageData }) {
  const isFailed = stage.id === "failed";

  return (
    <div className="rounded-xl border border-border overflow-hidden flex flex-col h-[420px]">
      {/* Stage header */}
      <div className="px-4 py-3 bg-background shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            {stage.number > 0 && (
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                isFailed ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"
              }`}>
                {isFailed ? "!" : stage.number}
              </span>
            )}
            {isFailed && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center bg-destructive/15 text-destructive">
                <AlertTriangle className="w-3 h-3" />
              </span>
            )}
            <span className="text-[13px] font-semibold">{stage.label}</span>
            <span className="text-[12px] text-dim font-mono">({stage.count})</span>
          </div>
          <button className="inline-flex items-center gap-1 text-[11px] text-dim font-mono hover:text-sensor transition-colors">
            <RotateCw className="w-3 h-3" />
            All
          </button>
        </div>
        
        
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto bg-background">
        {stage.items.map((item) => (
          <PipelineItemRow key={item.id} item={item} isFailed={isFailed} />
        ))}
      </div>

      {/* More count - pinned to bottom */}
      {stage.moreCount > 0 && (
        <div className="px-4 py-3 border-t border-border bg-background shrink-0">
          <button className="flex items-center gap-1.5 text-[12px] text-dim font-mono hover:text-sensor transition-colors">
            <ChevronDown className="w-3 h-3" />
            +{stage.moreCount} more
          </button>
        </div>
      )}
    </div>
  );
}

function PipelineItemRow({ item, isFailed }: { item: PipelineItem; isFailed: boolean }) {
  const navigate = useNavigate();
  const channel = channels.find((c) => c.id === item.channelId);

  return (
    <div
      onClick={() => item.videoId && navigate(`/video/${item.videoId}`)}
      className={`px-4 py-3 border-t border-border hover:bg-surface/50 transition-colors group ${item.videoId ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between mb-2">
        {/* Left: channel avatar + status */}
        <div className="flex items-center gap-2 min-w-0">
          {channel && (
            <img
              src={channel.avatarImg}
              alt={channel.name}
              className="w-6 h-6 rounded-full object-cover shrink-0"
            />
          )}
          <div className="min-w-0">
            {item.status === "processing" && !isFailed && (
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[11px] text-success font-mono">{item.statusDetail || "Processing..."}</span>
              </div>
            )}
            {isFailed && item.errorReason && (
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                <span className="text-[11px] text-destructive/80 font-mono">{item.errorReason}</span>
              </div>
            )}
            {item.progress && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[11px] text-success font-mono">{item.progress}</span>
              </div>
            )}
          </div>
        </div>
        {/* Right: title */}
        <div className="flex items-center gap-1.5 shrink-0 max-w-[55%]">
          <span className="text-[13px] text-foreground font-medium text-right" dir="rtl">
            {item.title}
          </span>
          {item.videoId && (
            <ArrowUpRight className="w-3 h-3 text-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-dim font-mono">
          {item.timeInStage && `⏱ ${item.timeInStage}`}
        </span>
        {item.retries > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-1 text-[10px] text-dim font-mono">
                <RotateCw className="w-2.5 h-2.5" />
                {item.retries}
              </span>
            </TooltipTrigger>
            <TooltipContent side="left">Attempted {item.retries} times</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
