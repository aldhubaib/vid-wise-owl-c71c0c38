import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { videos, channels, videoAnalysis } from "@/data/mock";
import { VideoRightPanel } from "@/components/VideoRightPanel";
import { ArrowLeft, Info } from "lucide-react";

const tabList = ["Overview", "Sentiment", "Viral", "Comments", "Ideas", "History"];

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
                <div className="mb-5">
                  <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-2">Summary (AR)</div>
                  <p className="text-sm leading-relaxed text-sensor" dir="rtl" style={{ textAlign: "right" }}>{a.summary}</p>
                </div>
                <div className="mb-5">
                  <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-2">Summary (EN)</div>
                  <p className="text-sm leading-relaxed text-sensor">{a.summaryEn}</p>
                </div>

                <SectionDivider label="Topics" />
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {a.topics.map((t) => (
                    <span key={t} className="py-1 px-2.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-mono">{t}</span>
                  ))}
                </div>

                <SectionDivider label="Keywords" />
                <div className="flex flex-wrap gap-1.5">
                  {a.keywords.map((k) => (
                    <span key={k} className="py-1 px-2.5 rounded-full bg-elevated border border-border text-sensor text-xs font-mono">{k}</span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Sentiment" && (
              <div>
                <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-3">Sentiment Distribution</div>
                <div className="flex flex-col gap-2.5 mb-7">
                  {[
                    { label: "Positive", val: a.sentiment.positive, cls: "bg-success" },
                    { label: "Negative", val: a.sentiment.negative, cls: "bg-destructive" },
                    { label: "Neutral", val: a.sentiment.neutral, cls: "bg-dim" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-xs text-sensor w-[72px]">{s.label}</span>
                      <div className="flex-1 h-1.5 bg-elevated rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.cls}`} style={{ width: `${s.val}%` }} />
                      </div>
                      <span className="text-xs text-dim font-mono w-9 text-right">{s.val}%</span>
                    </div>
                  ))}
                </div>

                <SectionDivider label="Emotions" />
                <div className="grid grid-cols-2 gap-2 mb-7 max-sm:grid-cols-1">
                  {a.emotions.map((e) => (
                    <div key={e.name} className="bg-surface border border-border rounded-lg px-3.5 py-2.5 flex justify-between items-center">
                      <span className="text-[13px]">{e.emoji} {e.name}</span>
                      <span className="text-xs text-dim font-mono">{e.pct}%</span>
                    </div>
                  ))}
                </div>

                <SectionDivider label="Top Questions" />
                <div className="flex flex-col gap-2">
                  {a.questions.map((q) => (
                    <div key={q.text} className="bg-surface border border-border rounded-lg px-3.5 py-2.5 flex items-center justify-between gap-3">
                      <span className="text-[13px] flex-1" dir="rtl">{q.text}</span>
                      <span className="text-[11px] text-dim font-mono bg-elevated py-0.5 px-2 rounded whitespace-nowrap">{q.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Viral" && (
              <div>
                <div className="grid grid-cols-3 gap-2 mb-7 max-lg:grid-cols-2">
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
                      className={`border rounded-lg px-3.5 py-3 ${
                        v.highlight ? "bg-success/[0.05] border-success/15" : "bg-surface border-border"
                      }`}
                    >
                      <div className={`text-lg font-semibold font-mono tracking-tight ${v.highlight ? "text-success" : ""}`}>
                        {v.val}
                      </div>
                      <div className="text-[11px] text-dim mt-0.5">{v.label}</div>
                    </div>
                  ))}
                </div>

                <SectionDivider label="Key Moments" />
                <div className="flex flex-col gap-2">
                  {a.moments.map((m) => (
                    <div key={m.time} className="flex gap-3 items-start bg-surface border border-border rounded-lg px-3.5 py-2.5">
                      <span className="text-[11px] text-primary font-mono whitespace-nowrap pt-0.5">{m.time}</span>
                      <span className="text-[13px] leading-relaxed text-sensor" dir="rtl">{m.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Comments" && (
              <div className="flex flex-col gap-2">
                {a.comments.map((c, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg px-4 py-3">
                    <div className="flex items-center mb-2">
                      <span className="text-[13px] font-medium">{c.author}</span>
                      <span className="text-[11px] text-dim font-mono ml-auto">{c.date}</span>
                    </div>
                    <p className="text-[13px] text-sensor leading-relaxed mb-2" dir="rtl" style={{ textAlign: "right" }}>
                      {c.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-dim font-mono">♥ {c.likes}</span>
                      <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-medium font-mono ${
                        c.sentiment === "positive" ? "bg-success/10 text-success" :
                        c.sentiment === "question" ? "bg-blue/10 text-blue" :
                        "bg-elevated text-dim"
                      }`}>
                        {c.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Ideas" && (
              <div>
                <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-3">Content Ideas</div>
                <div className="flex flex-col gap-2 mb-7">
                  {a.contentIdeas.map((idea, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg px-4 py-3">
                      <div className="text-[13px] font-medium mb-1" dir="rtl" style={{ textAlign: "right" }}>
                        {idea.hook}
                      </div>
                      <p className="text-xs text-dim leading-relaxed" dir="rtl" style={{ textAlign: "right" }}>
                        {idea.concept}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "History" && (
              <div>
                <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-4">Analysis History</div>
                <div className="relative pl-7">
                  <div className="absolute left-[7px] top-2 bottom-0 w-px bg-border" />
                  {[
                    { time: "Mar 8, 14:22", name: "Full Analysis", status: "success" as const, badge: "Completed" },
                    { time: "Mar 7, 09:15", name: "Comment Refresh", status: "failed" as const, badge: "Failed", error: "API rate limit exceeded. Retry after 60 minutes." },
                  ].map((item, i) => (
                    <div key={i} className="relative mb-6 last:mb-0">
                      <div className={`absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background z-10 ${
                        item.status === "success"
                          ? "bg-success ring-[3px] ring-success/10"
                          : "bg-destructive ring-[3px] ring-destructive/10"
                      }`} />
                      <div className="text-[10px] text-dim font-mono mb-1.5">{item.time}</div>
                      <div className="bg-surface border border-border rounded-lg overflow-hidden">
                        <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                          <span className="text-[13px] font-medium flex-1">{item.name}</span>
                          <span className={`text-[10px] font-medium py-0.5 px-2 rounded font-mono ${
                            item.status === "success"
                              ? "bg-success/10 text-success"
                              : "bg-destructive/10 text-destructive"
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        {item.error && (
                          <div className="border-t border-destructive/15 px-3.5 py-2.5 bg-destructive/[0.03]">
                            <div className="text-[10px] text-destructive tracking-wider uppercase font-mono mb-1">Error</div>
                            <div className="text-xs text-destructive/60 font-mono leading-relaxed">{item.error}</div>
                          </div>
                        )}
                      </div>
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
