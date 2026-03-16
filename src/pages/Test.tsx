import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Wand2,
  RefreshCw,
  Sparkles,
  User,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Info,
  X,
  Clock,
  Ban,
  EyeOff,
  SkipForward,
  Trophy,
  Eye,
  ThumbsUp,
  MessageSquare,
  Pencil,
  Smartphone,
  Monitor,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { storiesMock } from "@/data/storiesMock";
import { channels } from "@/data/mock";
import ch1 from "@/assets/avatars/ch1.jpg";
import ch2 from "@/assets/avatars/ch2.jpg";
import ch3 from "@/assets/avatars/ch3.jpg";
import ScriptEditor from "@/components/ScriptEditor";


// Mock edit history
const editHistory = [
  { id: 1, action: "Edited script", type: "script_edit", user: "Abdulaziz Aldhubaib", avatar: ch1, time: "less than a minute ago" },
  { id: 2, action: "Edited script", type: "script_edit", user: "Abdulaziz Aldhubaib", avatar: ch1, time: "1 minute ago" },
  { id: 3, action: "Edited script", type: "script_edit", user: "Abdulaziz Aldhubaib", avatar: ch1, time: "1 minute ago" },
  { id: 4, action: "Edited script", type: "script_edit", user: "Abdulaziz Aldhubaib", avatar: ch1, time: "1 minute ago" },
  { id: 5, action: "Edited script", type: "script_edit", user: "Abdulaziz Aldhubaib", avatar: ch1, time: "6 minutes ago" },
];

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex-1 min-w-0 px-5 py-4">
      <div className="text-[11px] text-dim mb-0.5">{label}</div>
      <div className="text-lg font-semibold font-mono tracking-tight mb-2">{value}</div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied");
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-[11px] text-dim hover:text-sensor font-mono flex items-center gap-1 transition-colors shrink-0"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

export default function Test() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stories, setStories] = useState(storiesMock);
  const resolvedIndex = id ? stories.findIndex((s) => s.id === id) : -1;
  const [currentIndex, setCurrentIndex] = useState(resolvedIndex >= 0 ? resolvedIndex : 2);
  const story = stories[currentIndex];

  // Article state
  const [articleTitle, setArticleTitle] = useState("فضيحة تسريب بيانات 50 مليون مستخدم عاب من تطبيق مشهور");
  const [articleText, setArticleText] = useState(
    story?.aiAnalysis
      ? `قتل 80 امرأة ووصف جرائمه بأنها "مجرد لعبة".. تعرف على سفاح "تايمز سكوير" يبدو مجرد التفكير بوجود قاتلين متسلسلين ومجرمين يعيشون حولنا شيئاً مرعباً لا يتحمل بعضنا حتى تخيله، ولكن الأكثر رعباً هو وجود هذا النوع من البشر في هيئة أشخاص طبيعيين لديهم عائلات ويبعدون كل البعد عن الشك، ونموذج من هؤلاء: القاتل المتسلسل الأمريكي الذي لُقب بـ"قاتل الجذع" ورُوِّع مدينة نيويورك على مدى سنوات حتى قُبض عليه، وفي أحدث مسلسلاتها الوثائقية "مسرح الجريمة: قاتل في تايمز سكوير".`
      : ""
  );
  const [aiCleaning, setAiCleaning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  // Script state
  const [scriptFormat, setScriptFormat] = useState<"short" | "long">("short");
  const [scriptDuration, setScriptDuration] = useState(3); // minutes

  const [titleInput, setTitleInput] = useState("");

  // Done stage state
  const [editingShortUrl, setEditingShortUrl] = useState(false);
  const [editingLongUrl, setEditingLongUrl] = useState(false);
  const [shortUrlInput, setShortUrlInput] = useState("");
  const [longUrlInput, setLongUrlInput] = useState("");
  const [youtubeInput, setYoutubeInput] = useState("");


  // Channel
  const [selectedChannel, setSelectedChannel] = useState("");
  const [channelDropOpen, setChannelDropOpen] = useState(false);
  const canGenerate = !!selectedChannel;

  // History
  const [historyOpen, setHistoryOpen] = useState(false);
  const [actionDropOpen, setActionDropOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"pass" | "omit" | null>(null);

  const actionDropRef = useRef<HTMLDivElement>(null);
  const channelDropRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (actionDropOpen && actionDropRef.current && !actionDropRef.current.contains(e.target as Node)) {
        setActionDropOpen(false);
      }
      if (channelDropOpen && channelDropRef.current && !channelDropRef.current.contains(e.target as Node)) {
        setChannelDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionDropOpen, channelDropOpen]);

  // Editing
  const [editingField, setEditingField] = useState<string | null>(null);

  // Article collapsible
  const [articleOpen, setArticleOpen] = useState(false);

  const handleAiCleanup = useCallback(() => {
    if (aiCleaning || !articleText.trim()) return;
    setAiCleaning(true);
    setAiProgress(0);
    const duration = 3000;
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const progress = Math.min((elapsed / duration) * 100, 95);
      setAiProgress(progress);
      if (elapsed >= duration) {
        clearInterval(timer);
        const cleaned = articleText.replace(/\s{2,}/g, " ").trim();
        setArticleText(`${cleaned}\n\n— تم تنظيف وتحسين النص بواسطة الذكاء الاصطناعي`);
        setAiProgress(100);
        setTimeout(() => {
          setAiCleaning(false);
          setAiProgress(0);
          toast.success("Article cleaned up by AI");
        }, 400);
      }
    }, interval);
  }, [aiCleaning, articleText]);


  if (!story) return null;

  const ourChannels = channels.filter((c) => c.type === "ours").filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);
  const selectedCh = ourChannels.find((c) => c.id === selectedChannel);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="h-auto min-h-[48px] flex items-center justify-between px-6 border-b border-[#151619] shrink-0 max-lg:px-4 max-sm:flex-wrap max-sm:gap-2 max-sm:py-2">
        <button
          onClick={() => navigate("/stories")}
          className="flex items-center gap-1.5 text-[13px] text-dim cursor-pointer bg-transparent border-none font-sans hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="max-sm:hidden">AI Intelligence</span>
        </button>
        <div className="flex items-center gap-1.5 max-sm:gap-1 flex-wrap justify-end">
          <button
            onClick={() => setHistoryOpen(true)}
            className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-full flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors"
          >
            <Clock className="w-4 h-4 max-sm:w-3.5 max-sm:h-3.5" />
          </button>
          {/* Actions dropdown */}
          <div className="relative" ref={actionDropRef}>
            <button
              onClick={() => setActionDropOpen(!actionDropOpen)}
              className="inline-flex items-center gap-1 py-1 px-2.5 max-sm:px-2 rounded-full text-[11px] max-sm:text-[10px] font-medium border border-border text-dim hover:text-foreground hover:border-primary/40 transition-colors"
            >
              <span className={`font-mono ${story.stage === "suggestion" ? "text-orange" : story.stage === "liked" ? "text-blue" : story.stage === "approved" ? "text-purple" : story.stage === "filmed" ? "text-success" : story.stage === "publish" ? "text-pink-400" : "text-foreground"}`}>{story.stage === "suggestion" ? "Suggestion" : story.stage === "liked" ? "Liked" : story.stage === "approved" ? "Scripting" : story.stage === "filmed" ? "Filmed" : story.stage === "publish" ? "Publish" : "Done"}</span>
              <ChevronDown className={`w-3 h-3 text-dim/40 transition-transform ${actionDropOpen ? "rotate-180" : ""}`} />
            </button>
            {actionDropOpen && (() => {
              const stageOrder: Array<"suggestion" | "liked" | "approved" | "filmed" | "publish" | "done"> = ["suggestion", "liked", "approved", "filmed", "publish", "done"];
              const stageLabels: Record<string, string> = { suggestion: "Suggestion", liked: "Liked", approved: "Scripting", filmed: "Filmed", publish: "Publish", done: "Done" };
              const currentStageIdx = stageOrder.indexOf(story.stage);
              const nextStage = currentStageIdx < stageOrder.length - 1 ? stageOrder[currentStageIdx + 1] : null;
              return (
              <div className="absolute z-20 mt-2 right-0 w-48 rounded-xl bg-surface border border-border overflow-hidden shadow-lg">
                {nextStage && (
                <button
                  onClick={() => { setActionDropOpen(false); setStories(prev => prev.map((s, i) => i === currentIndex ? { ...s, stage: nextStage } : s)); toast.success(`Moved to ${stageLabels[nextStage]}`); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-foreground hover:bg-elevated transition-colors"
                >
                  <SkipForward className={`w-3.5 h-3.5 ${nextStage === "liked" ? "text-blue" : nextStage === "approved" ? "text-purple" : nextStage === "filmed" ? "text-success" : nextStage === "publish" ? "text-pink-400" : "text-foreground"}`} />
                  <span className="font-medium">Move to {stageLabels[nextStage]}</span>
                </button>
                )}
                <div className="h-px bg-border" />
                <button
                  onClick={() => { setActionDropOpen(false); setConfirmAction("pass"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-dim hover:text-orange hover:bg-elevated transition-colors"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Pass</span>
                </button>
                <button
                  onClick={() => { setActionDropOpen(false); setConfirmAction("omit"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-dim hover:text-destructive hover:bg-elevated transition-colors"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Omit</span>
                </button>
              </div>
              );
            })()}
          </div>

          {/* Confirmation dialog for Pass/Omit */}
          <AlertDialog open={confirmAction !== null} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{confirmAction === "pass" ? "Pass on this story?" : "Omit this story?"}</AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmAction === "pass"
                    ? "This story will be removed from the pipeline. You can always bring it back later."
                    : "This story will be skipped and won't appear in future suggestions."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => { toast.success(confirmAction === "pass" ? "Story passed" : "Story omitted"); setConfirmAction(null); }}
                  className={confirmAction === "pass" ? "bg-red text-white hover:bg-red/90" : "bg-orange text-white hover:bg-orange/90"}
                >
                  {confirmAction === "pass" ? "Pass" : "Omit"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* Navigation */}
          <div className="flex items-center gap-0.5 ml-1 max-sm:ml-0">
            <button
              onClick={() => { const ni = Math.max(0, currentIndex - 1); setCurrentIndex(ni); navigate(`/story/${stories[ni].id}`, { replace: true }); }}
              disabled={currentIndex === 0}
              className="w-7 h-7 rounded-full flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors disabled:opacity-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono text-dim px-0.5">
              {currentIndex + 1}/{stories.length}
            </span>
            <button
              onClick={() => { const ni = Math.min(stories.length - 1, currentIndex + 1); setCurrentIndex(ni); navigate(`/story/${stories[ni].id}`, { replace: true }); }}
              disabled={currentIndex === stories.length - 1}
              className="w-7 h-7 rounded-full flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors disabled:opacity-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-6 max-lg:px-4 max-sm:px-3 py-5 pb-16 space-y-5">

          {/* ─── ARTICLE SECTION ─── */}
          <section>
            <div className="rounded-xl bg-background border border-border overflow-hidden">
              <button
                onClick={() => setArticleOpen(!articleOpen)}
                className="w-full px-5 max-sm:px-3 py-3.5 flex items-center justify-between hover:bg-surface/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {articleOpen ? <ChevronUp className="w-4 h-4 text-dim" /> : <ChevronDown className="w-4 h-4 text-dim" />}
                  <span className="text-[12px] text-dim font-medium">Original Story</span>
                </div>
                <div className="flex items-center gap-2.5 max-sm:gap-1.5">
                  <div className="flex items-center gap-1.5 max-sm:gap-1">
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 cursor-default">
                          <span className="text-[10px] text-dim font-mono">R</span>
                          <span className="text-[10px] font-mono font-semibold text-purple">{story.relevance}</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Relevance</TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 cursor-default">
                          <span className="text-[10px] text-dim font-mono">V</span>
                          <span className="text-[10px] font-mono font-semibold text-blue">{story.virality}</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Virality</TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 cursor-default max-sm:hidden">
                          <span className="text-[10px] text-dim font-mono">F</span>
                          <span className="text-[10px] font-mono font-semibold text-success">{story.firstMover}</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>First Mover</TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center gap-1 cursor-default">
                          <span className="text-[10px] text-dim font-mono">T</span>
                          <span className="text-[10px] font-mono font-semibold text-foreground">{story.totalScore}</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Total Score</TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="w-px h-3 bg-border max-sm:hidden" />
                  <span className="text-[11px] text-dim font-mono max-sm:hidden">2 days ago</span>
                </div>
              </button>
              {articleOpen && (
                <>
                  {/* Action bar */}
                  <div className="px-4 py-2.5 border-t border-border flex items-center gap-1.5">
                    <button
                      onClick={handleAiCleanup}
                      disabled={aiCleaning || !articleText.trim()}
                      className="px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors whitespace-nowrap border border-border/50 text-dim hover:text-sensor hover:border-border disabled:opacity-30"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Wand2 className={`w-3.5 h-3.5 ${aiCleaning ? "animate-spin" : ""}`} />
                        Clean up with AI
                      </span>
                    </button>
                    <button
                      onClick={() => toast("Re-fetching article…")}
                      disabled={aiCleaning}
                      className="px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors whitespace-nowrap border border-border/50 text-dim hover:text-sensor hover:border-border disabled:opacity-30"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Re-fetch
                      </span>
                    </button>
                  </div>
                  {/* Title */}
                  <div className="px-5 pt-4">
                    <label className="text-[11px] text-dim font-mono uppercase tracking-wider mb-2 flex items-center justify-between" dir="rtl">
                      <span>Title</span>
                      <a href="#" className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-blue hover:text-blue/80 transition-colors no-underline">
                        <ExternalLink className="w-3 h-3" />
                        Read source
                      </a>
                    </label>
                    <input
                      type="text"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      disabled={aiCleaning}
                      dir="rtl"
                      className="w-full px-3 py-2.5 text-[14px] bg-transparent border-0 border-b border-border rounded-none text-foreground placeholder:text-dim/50 focus:outline-none focus:border-primary/40 text-right font-medium"
                      placeholder="عنوان المقال..."
                    />
                  </div>
                  {/* AI cleaning progress */}
                  {aiCleaning && (
                    <div className="px-5 pt-3">
                      <Progress value={aiProgress} className="h-1 bg-muted" />
                      <div className="text-[10px] font-mono text-dim mt-1 text-center">
                        {aiProgress < 30 ? "Analyzing text…" : aiProgress < 70 ? "Cleaning up…" : aiProgress < 100 ? "Finalizing…" : "Done!"}
                      </div>
                    </div>
                  )}
                  {/* Content */}
                  <div className="px-5 pt-4 pb-5">
                    <label className="text-[11px] text-dim font-mono uppercase tracking-wider mb-2 block text-right">Content ({articleText.length.toLocaleString()})</label>
                    <textarea
                      value={articleText}
                      onChange={(e) => setArticleText(e.target.value)}
                      disabled={aiCleaning}
                      dir="rtl"
                      rows={12}
                      className="w-full text-[14px] bg-transparent text-foreground placeholder:text-dim/50 focus:outline-none text-right leading-[1.9] resize-y disabled:opacity-50"
                      placeholder="اكتب المقال الكامل هنا..."
                    />
                  </div>
                </>
              )}
            </div>
          </section>





          {/* ─── SCRIPT EDITOR ─── */}
          {story.stage !== "suggestion" && story.stage !== "liked" && (
          <section>
            <div className="mb-2">
              <span className="text-[12px] text-dim font-medium">Script</span>
            </div>
            <div className="rounded-xl bg-background border border-border overflow-visible">
              {/* Command bar — capsule style */}
              <div className="px-4 max-sm:px-3 py-3 flex items-center justify-between border-b border-border flex-wrap gap-2">
                <div className="flex items-center gap-3 flex-1">
                  {/* The capsule */}
                  <div className="inline-flex items-center bg-surface rounded-full border border-border flex-wrap">
                    {/* Channel */}
                    <div className="relative" ref={channelDropRef}>
                      <button
                        onClick={() => setChannelDropOpen(!channelDropOpen)}
                        className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1.5 hover:bg-elevated transition-colors rounded-l-full"
                      >
                        {selectedCh ? (
                          <img src={selectedCh.avatarImg} alt={selectedCh.name} className="w-5 h-5 rounded-full object-cover" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-border/50 flex items-center justify-center">
                            <User className="w-3 h-3 text-dim" />
                          </div>
                        )}
                        <ChevronDown className={`w-2.5 h-2.5 text-dim transition-transform ${channelDropOpen ? "rotate-180" : ""}`} />
                      </button>
                      {channelDropOpen && (
                        <div className="absolute z-10 mt-2 left-0 w-64 rounded-xl bg-surface border border-border overflow-hidden shadow-lg">
                          {ourChannels.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => { setSelectedChannel(c.id); setChannelDropOpen(false); }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors hover:bg-elevated ${
                                selectedChannel === c.id ? "bg-blue/10" : ""
                              }`}
                            >
                              <img src={c.avatarImg} alt={c.name} className="w-7 h-7 rounded-full object-cover" />
                              <span className="flex-1 text-right font-medium">{c.name}</span>
                              {selectedChannel === c.id && <Check className="w-3.5 h-3.5 text-blue" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="w-px h-4 bg-border" />

                    {/* Format toggle */}
                    <div className="flex items-center px-1">
                      {(["short", "long"] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => { setScriptFormat(fmt); setScriptDuration(fmt === "short" ? 3 : 40); }}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors whitespace-nowrap ${
                            scriptFormat === fmt
                              ? "bg-background text-foreground shadow-sm"
                              : "text-dim hover:text-sensor"
                          }`}
                        >
                          {fmt === "short" ? "Short" : "Video"}
                        </button>
                      ))}
                    </div>

                    <span className="w-px h-4 bg-border" />

                    {/* Duration */}
                    <div className="flex items-center gap-1 px-2.5 text-[11px] text-dim">
                      <Clock className="w-3 h-3" />
                      <input
                        type="number"
                        value={scriptDuration}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (scriptFormat === "short") {
                            setScriptDuration(Math.max(1, Math.min(3, val)));
                          } else {
                            setScriptDuration(Math.max(3, val));
                          }
                        }}
                        className="w-10 px-1 py-0.5 text-[11px] font-mono bg-background border border-border rounded-full text-foreground text-center focus:outline-none focus:border-blue [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="font-mono text-[10px]">m</span>
                    </div>

                    <span className="w-px h-4 bg-border" />

                    {/* Generate */}
                    <button
                      onClick={() => canGenerate ? toast("Generating script from article…") : toast.error("Please assign a channel first")}
                      disabled={!canGenerate}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap rounded-r-full ${
                        canGenerate ? "text-dim hover:text-foreground hover:bg-elevated" : "text-dim/30 cursor-not-allowed"
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      Generate
                    </button>
                  </div>
                </div>

                {/* Collaborators — hidden on mobile */}
                <div className="flex items-center -space-x-2 max-sm:hidden">
                  {[ch1, ch2, ch3].map((avatar, i) => (
                    <div key={i} className="relative">
                      <img src={avatar} alt={`Collaborator ${i + 1}`} className="w-7 h-7 rounded-full object-cover border-2 border-background" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-success border border-background" />
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full bg-surface border-2 border-background flex items-center justify-center text-[10px] text-muted-foreground font-medium">+2</div>
                </div>
              </div>

              <div className="px-5 max-sm:px-3 py-4">
                <ScriptEditor />
              </div>
            </div>
          </section>
          )}

          {/* ─── DONE STAGE ─── */}
          {story.stage === "done" && (
            <section className="space-y-4">
              {story.gapWin && (
                <div className="rounded-xl bg-success/10 border border-success/20 px-5 py-4 flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-success shrink-0" />
                  <div>
                    <div className="text-[14px] font-semibold text-success">Gap Win</div>
                    <div className="text-[12px] text-success/80">You were first and the audience responded!</div>
                  </div>
                </div>
              )}

              {/* Produced format badges */}
              {story.producedFormats && story.producedFormats.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-dim font-mono uppercase tracking-widest">Produced</span>
                  {story.producedFormats.map((f) => (
                    <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue/15 text-blue flex items-center gap-1">
                      {f === "short" ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                      {f === "short" ? "Short" : "Video"}
                    </span>
                  ))}
                </div>
              )}

              {/* Per-format sections */}
              {(() => {
                const produced = story.producedFormats || [];
                const fmt = (n?: number) => !n ? "0" : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : String(n);

                const FormatCard = ({ format, url, stats, editing, setEditing, input, setInput }: {
                  format: "short" | "long";
                  url?: string;
                  stats?: { views: number; likes: number; comments: number };
                  editing: boolean;
                  setEditing: (v: boolean) => void;
                  input: string;
                  setInput: (v: string) => void;
                }) => {
                  const isShort = format === "short";
                  const label = isShort ? "Short" : "Video";
                  const Icon = isShort ? Smartphone : Monitor;

                  return (
                    <div className="rounded-xl bg-background border border-border overflow-hidden">
                      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
                        <Icon className="w-4 h-4 text-blue" />
                        <span className="text-[12px] font-semibold">{label}</span>
                      </div>

                      {stats && (
                        <div className="flex border-b border-border">
                          {[
                            { icon: Eye, val: stats.views, label: "Views" },
                            { icon: ThumbsUp, val: stats.likes, label: "Likes" },
                            { icon: MessageSquare, val: stats.comments, label: "Comments" },
                          ].map((m) => (
                            <div key={m.label} className="flex-1 px-4 py-3 border-r border-border last:border-r-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                <m.icon className="w-3 h-3 text-dim" />
                                <span className="text-[10px] text-dim font-mono uppercase">{m.label}</span>
                              </div>
                              <div className="text-lg font-semibold font-mono tracking-tight">{fmt(m.val)}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="px-5 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] text-dim font-mono uppercase tracking-widest">YouTube {label} URL</label>
                          <div className="flex items-center gap-2">
                            {!editing && url && (
                              <>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-blue hover:opacity-80 transition-opacity">
                                  <ExternalLink className="w-3 h-3" /> Open
                                </a>
                                <button onClick={() => { setInput(url || ""); setEditing(true); }} className="flex items-center gap-1 text-[10px] text-dim hover:text-sensor transition-colors">
                                  <Pencil className="w-3 h-3" /> Edit
                                </button>
                              </>
                            )}
                            {editing && (
                              <button onClick={() => {
                                if (!input.trim()) { toast.error("URL cannot be empty"); return; }
                                const urlKey = isShort ? "shortYoutubeUrl" : "longYoutubeUrl";
                                setStories((prev) => prev.map((s) => s.id === story.id ? { ...s, [urlKey]: input.trim() } : s));
                                setEditing(false);
                                toast.success("URL updated");
                              }} className="text-[10px] text-blue hover:text-blue/80 font-medium transition-colors">Done</button>
                            )}
                          </div>
                        </div>
                        {editing ? (
                          <input type="url" value={input} onChange={(e) => setInput(e.target.value)} placeholder="https://youtube.com/..." className="w-full px-5 py-2.5 text-[13px] bg-surface border border-border rounded-full text-foreground font-mono placeholder:text-dim focus:outline-none focus:border-primary/40" />
                        ) : url ? (
                          <div className="rounded-full bg-surface px-5 py-2.5 text-[13px] font-mono text-sensor truncate">{url}</div>
                        ) : (
                          <div className="rounded-full bg-surface px-5 py-2.5 text-[12px] font-mono text-dim italic">No URL added yet</div>
                        )}
                      </div>
                    </div>
                  );
                };

                return (
                  <>
                    {produced.includes("long") && (
                      <FormatCard format="long" url={story.longYoutubeUrl} stats={story.longStats} editing={editingLongUrl} setEditing={setEditingLongUrl} input={longUrlInput} setInput={setLongUrlInput} />
                    )}
                    {produced.includes("short") && (
                      <FormatCard format="short" url={story.shortYoutubeUrl} stats={story.shortStats} editing={editingShortUrl} setEditing={setEditingShortUrl} input={shortUrlInput} setInput={setShortUrlInput} />
                    )}

                    {/* Produce in opposite format */}
                    {(() => {
                      const canAddShort = !produced.includes("short");
                      const canAddLong = !produced.includes("long");
                      const missing = canAddShort ? "short" : canAddLong ? "long" : null;
                      if (!missing) return null;
                      const isShort = missing === "short";
                      const label = isShort ? "Short" : "Video";
                      const Icon = isShort ? Smartphone : Monitor;

                      return (
                        <button
                          onClick={() => {
                            setStories((prev) => prev.map((s) => s.id === story.id ? {
                              ...s,
                              stage: "approved" as const,
                            } : s));
                            setScriptFormat(isShort ? "short" : "long");
                            toast.success(`Restarting pipeline for ${label} format`);
                          }}
                          className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-[13px] font-semibold rounded-full border border-dashed border-border text-dim hover:text-foreground hover:border-primary/40 hover:bg-surface/50 transition-all"
                        >
                          <Icon className="w-4 h-4" />
                          Produce as {label}
                          <RefreshCw className="w-3.5 h-3.5 text-dim" />
                        </button>
                      );
                    })()}
                  </>
                );
              })()}
            </section>
          )}



          {/* ─── EDIT HISTORY MODAL ─── */}
          {historyOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setHistoryOpen(false)}>
              <div
                className="w-full max-w-lg rounded-xl bg-background border border-border overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-5 py-4 flex items-center justify-between border-b border-border">
                  <span className="text-[13px] font-medium">Edit History</span>
                  <button onClick={() => setHistoryOpen(false)} className="text-dim hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {editHistory.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between px-5 py-3 border-b border-border last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-0.5 h-8 bg-blue/30 rounded-full" />
                        <div>
                          <div className="text-[12px] text-dim">
                            <span className="text-sensor">{entry.time}</span>
                            <span className="mx-2">{entry.action}</span>
                            <span className="text-dim font-mono">{entry.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[12px] font-medium text-sensor">{entry.user}</span>
                        <img src={entry.avatar} alt={entry.user} className="w-8 h-8 rounded-full object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
