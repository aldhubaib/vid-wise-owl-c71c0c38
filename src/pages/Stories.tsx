import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, ExternalLink, ArrowDown, Trophy, Eye, ThumbsUp, MessageSquare, Link2, ArrowUpRight, XCircle } from "lucide-react";
import { toast } from "sonner";
import { storiesMock, Story } from "@/data/storiesMock";

type Stage = "suggestion" | "liked" | "approved" | "filmed" | "publish" | "done";

const stages: { key: Stage; label: string; color: string; sub: string }[] = [
  { key: "suggestion", label: "AI Suggestion", color: "text-orange", sub: "awaiting triage" },
  { key: "liked", label: "Liked", color: "text-blue", sub: "saved for review" },
  { key: "approved", label: "Approved", color: "text-purple", sub: "brief generation ready" },
  { key: "filmed", label: "Filmed", color: "text-success", sub: "waiting for URL" },
  { key: "publish", label: "Publish", color: "text-primary", sub: "final details needed" },
  { key: "done", label: "Done", color: "text-foreground", sub: "published all time" },
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); toast.success("Copied"); setTimeout(() => setCopied(false), 1500); }}
      className="text-[11px] text-dim hover:text-sensor font-mono flex items-center gap-1 transition-colors shrink-0"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      Copy
    </button>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = label === "Relevance" ? "bg-purple" : label === "Virality" ? "bg-blue" : "bg-success";
  return (
    <div className="flex-1 px-4 py-3 bg-background border-r border-[#151619] last:border-r-0">
      <div className="text-[10px] text-dim font-mono uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-semibold font-mono tracking-tight mt-1">{value}</div>
      <div className="h-1 bg-elevated rounded-full overflow-hidden mt-2">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MiniScores({ story }: { story: Story }) {
  const items = [
    { val: story.relevance, color: "text-purple", bar: "bg-purple" },
    { val: story.virality, color: "text-blue", bar: "bg-blue" },
    { val: story.firstMover, color: "text-success", bar: "bg-success" },
  ];
  return (
    <div className="flex items-center gap-2">
      {items.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="w-5 h-1 bg-elevated rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${s.val}%` }} />
          </div>
          <span className={`text-[10px] font-mono font-medium ${s.color}`}>{s.val}</span>
        </div>
      ))}
    </div>
  );
}

export default function Stories() {
  const navigate = useNavigate();
  const [stories] = useState<Story[]>(storiesMock);
  const [activeStage, setActiveStage] = useState<Stage>("suggestion");


  const stageStories = stories.filter((s) => s.stage === activeStage);

  // First mover % across all stories
  const totalStories = stories.length;
  const firstMoverCount = stories.filter((s) => s.isFirstMover).length;
  const firstMoverPct = totalStories ? Math.round((firstMoverCount / totalStories) * 100) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar — matches Pipeline/Monitor */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-[#151619] shrink-0 max-lg:px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold">Stories</h1>
          <span className="text-[11px] text-dim font-mono">content pipeline — AI-powered story discovery</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success("Fetching new stories from Perplexity Sonar...")}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-[11px] text-dim font-medium hover:text-sensor transition-colors"
          >
            <ArrowDown className="w-3 h-3" />
            Fetch
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto">
        {/* Stats row — same as Pipeline */}
        <div className="px-6 max-lg:px-4 mb-5 pt-5">
          <div className="flex rounded-xl overflow-hidden">
            {stages.map((s) => {
              const count = stories.filter((st) => st.stage === s.key).length;
              return (
                <div
                  key={s.key}
                  className="flex-1 px-5 py-4 bg-background border-r border-background last:border-r-0"
                >
                  <div className={`text-2xl font-semibold font-mono tracking-tight ${s.color}`}>{count}</div>
                  <div className="text-[10px] text-dim font-mono uppercase tracking-wider mt-1">{s.label}</div>
                  <div className="mt-2 text-[11px] text-dim font-mono">{s.sub}</div>
                </div>
              );
            })}
            {/* First Mover aggregate */}
            <div className="px-5 py-4 bg-background min-w-[120px]">
              <div className="text-2xl font-semibold font-mono tracking-tight text-success">{firstMoverPct}%</div>
              <div className="text-[10px] text-dim font-mono uppercase tracking-wider mt-1">First Mover</div>
              <div className="mt-2 text-[11px] text-dim font-mono">{firstMoverCount} of {totalStories} stories · ↑ strong</div>
            </div>
          </div>
        </div>

        {/* Stage filter pills */}
        <div className="px-6 max-lg:px-4 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            {stages.map((s) => {
              const count = stories.filter((st) => st.stage === s.key).length;
              return (
                <button
                  key={s.key}
                  onClick={() => { setActiveStage(s.key); }}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    activeStage === s.key
                      ? "bg-foreground/10 text-foreground border border-foreground/20"
                      : "text-dim border border-border hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  {s.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-panel layout */}
        <div className="px-6 max-lg:px-4 pb-8">
          <div className="flex gap-4 items-start">
            {/* Left panel: story list */}
            <div className={`${selected ? "w-[380px] min-w-[380px] max-lg:w-[320px] max-lg:min-w-[320px]" : "w-full"} rounded-xl border border-border overflow-hidden flex flex-col`} style={{ maxHeight: "calc(100vh - 250px)" }}>
              {/* Header */}
              <div className="px-4 py-3 bg-background shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold">{stages.find((s) => s.key === activeStage)?.label}</span>
                  <span className="text-[12px] text-dim font-mono">({stageStories.length})</span>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-auto bg-background">
                {stageStories.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-[12px] text-dim font-mono">No stories in this stage</div>
                ) : (
                  stageStories.map((story) => (
                    <button
                      key={story.id}
                      onClick={() => setSelectedId(story.id)}
                      className={`w-full px-4 py-3.5 border-t border-border text-right hover:bg-[#0d0d10] transition-colors group ${selectedId === story.id ? "bg-[#0d0d10]" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 shrink-0">
                          {story.isFirstMover && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-success/15 text-success">1st</span>
                          )}
                          {story.isLate && (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-orange/15 text-orange">Late</span>
                          )}
                        </div>
                        <span className="text-[13px] font-medium leading-snug flex-1 ml-2">{story.title}</span>
                      </div>
                      <div className="text-[10px] text-dim font-mono mb-2">{story.source} {story.sourceDate}</div>
                      <div className="flex items-center justify-between">
                        <MiniScores story={story} />
                        <span className="text-[12px] font-mono font-bold">{story.totalScore}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 min-w-0">
              {!selected ? null : (
                <div className="rounded-xl border border-border bg-background overflow-hidden">
                  {/* Detail header */}
                  <div className="px-5 py-4 border-b border-border">
                    <h2 className="text-lg font-bold text-right leading-relaxed">{selected.title}</h2>
                    <div className="text-[11px] text-dim font-mono mt-1">{selected.source} {selected.sourceDate}</div>
                  </div>

                  {/* Scores row — Pipeline stats style */}
                  <div className="flex border-b border-border">
                    <ScoreBar label="Relevance" value={selected.relevance} />
                    <ScoreBar label="Virality" value={selected.virality} />
                    <ScoreBar label="First Mover" value={selected.firstMover} />
                  </div>

                  {/* Badge */}
                  <div className="px-5 py-3 border-b border-border">
                    {selected.isFirstMover ? (
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-4 h-4 text-success shrink-0" />
                        <span className="text-[12px] text-success font-medium">First Mover — No competitor has covered this story yet</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <XCircle className="w-4 h-4 text-orange shrink-0" />
                        <span className="text-[12px] text-orange font-medium">Late — competitors have already covered this story</span>
                      </div>
                    )}
                  </div>

                  {/* Stage content */}
                  <div className="p-5 space-y-5">
                    {/* SUGGESTION */}
                    {activeStage === "suggestion" && (
                      <>
                        {selected.aiAnalysis && (
                          <div>
                            <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-2">AI Analysis</div>
                            <p className="text-[13px] text-sensor leading-relaxed text-right">{selected.aiAnalysis}</p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => moveStory(selected.id, "liked")} className="flex-1 px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-full hover:opacity-90 transition-opacity">
                            Save to Liked
                          </button>
                          <button onClick={() => { setStories((p) => p.filter((s) => s.id !== selected.id)); setSelectedId(null); toast("Passed"); }} className="flex-1 px-4 py-2.5 text-[13px] font-medium rounded-full border border-border text-dim hover:text-sensor transition-colors">
                            Pass
                          </button>
                        </div>
                      </>
                    )}

                    {/* LIKED */}
                    {activeStage === "liked" && (
                      <>
                        <div>
                          <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">Ranking</div>
                          <div className="text-[13px] font-semibold mb-3">
                            Ranked #{likedStories.findIndex((s) => s.id === selected.id) + 1} of {likedStories.length} liked — Score {selected.totalScore}
                          </div>
                          <div className="space-y-1">
                            {likedStories.map((s, i) => (
                              <div key={s.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] ${s.id === selected.id ? "bg-surface text-foreground" : "text-dim"}`}>
                                <span className="font-mono w-5">#{i + 1}</span>
                                <span className="flex-1 truncate text-right">{s.title}</span>
                                <span className="font-mono font-medium">{s.totalScore}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {selected.aiAnalysis && (
                          <div>
                            <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-2">AI Analysis</div>
                            <p className="text-[13px] text-sensor leading-relaxed text-right">{selected.aiAnalysis}</p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => moveStory(selected.id, "approved")} className="flex-1 px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-full hover:opacity-90 transition-opacity">
                            Send to Production
                          </button>
                          <button onClick={() => moveStory(selected.id, "suggestion")} className="flex-1 px-4 py-2.5 text-[13px] font-medium rounded-full border border-border text-dim hover:text-sensor transition-colors">
                            Pass
                          </button>
                        </div>
                      </>
                    )}

                    {/* APPROVED */}
                    {activeStage === "approved" && (
                      <>
                        <div className="text-[10px] text-dim font-mono uppercase tracking-widest">Production Brief</div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Suggested Title</span>
                            {selected.suggestedTitle && <CopyBtn text={selected.suggestedTitle} />}
                          </div>
                          <div className="rounded-xl bg-surface px-4 py-3 text-[13px] text-right leading-relaxed">{selected.suggestedTitle}</div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Opening Hook (first 10 sec)</span>
                            {selected.openingHook && <CopyBtn text={selected.openingHook} />}
                          </div>
                          <div className="rounded-xl bg-surface px-4 py-3 text-[13px] text-right leading-relaxed">{selected.openingHook}</div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Ending Hook</span>
                            {selected.endingHook && <CopyBtn text={selected.endingHook} />}
                          </div>
                          <div className="rounded-xl bg-surface px-4 py-3 text-[13px] text-right leading-relaxed">{selected.endingHook}</div>
                        </div>

                        {selected.script && (
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Long Script (20–40 min) — with timestamps</span>
                              <CopyBtn text={selected.script.map((s) => `${s.time} ${s.text}`).join("\n")} />
                            </div>
                            <div className="rounded-xl bg-surface overflow-hidden">
                              {selected.script.map((s, i) => (
                                <div key={i} className={`flex items-start gap-4 px-4 py-3 ${i < selected.script!.length - 1 ? "border-b border-border" : ""}`}>
                                  <span className="text-[13px] font-mono font-bold text-blue shrink-0 pt-0.5">{s.time}</span>
                                  <span className="text-[13px] text-sensor leading-relaxed text-right flex-1">{s.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <button onClick={() => moveStory(selected.id, "filmed")} className="w-full px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-full hover:opacity-90 transition-opacity">
                          + Mark as Filmed
                        </button>
                      </>
                    )}

                    {/* FILMED */}
                    {activeStage === "filmed" && (
                      <div>
                        <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-2">Add YouTube URL</div>
                        <p className="text-[12px] text-dim leading-relaxed mb-4">
                          Paste the published video URL to record performance and check Brain coverage.
                        </p>
                        <div className="flex items-center gap-2.5">
                          <div className="relative flex-1">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dim" />
                            <input
                              type="url"
                              value={youtubeInput}
                              onChange={(e) => setYoutubeInput(e.target.value)}
                              placeholder="https://youtube.com/watch?v=..."
                              className="w-full pl-9 pr-3 py-2.5 text-[13px] bg-surface border border-border rounded-full text-foreground font-mono placeholder:text-dim focus:outline-none focus:border-blue/40"
                            />
                          </div>
                          <button
                            onClick={() => {
                              if (!youtubeInput.trim()) { toast.error("Please paste a YouTube URL"); return; }
                              setStories((prev) => prev.map((s) => s.id === selected.id ? { ...s, youtubeUrl: youtubeInput.trim(), stage: "done" as Stage, views: 0, likes: 0, comments: 0, gapWin: false } : s));
                              setYoutubeInput("");
                              setSelectedId(null);
                              toast.success("Moved to Done");
                            }}
                            className="px-5 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}

                    {/* PUBLISH */}
                    {activeStage === "publish" && (
                      <div>
                        <p className="text-[12px] text-dim font-mono mb-4">Final details to confirm before marking done.</p>
                        <button onClick={() => moveStory(selected.id, "done")} className="w-full px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-full hover:opacity-90 transition-opacity">
                          Mark as Done
                        </button>
                      </div>
                    )}

                    {/* DONE */}
                    {activeStage === "done" && (
                      <>
                        {selected.gapWin && (
                          <div className="rounded-xl bg-success/10 border border-success/20 px-5 py-4 flex items-center gap-3">
                            <Trophy className="w-5 h-5 text-success shrink-0" />
                            <div>
                              <div className="text-[14px] font-semibold text-success">Gap Win</div>
                              <div className="text-[12px] text-success/80">You were first and the audience responded!</div>
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">Video Performance</div>
                          <div className="flex rounded-xl overflow-hidden">
                            {[
                              { icon: Eye, val: selected.views, label: "Views" },
                              { icon: ThumbsUp, val: selected.likes, label: "Likes" },
                              { icon: MessageSquare, val: selected.comments, label: "Comments" },
                            ].map((m) => {
                              const fmt = (n?: number) => !n ? "0" : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : String(n);
                              return (
                                <div key={m.label} className="flex-1 px-4 py-3 bg-surface border-r border-border last:border-r-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <m.icon className="w-3.5 h-3.5 text-dim" />
                                    <span className="text-[10px] text-dim font-mono uppercase">{m.label}</span>
                                  </div>
                                  <div className="text-xl font-semibold font-mono tracking-tight">{fmt(m.val)}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="text-[10px] text-dim font-mono uppercase tracking-widest">Original Scores</div>
                        <div className="flex rounded-xl overflow-hidden border border-border">
                          <ScoreBar label="Relevance" value={selected.relevance} />
                          <ScoreBar label="Virality" value={selected.virality} />
                          <ScoreBar label="First Mover" value={selected.firstMover} />
                        </div>

                        {selected.youtubeUrl && (
                          <a href={selected.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12px] text-blue font-mono hover:opacity-80 transition-opacity">
                            <ExternalLink className="w-3.5 h-3.5" />
                            YouTube Link
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
