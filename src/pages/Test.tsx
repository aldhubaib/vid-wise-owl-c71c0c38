import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { storiesMock } from "@/data/storiesMock";
import { channels } from "@/data/mock";
import ch1 from "@/assets/avatars/ch1.jpg";

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
  const navigate = useNavigate();
  const stories = storiesMock;
  const [currentIndex, setCurrentIndex] = useState(2);
  const story = stories[currentIndex];

  // Article state
  const [articleText, setArticleText] = useState(
    story?.aiAnalysis
      ? `قتل 80 امرأة ووصف جرائمه بأنها "مجرد لعبة".. تعرف على سفاح "تايمز سكوير" يبدو مجرد التفكير بوجود قاتلين متسلسلين ومجرمين يعيشون حولنا شيئاً مرعباً لا يتحمل بعضنا حتى تخيله، ولكن الأكثر رعباً هو وجود هذا النوع من البشر في هيئة أشخاص طبيعيين لديهم عائلات ويبعدون كل البعد عن الشك، ونموذج من هؤلاء: القاتل المتسلسل الأمريكي الذي لُقب بـ"قاتل الجذع" ورُوِّع مدينة نيويورك على مدى سنوات حتى قُبض عليه، وفي أحدث مسلسلاتها الوثائقية "مسرح الجريمة: قاتل في تايمز سكوير".`
      : ""
  );
  const [aiCleaning, setAiCleaning] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  // Script state
  const [scriptFormat, setScriptFormat] = useState<"short" | "long">("short");
  const [scriptContent, setScriptContent] = useState("");
  const [titleInput, setTitleInput] = useState("");

  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [suggestingTags, setSuggestingTags] = useState(false);

  // Channel
  const [selectedChannel, setSelectedChannel] = useState("");
  const [channelDropOpen, setChannelDropOpen] = useState(false);

  // History
  const [historyOpen, setHistoryOpen] = useState(false);

  // Editing
  const [editingField, setEditingField] = useState<string | null>(null);

  // Article collapsible
  const [articleOpen, setArticleOpen] = useState(true);

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

  const handleSuggestTags = () => {
    setSuggestingTags(true);
    setTimeout(() => {
      setTags(["سفاح تايمز سكوير", "جرائم القتل", "وثائقي نتفليكس", "قاتل الجذع", "ريتشارد كوتينغهام", "جرائم حقيقية"]);
      setSuggestingTags(false);
      toast.success("Tags suggested");
    }, 1500);
  };

  if (!story) return null;

  const ourChannels = channels.filter((c) => c.type === "ours").filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);
  const selectedCh = ourChannels.find((c) => c.id === selectedChannel);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar — matches Channel Detail */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-[#151619] shrink-0 max-lg:px-4">
        <button
          onClick={() => navigate("/stories")}
          className="flex items-center gap-1.5 text-[13px] text-dim cursor-pointer bg-transparent border-none font-sans hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          AI Intelligence
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[11px] font-mono font-medium bg-primary/10 text-primary">
            Scripting
          </span>
          {/* Navigation */}
          <div className="flex items-center gap-1 ml-3">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors disabled:opacity-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-dim px-1">
              {currentIndex + 1}/{stories.length}
            </span>
            <button
              onClick={() => setCurrentIndex(Math.min(stories.length - 1, currentIndex + 1))}
              disabled={currentIndex === stories.length - 1}
              className="w-8 h-8 rounded-full flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors disabled:opacity-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Hero — matches Channel Detail pattern */}
        <div className="px-6 py-5 max-lg:px-4">
          <h1 className="text-base font-semibold tracking-tight mb-1" dir="rtl">
            {story.title}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[11px] font-mono font-medium bg-success/10 text-success">
              <Check className="w-3 h-3" /> Done
            </span>
            <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[11px] font-mono font-medium bg-elevated text-dim">
              29-01-2022
            </span>
            <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[11px] font-mono font-medium bg-elevated text-dim">
              الجزيرة نت
            </span>
            <a
              href="#"
              className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[11px] font-mono font-medium bg-blue/10 text-blue hover:text-blue/80 transition-colors no-underline"
            >
              <ExternalLink className="w-3 h-3" />
              Read source
            </a>
          </div>
        </div>

        {/* Scores row — matches Channel Detail stats grid */}
        <div className="px-6 max-lg:px-4">
          <div className="grid grid-cols-4 max-lg:grid-cols-2 rounded-xl overflow-hidden border border-border">
            <div className="bg-background border-r border-b border-border">
              <ScoreBar label="Relevance" value={story.relevance} color="bg-purple" />
            </div>
            <div className="bg-background border-r border-b border-border">
              <ScoreBar label="Virality" value={story.virality} color="bg-blue" />
            </div>
            <div className="bg-background border-r border-b border-border">
              <ScoreBar label="First Mover" value={story.firstMover} color="bg-success" />
            </div>
            <div className="bg-background border-b border-border px-5 py-4">
              <div className="text-[11px] text-dim mb-0.5">Total</div>
              <div className="text-lg font-semibold font-mono tracking-tight">{story.totalScore}</div>
            </div>
          </div>
        </div>

        <div className="px-6 max-lg:px-4 py-5 pb-16 space-y-5">

          {/* ─── ARTICLE SECTION ─── */}
          <section>
            <div className="rounded-xl bg-background border border-border overflow-hidden">
              <button
                onClick={() => setArticleOpen(!articleOpen)}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-surface/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {articleOpen ? <ChevronUp className="w-4 h-4 text-dim" /> : <ChevronDown className="w-4 h-4 text-dim" />}
                  <span className="text-[12px] text-dim font-medium">Original Story</span>
                </div>
                <span className="text-[11px] text-dim font-mono">{articleText.length.toLocaleString()} chars</span>
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
                  {/* AI cleaning progress */}
                  {aiCleaning && (
                    <div className="px-5 pt-3">
                      <Progress value={aiProgress} className="h-1 bg-muted" />
                      <div className="text-[10px] font-mono text-dim mt-1 text-center">
                        {aiProgress < 30 ? "Analyzing text…" : aiProgress < 70 ? "Cleaning up…" : aiProgress < 100 ? "Finalizing…" : "Done!"}
                      </div>
                    </div>
                  )}
                  <textarea
                    value={articleText}
                    onChange={(e) => setArticleText(e.target.value)}
                    disabled={aiCleaning}
                    dir="rtl"
                    rows={12}
                    className="w-full px-5 pt-4 pb-5 text-[13px] bg-transparent text-foreground placeholder:text-dim/50 focus:outline-none text-right leading-[1.9] resize-y disabled:opacity-50"
                    placeholder="اكتب المقال الكامل هنا..."
                  />
                </>
              )}
            </div>
          </section>

          {/* ─── AI WRITER ─── */}
          <section>
            <span className="text-[12px] text-dim font-medium mb-2 block">AI Writer</span>
            <div className="rounded-xl bg-background border border-border overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {(["short", "long"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setScriptFormat(fmt)}
                      className={`px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors whitespace-nowrap border ${
                        scriptFormat === fmt
                          ? "bg-surface text-foreground border-border"
                          : "bg-transparent text-dim border-border/50 hover:text-sensor hover:border-border"
                      }`}
                    >
                      {fmt === "short" ? "Short (up to 3 min)" : "Video (3 min – unlimited)"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => toast("Generating script from article…")}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue text-blue-foreground text-[12px] font-medium hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate script
                </button>
              </div>
            </div>
          </section>

          {/* ─── YOUTUBE TAGS ─── */}
          <section>
            <span className="text-[12px] text-dim font-medium mb-2 block">YouTube Tags</span>
            <div className="rounded-xl bg-background border border-border overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between">
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center py-0.5 px-2 rounded-full text-[11px] font-mono font-medium bg-surface text-sensor">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[12px] text-dim">Get AI-suggested tags for YouTube</span>
                )}
                <button
                  onClick={handleSuggestTags}
                  disabled={suggestingTags}
                  className="px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors whitespace-nowrap border border-border/50 text-dim hover:text-sensor hover:border-border disabled:opacity-40 shrink-0 ml-3"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className={`w-3 h-3 ${suggestingTags ? "animate-spin" : ""}`} />
                    Suggest tags
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* ─── CHANNEL ─── */}
          <section>
            <span className="text-[12px] text-dim font-medium mb-2 block">Channel</span>
            <div className="rounded-xl bg-background border border-border overflow-hidden">
              <div className="px-5 py-4 relative">
                <button
                  onClick={() => setChannelDropOpen(!channelDropOpen)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {selectedCh ? (
                    <>
                      <img src={selectedCh.avatarImg} alt={selectedCh.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-[13px] font-medium">{selectedCh.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-dim" />
                      </div>
                      <span className="text-[13px] text-dim">Assign channel…</span>
                    </>
                  )}
                  <ChevronDown className={`w-4 h-4 text-dim transition-transform ${channelDropOpen ? "rotate-180" : ""}`} />
                </button>
                {channelDropOpen && (
                  <div className="absolute z-10 mt-2 left-5 w-64 rounded-xl bg-surface border border-border overflow-hidden shadow-lg">
                    {ourChannels.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedChannel(c.id);
                          setChannelDropOpen(false);
                        }}
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
            </div>
          </section>

          {/* ─── SCRIPT EDITOR ─── */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-dim font-medium">Script</span>
              <span className="text-[11px] text-dim">
                Last edited by <span className="text-sensor">Abdulaziz Aldhubaib</span> · less than a minute ago
              </span>
            </div>
            <div className="rounded-xl bg-background border border-border overflow-hidden">
              {/* Collaborator */}
              <div className="px-5 py-2.5 flex items-center gap-2 border-b border-border">
                <div className="w-5 h-5 rounded-full bg-destructive/30 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-destructive">(</span>
                </div>
                <span className="text-[12px] text-sensor">Abdulaziz Aldhubaib</span>
                <User className="w-3.5 h-3.5 text-dim" />
              </div>

              {/* Script title */}
              <div className="px-5 pt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] text-dim">Title</label>
                  {titleInput && editingField !== "title" && <CopyBtn text={titleInput} />}
                </div>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="عنوان السكريبت..."
                  dir="rtl"
                  className="w-full px-4 py-2.5 text-[14px] font-semibold bg-surface border border-border rounded-xl text-foreground placeholder:text-dim/40 focus:outline-none focus:border-blue/40 text-right"
                />
              </div>

              {/* Script body */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] text-dim">Content</label>
                </div>
                <textarea
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  placeholder="Enter text or type '/' for commands"
                  dir="rtl"
                  rows={6}
                  className="w-full px-4 py-3 text-[13px] bg-surface border border-border rounded-xl text-foreground placeholder:text-dim/40 focus:outline-none focus:border-blue/40 text-right leading-relaxed resize-y font-mono"
                />
              </div>

              {/* File attachment area */}
              <div className="px-5 pb-4">
                <div className="rounded-xl border border-dashed border-border bg-surface/50 px-4 py-3 flex items-center justify-end gap-2 text-dim hover:text-sensor transition-colors cursor-pointer">
                  <span className="text-[12px]">Add file</span>
                  <FileText className="w-4 h-4" />
                </div>
              </div>
            </div>
          </section>

          {/* ─── EDIT HISTORY ─── */}
          <section>
            <div className="rounded-xl bg-background border border-border overflow-hidden">
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-surface/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {historyOpen ? <ChevronUp className="w-4 h-4 text-dim" /> : <ChevronDown className="w-4 h-4 text-dim" />}
                  <span className="text-[12px] text-dim font-medium">Edit History</span>
                </div>
                <span className="text-[11px] text-dim font-mono">{editHistory.length} edits</span>
              </button>
              {historyOpen && (
                <div className="px-5 pb-4 space-y-0">
                  {editHistory.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
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
              )}
            </div>
          </section>

          {/* ─── MAIN ACTION ─── */}
          <button
            onClick={() => toast.success("Marked as Filmed")}
            className="w-full py-3 text-[13px] font-semibold bg-blue text-blue-foreground rounded-full hover:opacity-90 transition-opacity"
          >
            + Mark as Filmed
          </button>
        </div>
      </div>
    </div>
  );
}
