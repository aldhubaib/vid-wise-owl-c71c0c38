import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { videos, channels, videoAnalysis } from "@/data/mock";
import { VideoRightPanel } from "@/components/VideoRightPanel";
import { ArrowLeft, Info, SmilePlus, HelpCircle, Meh, CheckCircle2, XCircle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

const tabList = ["Overview", "Sentiment", "Viral", "Comments", "Pipeline", "History"];

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const video = videos.find((v) => v.id === id);
  const channel = video ? channels.find((c) => c.id === video.channelId) : null;
  const [activeTab, setActiveTab] = useState("Overview");
  const [panelVisible, setPanelVisible] = useState(false);
  const closePanel = useCallback(() => setPanelVisible(false), []);
  const a = videoAnalysis;

  if (!video || !channel) {
    return <div className="p-10 text-sensor">Video not found</div>;
  }

  const stats = [
    { val: video.views, label: "Views" },
    { val: video.likes, label: "Likes" },
    { val: video.comments, label: "Comments" },
    { val: video.duration, label: "Duration" },
    { val: video.type === "short" ? "Short" : "Video", label: "Type" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-[#151619] shrink-0 max-lg:px-4">
        <button
          onClick={() => navigate(`/channel/${channel.id}`)}
          className="flex items-center gap-1.5 text-[13px] text-dim cursor-pointer bg-transparent border-none font-sans hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline" dir="rtl">{channel.name}</span>
          <span className="sm:hidden">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPanelVisible(!panelVisible)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto">
        <div>
          {/* Hero */}
          <div className="px-6 py-5 flex items-start gap-3.5 max-lg:px-4">
            {video.thumbnail && (
                <img
                src={video.thumbnail}
                alt=""
                className="w-16 h-10 rounded-lg object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold tracking-tight mb-0.5 max-lg:text-sm" dir="rtl">
                {video.title}
              </h1>
              <div className="flex gap-1.5 flex-wrap mt-1.5">
                <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[11px] font-mono font-medium ${
                  video.status === "done" ? "bg-success/10 text-success" :
                  video.status === "failed" ? "bg-destructive/10 text-destructive" :
                  video.status === "analyzing" ? "bg-blue/10 text-blue" :
                  "bg-elevated text-dim"
                }`}>
                  {video.status === "done" ? "Complete" : video.status === "failed" ? "Failed" : video.status === "analyzing" ? "Analyzing" : "Pending"}
                </span>
                <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[11px] font-mono font-medium ${
                  video.type === "short" ? "bg-purple/10 text-purple" : "bg-elevated text-dim"
                }`}>
                  {video.type === "short" ? "Short" : "Video"}
                </span>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[11px] font-mono font-medium bg-elevated text-dim">
                  {video.date}
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="px-6 max-lg:px-4">
            <div className="grid grid-cols-5 max-lg:grid-cols-3 max-sm:grid-cols-2 rounded-xl overflow-hidden border border-border">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-5 py-4 bg-background border-r border-b border-border last:border-r-0 ${
                    i === stats.length - 1 ? "max-sm:col-span-2 max-sm:border-r-0" : ""
                  }`}
                >
                  <div className="text-lg font-semibold font-mono tracking-tight mb-0.5">{s.val}</div>
                  <div className="text-[11px] text-dim">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Content section */}
          <div className="px-6 py-5 pb-16 max-lg:px-4 max-lg:pb-20">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {tabList.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors whitespace-nowrap border ${
                    activeTab === tab
                      ? "bg-surface text-foreground border-border"
                      : "bg-transparent text-dim border-border/50 hover:text-sensor hover:border-border"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "Overview" && (
              <div>
                {/* Summaries in table container */}
                <div className="rounded-xl overflow-hidden border border-border" style={{ borderRadius: '12px' }}>
                  <div className="bg-background px-4 py-3 hover:bg-[#0d0d10] transition-colors">
                    <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-1.5">Summary</div>
                    <p className="text-sm leading-relaxed text-sensor" dir="rtl" style={{ textAlign: "right" }}>{a.summary}</p>
                  </div>
                </div>

                <SectionDivider label="Topics" />
                <div className="rounded-xl overflow-hidden border border-border" style={{ borderRadius: '12px' }}>
                  <div className="bg-background px-4 py-3 flex flex-wrap gap-1.5">
                    {a.topics.map((t) => (
                      <span key={t} className="py-1 px-2.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-mono">{t}</span>
                    ))}
                  </div>
                </div>

                <SectionDivider label="Keywords" />
                <div className="rounded-xl overflow-hidden border border-border" style={{ borderRadius: '12px' }}>
                  <div className="bg-background px-4 py-3 flex flex-wrap gap-1.5">
                    {a.keywords.map((k) => (
                      <span key={k} className="py-1 px-2.5 rounded-full bg-elevated border border-border text-sensor text-xs font-mono">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Sentiment" && (
              <div>
                {/* Sentiment bars in table */}
                <div className="rounded-xl overflow-hidden border border-border mb-7" style={{ borderRadius: '12px' }}>
                  {[
                    { label: "Positive", val: a.sentiment.positive, cls: "bg-success" },
                    { label: "Negative", val: a.sentiment.negative, cls: "bg-destructive" },
                    { label: "Neutral", val: a.sentiment.neutral, cls: "bg-dim" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3 bg-background px-4 py-3 border-b border-border last:border-b-0 hover:bg-[#0d0d10] transition-colors">
                      <span className="text-xs text-sensor w-[72px]">{s.label}</span>
                      <div className="flex-1 h-1.5 bg-elevated rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.cls}`} style={{ width: `${s.val}%` }} />
                      </div>
                      <span className="text-xs text-dim font-mono w-9 text-right">{s.val}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Viral" && (
              <div>
                {/* Viral stats in table grid */}
                <div className="rounded-xl overflow-hidden border border-border mb-7" style={{ borderRadius: '12px' }}>
                  <div className="grid grid-cols-3 max-lg:grid-cols-2">
                    {[
                      { val: a.viral.score, label: "Viral Score", highlight: true },
                      { val: a.viral.hookStrength, label: "Hook Strength" },
                      { val: a.viral.shareability, label: "Shareability" },
                      { val: a.viral.avgWatchPct, label: "Avg Watch %" },
                      { val: a.viral.retentionDrop, label: "Retention Drop" },
                      { val: a.viral.trending ? "Yes" : "No", label: "Trending", highlight: a.viral.trending },
                    ].map((v) => (
                      <div
                        key={v.label}
                        className="bg-background px-4 py-3 border-r border-b border-border last:border-r-0 hover:bg-[#0d0d10] transition-colors"
                      >
                        <div className={`text-lg font-semibold font-mono tracking-tight ${v.highlight ? "text-success" : ""}`}>
                          {v.val}
                        </div>
                        <div className="text-[11px] text-dim mt-0.5">{v.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Comments" && (
              <div className="rounded-xl overflow-hidden border border-border" style={{ borderRadius: '12px' }}>
                {a.comments.map((c, i) => (
                  <div key={i} className="bg-background px-4 py-3 border-b border-border last:border-b-0 hover:bg-[#0d0d10] transition-colors">
                    <div className="flex items-center mb-1.5">
                      <span className="text-[13px] font-medium">{c.author}</span>
                      <span className="text-[11px] text-dim font-mono ml-auto">{c.date}</span>
                    </div>
                    <p className="text-[13px] text-sensor leading-relaxed mb-1.5" dir="rtl" style={{ textAlign: "right" }}>
                      {c.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-dim font-mono">♥ {c.likes}</span>
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                              c.sentiment === "positive" ? "text-success" :
                              c.sentiment === "question" ? "text-blue" :
                              "text-dim"
                            }`}>
                              {c.sentiment === "positive" ? <SmilePlus className="w-3.5 h-3.5" /> :
                               c.sentiment === "question" ? <HelpCircle className="w-3.5 h-3.5" /> :
                               <Meh className="w-3.5 h-3.5" />}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <span className="capitalize">{c.sentiment}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {activeTab === "Pipeline" && (
              <div>
                <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-3">Pipeline</div>
                <div className="rounded-xl overflow-hidden border border-border" style={{ borderRadius: '12px' }}>
                  {video.pipeline.map((step) => (
                    <div key={step.name} className="flex items-center justify-between bg-background px-4 py-3 border-b border-border last:border-b-0 hover:bg-[#0d0d10] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${
                          step.status === "done" ? "bg-success" :
                          step.status === "failed" ? "bg-destructive" :
                          step.status === "running" ? "bg-blue animate-pulse" : "bg-dim/30"
                        }`} />
                        <span className={`text-[13px] ${step.status === "failed" ? "text-destructive" : "text-foreground"}`}>{step.name}</span>
                      </div>
                      <span className={`text-[12px] font-mono ${step.status === "failed" ? "text-destructive/60" : "text-dim"}`}>
                        {step.time || (step.status === "waiting" ? "—" : "...")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "History" && (
              <div>
                <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-3">Analysis History</div>
                <div className="rounded-xl overflow-hidden border border-border" style={{ borderRadius: '12px' }}>
                  {[
                    { time: "Mar 8, 14:22", name: "Full Analysis", status: "success" as const, badge: "Completed" },
                    { time: "Mar 7, 09:15", name: "Comment Refresh", status: "failed" as const, badge: "Failed", error: "API rate limit exceeded. Retry after 60 minutes." },
                  ].map((item, i) => (
                    <div key={i} className="bg-background px-4 py-3 border-b border-border last:border-b-0 hover:bg-[#0d0d10] transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-medium">{item.name}</span>
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={`inline-flex items-center justify-center ${
                                item.status === "success" ? "text-success" : "text-destructive"
                              }`}>
                                {item.status === "success" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="left">{item.badge}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="text-[10px] text-dim font-mono">{item.time}</div>
                      {item.error && (
                        <div className="mt-2 text-xs text-destructive/60 font-mono leading-relaxed">{item.error}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Popover panel */}
        <VideoRightPanel video={video} visible={panelVisible} onClose={closePanel} pipeline={video.pipeline} />
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-6 first:mt-0">
      <span className="text-[10px] text-dim tracking-widest uppercase font-mono whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
