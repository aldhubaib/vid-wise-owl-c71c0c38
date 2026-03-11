import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { videos, channels, videoAnalysis } from "@/data/mock";
import { VideoRightPanel } from "@/components/VideoRightPanel";

const tabList = ["Overview", "Sentiment", "Viral", "Comments", "Ideas", "History"];

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const video = videos.find((v) => v.id === id);
  const channel = video ? channels.find((c) => c.id === video.channelId) : null;
  const [activeTab, setActiveTab] = useState("Overview");
  const [panelVisible, setPanelVisible] = useState(true);
  const a = videoAnalysis;

  if (!video || !channel) {
    return <div className="p-10 text-sensor">Video not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="h-[49px] flex items-center justify-between px-10 border-b border-border bg-background sticky top-0 z-[100] max-md:px-4 shrink-0">
        <button
          onClick={() => navigate(`/channel/${channel.id}`)}
          className="text-[13px] text-sensor cursor-pointer bg-transparent border-none font-sans hover:text-foreground transition-colors"
        >
          ← Back to {channel.name}
        </button>
        <button
          onClick={() => setPanelVisible(!panelVisible)}
          className="py-1.5 px-3.5 rounded bg-transparent border border-border text-sensor text-xs font-sans cursor-pointer transition-all hover:border-dim hover:text-foreground hidden md:block"
        >
          {panelVisible ? "Hide Panel" : "Show Panel"}
        </button>
      </div>

      <div className="flex-1 relative">
        <div className={`p-10 min-h-[calc(100vh-49px)] transition-[margin] duration-250 ease-out max-md:p-4 max-md:pb-20 ${panelVisible ? "md:mr-[300px]" : ""}`}>
          {/* Title */}
          <h1 className="text-[26px] font-bold tracking-tight leading-snug mb-3.5 max-md:text-lg" dir="rtl" style={{ textAlign: "right" }}>
            {video.title}
          </h1>

          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {video.status === "failed" && (
              <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded text-[11px] font-medium font-mono bg-destructive/[0.12] text-destructive">
                <span className="w-[5px] h-[5px] rounded-full bg-current" /> Analysis Failed
              </span>
            )}
            <span className={`text-[10px] font-mono py-0.5 px-1.5 rounded-sm border ${
              video.type === "short"
                ? "bg-purple/[0.12] text-purple border-purple/20"
                : "bg-elevated text-dim border-border"
            }`}>
              {video.type}
            </span>
            <span className="text-[11px] font-mono text-dim">{video.duration}</span>
            <span className="text-[11px] font-mono text-dim">·</span>
            <span className="text-[11px] font-mono text-dim">{video.date}</span>
          </div>

          {/* Thumbnail placeholder */}
          <div className="w-full aspect-video rounded-md overflow-hidden mb-7 bg-elevated flex items-center justify-center text-dim text-[13px]">
            Video Thumbnail
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-8 overflow-x-auto">
            {tabList.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 text-[13px] font-medium cursor-pointer border-b-2 -mb-px transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab
                    ? "text-foreground border-foreground"
                    : "text-dim border-transparent hover:text-sensor"
                }`}
              >
                {tab}
                {tab === "Sentiment" && <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block ml-1.5" />}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "Overview" && (
            <div>
              <div className="mb-5">
                <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-2">Summary (AR)</div>
                <p className="text-sm leading-relaxed" dir="rtl" style={{ textAlign: "right" }}>{a.summary}</p>
              </div>
              <div className="mb-5">
                <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-2">Summary (EN)</div>
                <p className="text-sm leading-relaxed text-sensor">{a.summaryEn}</p>
              </div>

              <SectionDivider label="Topics" />
              <div className="flex flex-wrap gap-1.5 mb-5">
                {a.topics.map((t) => (
                  <span key={t} className="py-1 px-2.5 rounded bg-blue/10 border border-blue/20 text-blue text-xs font-mono">{t}</span>
                ))}
              </div>

              <SectionDivider label="Keywords" />
              <div className="flex flex-wrap gap-1.5">
                {a.keywords.map((k) => (
                  <span key={k} className="py-1 px-2.5 rounded bg-elevated border border-border text-sensor text-xs font-mono">{k}</span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Sentiment" && (
            <div>
              <div className="text-[11px] text-dim font-mono uppercase tracking-widest mb-3">Sentiment Distribution</div>
              <div className="flex flex-col gap-2 mb-7">
                {[
                  { label: "Pos", val: a.sentiment.positive, cls: "bg-success" },
                  { label: "Neg", val: a.sentiment.negative, cls: "bg-destructive" },
                  { label: "Neu", val: a.sentiment.neutral, cls: "bg-dim" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="text-xs text-sensor font-mono w-[60px]">{s.label}</span>
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
                  <div key={e.name} className="bg-surface border border-border rounded-md px-3 py-2.5 flex justify-between items-center">
                    <span className="text-[13px]">{e.emoji} {e.name}</span>
                    <span className="text-xs text-dim font-mono">{e.pct}%</span>
                  </div>
                ))}
              </div>

              <SectionDivider label="Top Questions" />
              <div className="flex flex-col gap-2">
                {a.questions.map((q) => (
                  <div key={q.text} className="bg-surface border border-border rounded-md px-3.5 py-2.5 flex items-center justify-between gap-3">
                    <span className="text-[13px] flex-1" dir="rtl">{q.text}</span>
                    <span className="text-[11px] text-dim font-mono bg-elevated py-0.5 px-2 rounded-sm whitespace-nowrap">{q.count} mentions</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Viral" && (
            <div>
              <div className="grid grid-cols-3 gap-2 mb-7 max-md:grid-cols-2">
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
                    className={`border rounded-md px-3.5 py-3 ${
                      v.highlight ? "bg-success/[0.06] border-success/20" : "bg-surface border-border"
                    }`}
                  >
                    <div className={`text-xl font-bold font-mono tracking-tight ${v.highlight ? "text-success" : ""}`}>
                      {v.val}
                    </div>
                    <div className="text-[11px] text-dim mt-0.5">{v.label}</div>
                  </div>
                ))}
              </div>

              <SectionDivider label="Key Moments" />
              <div className="flex flex-col gap-2">
                {a.moments.map((m) => (
                  <div key={m.time} className="flex gap-3 items-start bg-surface border border-border rounded-md px-3.5 py-2.5">
                    <span className="text-[11px] text-blue font-mono whitespace-nowrap pt-0.5">{m.time}</span>
                    <span className="text-[13px] leading-relaxed" dir="rtl">{m.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Comments" && (
            <div className="flex flex-col gap-2">
              {a.comments.map((c, i) => (
                <div key={i} className="bg-surface border border-border rounded-md px-4 py-3.5">
                  <div className="flex items-center mb-2">
                    <span className="text-[13px] font-semibold">{c.author}</span>
                    <span className="text-[11px] text-dim font-mono ml-auto">{c.date}</span>
                  </div>
                  <p className="text-[13px] text-sensor leading-relaxed mb-2.5" dir="rtl" style={{ textAlign: "right" }}>
                    {c.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-dim font-mono">❤ {c.likes}</span>
                    <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-medium font-mono ${
                      c.sentiment === "positive" ? "bg-success/[0.12] text-success" :
                      c.sentiment === "question" ? "bg-blue/[0.12] text-blue" :
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
                  <div key={i} className="bg-surface border border-border rounded-md px-4 py-3.5">
                    <div className="text-[13px] font-semibold mb-1.5" dir="rtl" style={{ textAlign: "right" }}>
                      {idea.hook}
                    </div>
                    <p className="text-xs text-sensor leading-relaxed" dir="rtl" style={{ textAlign: "right" }}>
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
                  { time: "Mar 8, 14:22", name: "Full Analysis", status: "success" as const, badge: "✓ Completed" },
                  { time: "Mar 7, 09:15", name: "Comment Refresh", status: "failed" as const, badge: "✕ Failed", error: "API rate limit exceeded. Retry after 60 minutes." },
                ].map((item, i) => (
                  <div key={i} className="relative mb-6 last:mb-0">
                    <div className={`absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background z-10 ${
                      item.status === "success"
                        ? "bg-success ring-[3px] ring-success/15"
                        : "bg-destructive ring-[3px] ring-destructive/15"
                    }`} />
                    <div className="text-[10px] text-dim font-mono mb-1.5">{item.time}</div>
                    <div className="bg-surface border border-border rounded-md overflow-hidden">
                      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
                        <span className="text-[13px] font-medium flex-1">{item.name}</span>
                        <span className={`text-[10px] font-medium py-0.5 px-2 rounded-sm font-mono ${
                          item.status === "success"
                            ? "bg-success/[0.12] text-success"
                            : "bg-destructive/[0.15] text-destructive"
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                      {item.error && (
                        <div className="border-t border-destructive/[0.18] px-3.5 py-2.5 bg-destructive/[0.05]">
                          <div className="text-[10px] text-destructive tracking-wider uppercase font-mono mb-1">Error</div>
                          <div className="text-xs text-destructive/70 font-mono leading-relaxed">{item.error}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <VideoRightPanel video={video} visible={panelVisible} pipeline={a.pipeline} />
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-7 first:mt-0">
      <span className="text-[10px] text-dim tracking-widest uppercase font-mono whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
