import { useState } from "react";
import { Copy, Check, ExternalLink, ArrowDown, X as XIcon, Trophy, Eye, ThumbsUp, MessageSquare, Link2 } from "lucide-react";
import { toast } from "sonner";
import { storiesMock, Story } from "@/data/storiesMock";

type Stage = "suggestion" | "liked" | "approved" | "filmed" | "publish" | "done";

const stages: { key: Stage; label: string }[] = [
  { key: "suggestion", label: "AI Suggestion" },
  { key: "liked", label: "Liked" },
  { key: "approved", label: "Approved" },
  { key: "filmed", label: "Filmed" },
  { key: "publish", label: "Publish" },
  { key: "done", label: "Done" },
];

const scoreBarColor = (label: string) => {
  if (label === "Relevance") return "bg-purple";
  if (label === "Virality") return "bg-blue";
  return "bg-success";
};

function CopyButton({ text }: { text: string }) {
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
  return (
    <div className="flex-1 rounded-xl border border-border p-4">
      <div className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="h-1 bg-elevated rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${scoreBarColor(label)}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StoryCard({ story, selected, onClick }: { story: Story; selected: boolean; onClick: () => void }) {
  const scores = [
    { val: story.relevance, color: "text-purple" },
    { val: story.virality, color: "text-blue" },
    { val: story.firstMover, color: "text-success" },
  ];
  return (
    <button
      onClick={onClick}
      className={`w-full text-right p-3.5 rounded-xl border transition-colors ${selected ? "border-blue/40 bg-surface" : "border-border hover:bg-surface/50"}`}
    >
      <div className="flex items-start gap-2 mb-2">
        <span className="text-[13px] font-medium leading-snug flex-1">{story.title}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {story.isFirstMover && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-success/15 text-success">1st</span>
          )}
          {story.isLate && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange/15 text-orange">Late</span>
          )}
        </div>
      </div>
      <div className="text-[11px] text-dim font-mono mb-2">{story.source} {story.sourceDate}</div>
      <div className="flex items-center gap-1.5">
        {scores.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-6 h-1 bg-elevated rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${i === 0 ? "bg-purple" : i === 1 ? "bg-blue" : "bg-success"}`} style={{ width: `${s.val}%` }} />
            </div>
            <span className={`text-[10px] font-mono font-medium ${s.color}`}>{s.val}</span>
          </div>
        ))}
        <span className="text-[12px] font-mono font-bold ml-auto">{story.totalScore}</span>
      </div>
    </button>
  );
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>(storiesMock);
  const [activeStage, setActiveStage] = useState<Stage>("suggestion");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [youtubeInput, setYoutubeInput] = useState("");

  const stageStories = stories.filter((s) => s.stage === activeStage);
  const stageCounts = stages.map((s) => ({ ...s, count: stories.filter((st) => st.stage === s.key).length }));
  const selected = stories.find((s) => s.id === selectedId && s.stage === activeStage) || null;

  const moveStory = (id: string, to: Stage) => {
    setStories((prev) => prev.map((s) => (s.id === id ? { ...s, stage: to } : s)));
    setSelectedId(null);
    toast.success(`Story moved to ${stages.find((s) => s.key === to)?.label}`);
  };

  const likedStories = stories.filter((s) => s.stage === "liked").sort((a, b) => b.totalScore - a.totalScore);

  const stageSubtext = (s: typeof stageCounts[0]) => {
    if (s.key === "suggestion") return `awaiting triage`;
    if (s.key === "liked") return `saved for review`;
    if (s.key === "approved") return `brief generation ready`;
    if (s.key === "filmed") return `waiting for URL`;
    if (s.key === "publish") return `final details needed`;
    if (s.key === "done") return `published all time`;
    return "";
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-[#151619] shrink-0 max-lg:px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold">Stories</h1>
          <span className="text-[11px] text-dim font-mono">content pipeline — AI-powered story discovery</span>
        </div>
      </div>

      {/* Stage tabs */}
      <div className="flex items-center gap-1 px-6 py-3 border-b border-[#151619] overflow-x-auto max-lg:px-4">
        {stageCounts.map((s) => (
          <button
            key={s.key}
            onClick={() => { setActiveStage(s.key); setSelectedId(null); }}
            className={`flex flex-col items-start px-4 py-2 rounded-xl min-w-[120px] transition-colors ${activeStage === s.key ? "bg-surface border border-border" : "hover:bg-surface/40 border border-transparent"}`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${activeStage === s.key ? "text-foreground" : "text-dim"}`}>{s.count}</span>
            </div>
            <span className={`text-[11px] font-mono uppercase tracking-wider ${activeStage === s.key ? "text-foreground" : "text-dim"}`}>{s.label}</span>
            <span className="text-[10px] text-dim font-mono">{stageSubtext(s)}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <div className="w-[380px] min-w-[380px] max-lg:w-[320px] max-lg:min-w-[320px] border-r border-[#151619] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#151619]">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold">{stages.find((s) => s.key === activeStage)?.label}</span>
              <span className="text-[11px] text-dim font-mono bg-surface px-2 py-0.5 rounded-full">{stageStories.length}</span>
            </div>
            {activeStage === "suggestion" && (
              <button
                onClick={() => toast.success("Fetching new stories from Perplexity Sonar...")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-blue hover:bg-blue/10 rounded-lg transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                Fetch
              </button>
            )}
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {stageStories.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-[12px] text-dim font-mono">No stories in this stage</div>
            ) : (
              stageStories.map((s) => (
                <StoryCard key={s.id} story={s} selected={selectedId === s.id} onClick={() => setSelectedId(s.id)} />
              ))
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-auto">
          {!selected ? (
            <div className="flex items-center justify-center h-full text-[13px] text-dim font-mono">Select a story to view details</div>
          ) : (
            <div className="p-6 max-lg:p-4 space-y-6">
              {/* Title */}
              <h2 className="text-xl font-bold text-right leading-relaxed">{selected.title}</h2>
              <div className="text-[11px] text-dim font-mono">{selected.source} {selected.sourceDate}</div>

              {/* Scores */}
              <div className="flex gap-3 max-sm:flex-col">
                <ScoreBar label="Relevance" value={selected.relevance} />
                <ScoreBar label="Virality" value={selected.virality} />
                <ScoreBar label="First Mover" value={selected.firstMover} />
              </div>

              {/* First Mover badge */}
              {selected.isFirstMover && (
                <div className="rounded-xl bg-success/5 border border-success/15 px-4 py-3 flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-success shrink-0" />
                  <span className="text-[12px] text-success font-medium">First Mover — No competitor has covered this story yet</span>
                </div>
              )}
              {selected.isLate && (
                <div className="rounded-xl bg-orange/5 border border-orange/15 px-4 py-3 flex items-center gap-3">
                  <XIcon className="w-4 h-4 text-orange shrink-0" />
                  <span className="text-[12px] text-orange font-medium">Late — competitors have already covered this story</span>
                </div>
              )}

              {/* Stage-specific content */}

              {/* SUGGESTION stage */}
              {activeStage === "suggestion" && (
                <>
                  {selected.aiAnalysis && (
                    <div>
                      <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-2">AI Analysis</div>
                      <p className="text-[13px] text-sensor leading-relaxed text-right">{selected.aiAnalysis}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => moveStory(selected.id, "liked")} className="flex-1 px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-xl hover:opacity-90 transition-opacity">
                      Save to Liked
                    </button>
                    <button onClick={() => { setStories((p) => p.filter((s) => s.id !== selected.id)); setSelectedId(null); toast("Story passed"); }} className="flex-1 px-4 py-2.5 text-[13px] font-medium rounded-xl border border-border text-dim hover:text-sensor transition-colors">
                      Pass
                    </button>
                  </div>
                </>
              )}

              {/* LIKED stage */}
              {activeStage === "liked" && (
                <>
                  {/* Ranking */}
                  <div className="rounded-xl border border-border p-4">
                    <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">RANKING</div>
                    <div className="text-[13px] font-semibold mb-3">
                      Ranked #{likedStories.findIndex((s) => s.id === selected.id) + 1} of {likedStories.length} liked — Score {selected.totalScore}
                    </div>
                    <div className="space-y-1.5">
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
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => moveStory(selected.id, "approved")} className="flex-1 px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-xl hover:opacity-90 transition-opacity">
                      Send to Production
                    </button>
                    <button onClick={() => moveStory(selected.id, "suggestion")} className="flex-1 px-4 py-2.5 text-[13px] font-medium rounded-xl border border-border text-dim hover:text-sensor transition-colors">
                      Pass
                    </button>
                  </div>
                </>
              )}

              {/* APPROVED stage */}
              {activeStage === "approved" && (
                <>
                  <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-1">Production Brief</div>

                  {/* Suggested Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Suggested Title</span>
                      {selected.suggestedTitle && <CopyButton text={selected.suggestedTitle} />}
                    </div>
                    <div className="rounded-xl bg-surface border border-border px-4 py-3 text-[13px] text-right leading-relaxed">
                      {selected.suggestedTitle}
                    </div>
                  </div>

                  {/* Opening Hook */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Opening Hook (first 10 sec)</span>
                      {selected.openingHook && <CopyButton text={selected.openingHook} />}
                    </div>
                    <div className="rounded-xl bg-surface border border-border px-4 py-3 text-[13px] text-right leading-relaxed">
                      {selected.openingHook}
                    </div>
                  </div>

                  {/* Ending Hook */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Ending Hook</span>
                      {selected.endingHook && <CopyButton text={selected.endingHook} />}
                    </div>
                    <div className="rounded-xl bg-surface border border-border px-4 py-3 text-[13px] text-right leading-relaxed">
                      {selected.endingHook}
                    </div>
                  </div>

                  {/* Script */}
                  {selected.script && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Long Script (20–40 min) — with timestamps</span>
                        <CopyButton text={selected.script.map((s) => `${s.time} ${s.text}`).join("\n")} />
                      </div>
                      <div className="rounded-xl bg-surface border border-border overflow-hidden">
                        {selected.script.map((s, i) => (
                          <div key={i} className={`flex items-start gap-4 px-4 py-3 ${i < selected.script!.length - 1 ? "border-b border-border" : ""}`}>
                            <span className="text-[13px] font-mono font-bold text-blue shrink-0 pt-0.5">{s.time}</span>
                            <span className="text-[13px] text-sensor leading-relaxed text-right flex-1">{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button onClick={() => moveStory(selected.id, "filmed")} className="w-full px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-xl hover:opacity-90 transition-opacity">
                      + Mark as Filmed
                    </button>
                  </div>
                </>
              )}

              {/* FILMED stage */}
              {activeStage === "filmed" && (
                <>
                  <div className="rounded-xl border border-border p-5">
                    <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">Add YouTube URL</div>
                    <p className="text-[12px] text-dim leading-relaxed mb-4">
                      Add YouTube URL to move to Publish — paste the published video URL to record performance and check Brain coverage.
                    </p>
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dim" />
                        <input
                          type="url"
                          value={youtubeInput}
                          onChange={(e) => setYoutubeInput(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full pl-9 pr-3 py-2.5 text-[13px] bg-surface border border-border rounded-xl text-foreground font-mono placeholder:text-dim focus:outline-none focus:border-blue/40"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!youtubeInput.trim()) { toast.error("Please paste a YouTube URL"); return; }
                          setStories((prev) => prev.map((s) => s.id === selected.id ? { ...s, youtubeUrl: youtubeInput.trim(), stage: "done" as Stage, views: 0, likes: 0, comments: 0, gapWin: false } : s));
                          setYoutubeInput("");
                          setSelectedId(null);
                          toast.success("Video submitted — moved to Done");
                        }}
                        className="px-5 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* PUBLISH stage */}
              {activeStage === "publish" && (
                <div className="rounded-xl border border-border p-5">
                  <p className="text-[12px] text-dim font-mono">Final details to confirm before marking done.</p>
                  <button onClick={() => moveStory(selected.id, "done")} className="mt-4 w-full px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-xl hover:opacity-90 transition-opacity">
                    Mark as Done
                  </button>
                </div>
              )}

              {/* DONE stage */}
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

                  <div className="rounded-xl border border-border p-5">
                    <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-4">Video Performance</div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-dim" />
                        <div>
                          <div className="text-lg font-bold">{selected.views ? (selected.views >= 1000000 ? `${(selected.views / 1000000).toFixed(1)}M` : selected.views >= 1000 ? `${(selected.views / 1000).toFixed(0)}K` : selected.views) : "0"}</div>
                          <div className="text-[10px] text-dim font-mono">Views</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-dim" />
                        <div>
                          <div className="text-lg font-bold">{selected.likes ? (selected.likes >= 1000 ? `${(selected.likes / 1000).toFixed(0)}K` : selected.likes) : "0"}</div>
                          <div className="text-[10px] text-dim font-mono">Likes</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-dim" />
                        <div>
                          <div className="text-lg font-bold">{selected.comments ? (selected.comments >= 1000 ? `${(selected.comments / 1000).toFixed(0)}K` : selected.comments) : "0"}</div>
                          <div className="text-[10px] text-dim font-mono">Comments</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Original scores */}
                  <div className="text-[10px] text-dim font-mono uppercase tracking-widest">Original Scores</div>
                  <div className="flex gap-3 max-sm:flex-col">
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
          )}
        </div>
      </div>
    </div>
  );
}
