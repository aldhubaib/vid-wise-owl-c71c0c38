import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Copy, Check, ExternalLink, Trophy, Eye, ThumbsUp, MessageSquare, Link2, XCircle, ArrowLeft, ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { storiesMock, Story } from "@/data/storiesMock";
import { channels } from "@/data/mock";

type Stage = "suggestion" | "liked" | "approved" | "filmed" | "publish" | "done";

const stages: { key: Stage; label: string }[] = [
  { key: "suggestion", label: "AI Suggestion" },
  { key: "liked", label: "Liked" },
  { key: "approved", label: "Approved" },
  { key: "filmed", label: "Filmed" },
  { key: "publish", label: "Publish" },
  { key: "done", label: "Done" },
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
    <div className="flex-1 px-5 py-4 bg-background border-r border-background last:border-r-0">
      <div className="text-[10px] text-dim font-mono uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-semibold font-mono tracking-tight mt-1">{value}</div>
      <div className="h-1 bg-elevated rounded-full overflow-hidden mt-2">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>(storiesMock);
  const [youtubeInput, setYoutubeInput] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [longScriptInput, setLongScriptInput] = useState("");
  const [shortScriptInput, setShortScriptInput] = useState("");
  const [channelDropOpen, setChannelDropOpen] = useState(false);
  const [suggestedTitleInput, setSuggestedTitleInput] = useState("");
  const [openingHookInput, setOpeningHookInput] = useState("");
  const [brandedHookStartInput, setBrandedHookStartInput] = useState("");
  const [brandedHookEndInput, setBrandedHookEndInput] = useState("");
  const [longScriptOpen, setLongScriptOpen] = useState(false);
  const [shortScriptOpen, setShortScriptOpen] = useState(true);
  const [shortSuggestedTitleInput, setShortSuggestedTitleInput] = useState("");
  const [shortOpeningHookInput, setShortOpeningHookInput] = useState("");
  const [shortBrandedHookStartInput, setShortBrandedHookStartInput] = useState("");
  const [shortBrandedHookEndInput, setShortBrandedHookEndInput] = useState("");

  const story = stories.find((s) => s.id === id);
  const likedStories = stories.filter((s) => s.stage === "liked").sort((a, b) => b.totalScore - a.totalScore);

  if (!story) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-12 flex items-center px-6 border-b border-[#151619] shrink-0">
          <button onClick={() => navigate("/stories")} className="flex items-center gap-2 text-[13px] text-dim hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Stories
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[13px] text-dim font-mono">Story not found</span>
        </div>
      </div>
    );
  }

  const activeStage = story.stage;

  const moveStory = (to: Stage) => {
    setStories((prev) => prev.map((s) => (s.id === id ? { ...s, stage: to } : s)));
    toast.success(`Moved to ${stages.find((s) => s.key === to)?.label}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-[#151619] shrink-0 max-lg:px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/stories")} className="flex items-center gap-2 text-[13px] text-dim hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            AI Intelligence
          </button>
          <span className="text-[11px] text-dim font-mono">/</span>
          <span className="text-[13px] font-medium truncate max-w-[400px]">{story.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-primary/15 text-primary">
            {stages.find((s) => s.key === activeStage)?.label}
          </span>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto">
        <div className="max-w-[900px] mx-auto px-6 max-lg:px-4 py-6 space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-right leading-relaxed">{story.title}</h1>
            <div className="text-[11px] text-dim font-mono mt-2">{story.source} · {story.sourceDate}</div>
          </div>

          {/* Scores row */}
          <div className="flex rounded-xl overflow-hidden">
            <ScoreBar label="Relevance" value={story.relevance} />
            <ScoreBar label="Virality" value={story.virality} />
            <ScoreBar label="First Mover" value={story.firstMover} />
            <div className="px-5 py-4 bg-background min-w-[120px]">
              <div className="text-[10px] text-dim font-mono uppercase tracking-wider">Total</div>
              <div className="text-2xl font-semibold font-mono tracking-tight mt-1">{story.totalScore}</div>
            </div>
          </div>

          {/* AI Analysis */}
          {story.aiAnalysis && (
            <div className="rounded-xl bg-background p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[10px] text-dim font-mono uppercase tracking-widest">AI Analysis</div>
                {story.isFirstMover ? (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-success/15 text-success">1st</span>
                ) : story.isLate ? (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-orange/15 text-orange">Late</span>
                ) : null}
              </div>
              <p className="text-[13px] text-sensor leading-relaxed text-right">{story.aiAnalysis}</p>
            </div>
          )}

          {/* Stage-specific content */}
          <div className="space-y-5">
            {/* SUGGESTION */}
            {activeStage === "suggestion" && (
              <>
                <div className="flex gap-2">
                  <button onClick={() => moveStory("liked")} className="flex-1 px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-full hover:opacity-90 transition-opacity">
                    Save to Liked
                  </button>
                  <button onClick={() => { setStories((p) => p.filter((s) => s.id !== id)); navigate("/stories"); toast("Passed"); }} className="flex-1 px-4 py-2.5 text-[13px] font-medium rounded-full border border-border text-dim hover:text-sensor transition-colors">
                    Pass
                  </button>
                </div>
              </>
            )}

            {/* LIKED */}
            {activeStage === "liked" && (
              <>
                <div className="rounded-xl bg-background p-5">
                  <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">Ranking</div>
                  <div className="text-[13px] font-semibold mb-3">
                    Ranked #{likedStories.findIndex((s) => s.id === id) + 1} of {likedStories.length} liked — Score {story.totalScore}
                  </div>
                  <div className="space-y-1">
                    {likedStories.map((s, i) => {
                      const isCurrent = s.id === id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            if (!isCurrent) navigate(`/story/${s.id}`);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] transition-colors group ${
                            isCurrent
                              ? "bg-[#0d0d10] text-foreground cursor-default"
                              : "text-dim hover:bg-[#0d0d10] cursor-pointer"
                          }`}
                        >
                          <span className="font-mono w-5">#{i + 1}</span>
                          {s.isFirstMover ? (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-success/15 text-success shrink-0">1st</span>
                          ) : s.isLate ? (
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-orange/15 text-orange shrink-0">Late</span>
                          ) : null}
                          <span className="flex-1 truncate text-right transition-colors group-hover:text-foreground">{s.title}</span>
                          <span className="font-mono font-medium">{s.totalScore}</span>
                          {!isCurrent && (
                            <ArrowUpRight className="w-3 h-3 text-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Channel selector */}
                <div className="rounded-xl bg-background p-5">
                  <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">Assign to Channel</div>
                  {(() => {
                    const ourChannels = channels.filter((c) => c.type === "ours").filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);
                    const selected = ourChannels.find((c) => c.id === selectedChannel);
                    const [dropOpen, setDropOpen] = [channelDropOpen, setChannelDropOpen];
                    return (
                      <div className="relative">
                        <button
                          onClick={() => setDropOpen(!dropOpen)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 bg-surface border border-border rounded-full text-[13px] font-medium focus:outline-none focus:border-primary/40"
                        >
                          {selected ? (
                            <>
                              <img src={selected.avatarImg} alt={selected.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                              <span className="flex-1 text-right">{selected.name}</span>
                            </>
                          ) : (
                            <span className="flex-1 text-right text-dim">Select one of your channels…</span>
                          )}
                          <ChevronDown className={`w-4 h-4 text-dim shrink-0 transition-transform ${dropOpen ? "rotate-180" : ""}`} />
                        </button>
                        {dropOpen && (
                          <div className="absolute z-10 mt-1.5 w-full rounded-xl bg-elevated border border-border overflow-hidden shadow-lg">
                            {ourChannels.map((c) => (
                              <button
                                key={c.id}
                                onClick={() => { setSelectedChannel(c.id); setDropOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors hover:bg-surface ${selectedChannel === c.id ? "bg-blue/10" : ""}`}
                              >
                                <img src={c.avatarImg} alt={c.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                                <span className="flex-1 text-right font-medium">{c.name}</span>
                                {selectedChannel === c.id && <Check className="w-3.5 h-3.5 text-blue shrink-0" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Script inputs */}
                <div className="rounded-xl bg-background p-5 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] text-dim font-mono uppercase tracking-widest">Scripts</div>
                    <button
                      onClick={() => toast("AI script generation coming soon…")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-blue bg-blue/10 rounded-full hover:bg-blue/20 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate with AI
                    </button>
                  </div>

                  {/* Short Script — collapsible */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => setShortScriptOpen(!shortScriptOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-surface hover:bg-elevated transition-colors"
                    >
                      <span className="text-[12px] font-semibold">Short Script (1–2 min)</span>
                      <ChevronDown className={`w-4 h-4 text-dim transition-transform ${shortScriptOpen ? "rotate-180" : ""}`} />
                    </button>
                    {shortScriptOpen && (
                      <div className="px-4 py-4 space-y-4 border-t border-border">
                        <div>
                          <label className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1.5 block">Suggested Title</label>
                          <input type="text" value={shortSuggestedTitleInput} onChange={(e) => setShortSuggestedTitleInput(e.target.value)} placeholder="عنوان الشورت المقترح..." className="w-full px-4 py-2.5 text-[13px] bg-background border border-border rounded-xl text-foreground placeholder:text-dim focus:outline-none focus:border-blue/40 text-right" />
                        </div>
                        <div>
                          <label className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1.5 block">Opening Hook (first 10 sec)</label>
                          <input type="text" value={shortOpeningHookInput} onChange={(e) => setShortOpeningHookInput(e.target.value)} placeholder="الجملة الأولى التي تجذب المشاهد..." className="w-full px-4 py-2.5 text-[13px] bg-background border border-border rounded-xl text-foreground placeholder:text-dim focus:outline-none focus:border-blue/40 text-right" />
                        </div>
                        <div>
                          <label className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1.5 block">Branded Hook Start</label>
                          <input type="text" value={shortBrandedHookStartInput} onChange={(e) => setShortBrandedHookStartInput(e.target.value)} placeholder="e.g. أهلاً وسهلاً بكم في قناة..." className="w-full px-4 py-2.5 text-[13px] bg-background border border-border rounded-xl text-foreground placeholder:text-dim focus:outline-none focus:border-blue/40 text-right" />
                        </div>
                        <div>
                          <label className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1.5 block">Script — with timestamps</label>
                          <textarea value={shortScriptInput} onChange={(e) => setShortScriptInput(e.target.value)} placeholder="00:00 هوك&#10;00:15 المحتوى..." rows={3} className="w-full px-4 py-3 text-[13px] bg-background border border-border rounded-xl text-foreground font-mono placeholder:text-dim focus:outline-none focus:border-blue/40 text-right leading-relaxed resize-y" />
                        </div>
                        <div>
                          <label className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1.5 block">Branded Hook End</label>
                          <input type="text" value={shortBrandedHookEndInput} onChange={(e) => setShortBrandedHookEndInput(e.target.value)} placeholder="e.g. لا تنسوا الاشتراك وتفعيل الجرس..." className="w-full px-4 py-2.5 text-[13px] bg-background border border-border rounded-xl text-foreground placeholder:text-dim focus:outline-none focus:border-blue/40 text-right" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Long Script — collapsible */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => setLongScriptOpen(!longScriptOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-surface hover:bg-elevated transition-colors"
                    >
                      <span className="text-[12px] font-semibold">Long Script (20–40 min)</span>
                      <ChevronDown className={`w-4 h-4 text-dim transition-transform ${longScriptOpen ? "rotate-180" : ""}`} />
                    </button>
                    {longScriptOpen && (
                      <div className="px-4 py-4 space-y-4 border-t border-border">
                        <div>
                          <label className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1.5 block">Suggested Title</label>
                          <input type="text" value={suggestedTitleInput} onChange={(e) => setSuggestedTitleInput(e.target.value)} placeholder="عنوان الفيديو المقترح..." className="w-full px-4 py-2.5 text-[13px] bg-background border border-border rounded-xl text-foreground placeholder:text-dim focus:outline-none focus:border-blue/40 text-right" />
                        </div>
                        <div>
                          <label className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1.5 block">Opening Hook (first 10 sec)</label>
                          <input type="text" value={openingHookInput} onChange={(e) => setOpeningHookInput(e.target.value)} placeholder="الجملة الأولى التي تجذب المشاهد..." className="w-full px-4 py-2.5 text-[13px] bg-background border border-border rounded-xl text-foreground placeholder:text-dim focus:outline-none focus:border-blue/40 text-right" />
                        </div>
                        <div>
                          <label className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1.5 block">Branded Hook Start</label>
                          <input type="text" value={brandedHookStartInput} onChange={(e) => setBrandedHookStartInput(e.target.value)} placeholder="e.g. أهلاً وسهلاً بكم في قناة..." className="w-full px-4 py-2.5 text-[13px] bg-background border border-border rounded-xl text-foreground placeholder:text-dim focus:outline-none focus:border-blue/40 text-right" />
                        </div>
                        <div>
                          <label className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1.5 block">Script — with timestamps</label>
                          <textarea value={longScriptInput} onChange={(e) => setLongScriptInput(e.target.value)} placeholder="00:00 مقدمة&#10;01:30 القصة تبدأ..." rows={5} className="w-full px-4 py-3 text-[13px] bg-background border border-border rounded-xl text-foreground font-mono placeholder:text-dim focus:outline-none focus:border-blue/40 text-right leading-relaxed resize-y" />
                        </div>
                        <div>
                          <label className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1.5 block">Branded Hook End</label>
                          <input type="text" value={brandedHookEndInput} onChange={(e) => setBrandedHookEndInput(e.target.value)} placeholder="e.g. لا تنسوا الاشتراك وتفعيل الجرس..." className="w-full px-4 py-2.5 text-[13px] bg-background border border-border rounded-xl text-foreground placeholder:text-dim focus:outline-none focus:border-blue/40 text-right" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {(() => {
                  const hasLongContent = suggestedTitleInput.trim() || openingHookInput.trim() || brandedHookStartInput.trim() || longScriptInput.trim() || brandedHookEndInput.trim();
                  const hasShortContent = shortSuggestedTitleInput.trim() || shortOpeningHookInput.trim() || shortBrandedHookStartInput.trim() || shortScriptInput.trim() || shortBrandedHookEndInput.trim();
                  const canApprove = !!selectedChannel && (!!hasLongContent || !!hasShortContent);
                  return (
                    <div className="flex gap-2">
                      <button
                        disabled={!canApprove}
                        onClick={() => {
                          const parseScript = (raw: string) => raw.trim() ? raw.trim().split("\n").map((line) => {
                            const match = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)/);
                            return match ? { time: match[1], text: match[2] } : { time: "", text: line };
                          }) : undefined;
                          setStories((prev) => prev.map((s) => s.id === id ? {
                            ...s,
                            channelId: selectedChannel,
                            stage: "approved" as Stage,
                            script: parseScript(longScriptInput) || s.script,
                            shortScript: parseScript(shortScriptInput),
                          } : s));
                          toast.success(`Moved to ${stages.find((s) => s.key === "approved")?.label}`);
                        }}
                        className={`flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-full transition-opacity ${canApprove ? "bg-blue text-blue-foreground hover:opacity-90" : "bg-blue/30 text-blue-foreground/40 cursor-not-allowed"}`}
                      >
                        Approve
                      </button>
                      <button onClick={() => moveStory("suggestion")} className="flex-1 px-4 py-2.5 text-[13px] font-medium rounded-full border border-border text-dim hover:text-sensor transition-colors">
                        Pass
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

            {/* APPROVED */}
            {activeStage === "approved" && (
              <>
                {story.channelId && (() => {
                  const ch = channels.find((c) => c.id === story.channelId);
                  return ch ? (
                    <div className="rounded-xl bg-background p-5 flex items-center gap-3">
                      <div className="text-[10px] text-dim font-mono uppercase tracking-widest">Channel</div>
                      <button
                        onClick={() => navigate(`/channel/${ch.id}`)}
                        className="group relative flex items-center gap-2"
                      >
                        <img src={ch.avatarImg} alt={ch.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-elevated text-[12px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {ch.name}
                        </span>
                      </button>
                    </div>
                  ) : null;
                })()}
                <div className="rounded-xl bg-background p-5 space-y-5">
                  <div className="text-[10px] text-dim font-mono uppercase tracking-widest">Production Brief</div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Suggested Title</span>
                      {story.suggestedTitle && <CopyBtn text={story.suggestedTitle} />}
                    </div>
                    <div className="rounded-xl bg-surface px-4 py-3 text-[13px] text-right leading-relaxed">{story.suggestedTitle}</div>
                  </div>

                  {(() => {
                    const ch = channels.find((c) => c.id === story.channelId);
                    const openingHook = ch?.startHook || story.openingHook;
                    const endingHook = ch?.endHook || story.endingHook;
                    return (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Opening Hook (first 10 sec)</span>
                            {openingHook && <CopyBtn text={openingHook} />}
                          </div>
                          <div className="rounded-xl bg-surface px-4 py-3 text-[13px] text-right leading-relaxed">{openingHook}</div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Ending Hook</span>
                            {endingHook && <CopyBtn text={endingHook} />}
                          </div>
                          <div className="rounded-xl bg-surface px-4 py-3 text-[13px] text-right leading-relaxed">{endingHook}</div>
                        </div>
                      </>
                    );
                  })()}

                  {story.script && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Long Script (20–40 min) — with timestamps</span>
                        <CopyBtn text={story.script.map((s) => `${s.time} ${s.text}`).join("\n")} />
                      </div>
                      <div className="rounded-xl bg-surface overflow-hidden">
                        {story.script.map((s, i) => (
                          <div key={i} className={`flex items-start gap-4 px-4 py-3 ${i < story.script!.length - 1 ? "border-b border-border" : ""}`}>
                            <span className="text-[13px] font-mono font-bold text-blue shrink-0 pt-0.5">{s.time}</span>
                            <span className="text-[13px] text-sensor leading-relaxed text-right flex-1">{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {story.shortScript && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-dim font-mono uppercase tracking-wider">Short Script (1–2 min) — with timestamps</span>
                        <CopyBtn text={story.shortScript.map((s) => `${s.time} ${s.text}`).join("\n")} />
                      </div>
                      <div className="rounded-xl bg-surface overflow-hidden">
                        {story.shortScript.map((s, i) => (
                          <div key={i} className={`flex items-start gap-4 px-4 py-3 ${i < story.shortScript!.length - 1 ? "border-b border-border" : ""}`}>
                            <span className="text-[13px] font-mono font-bold text-blue shrink-0 pt-0.5">{s.time}</span>
                            <span className="text-[13px] text-sensor leading-relaxed text-right flex-1">{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => moveStory("filmed")} className="w-full px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-full hover:opacity-90 transition-opacity">
                  + Mark as Filmed
                </button>
              </>
            )}

            {/* FILMED */}
            {activeStage === "filmed" && (
              <div className="rounded-xl bg-background p-5">
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
                      setStories((prev) => prev.map((s) => s.id === id ? { ...s, youtubeUrl: youtubeInput.trim(), stage: "done" as Stage, views: 0, likes: 0, comments: 0, gapWin: false } : s));
                      setYoutubeInput("");
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
              <div className="rounded-xl bg-background p-5">
                <p className="text-[12px] text-dim font-mono mb-4">Final details to confirm before marking done.</p>
                <button onClick={() => moveStory("done")} className="w-full px-4 py-2.5 text-[13px] font-semibold bg-blue text-blue-foreground rounded-full hover:opacity-90 transition-opacity">
                  Mark as Done
                </button>
              </div>
            )}

            {/* DONE */}
            {activeStage === "done" && (
              <>
                {story.gapWin && (
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
                      { icon: Eye, val: story.views, label: "Views" },
                      { icon: ThumbsUp, val: story.likes, label: "Likes" },
                      { icon: MessageSquare, val: story.comments, label: "Comments" },
                    ].map((m) => {
                      const fmt = (n?: number) => !n ? "0" : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : String(n);
                      return (
                        <div key={m.label} className="flex-1 px-4 py-3 bg-background border-r border-background last:border-r-0">
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
                <div className="flex rounded-xl overflow-hidden">
                  <ScoreBar label="Relevance" value={story.relevance} />
                  <ScoreBar label="Virality" value={story.virality} />
                  <ScoreBar label="First Mover" value={story.firstMover} />
                </div>

                {story.youtubeUrl && (
                  <a href={story.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12px] text-blue font-mono hover:opacity-80 transition-opacity">
                    <ExternalLink className="w-3.5 h-3.5" />
                    YouTube Link
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
