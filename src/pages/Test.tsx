import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Wand2,
  RefreshCw,
  Sparkles,
  Tag,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Check,
  Pencil,
  Copy,
  ExternalLink,
  FileText,
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
    <div className="flex-1 min-w-0">
      <div className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold font-mono tracking-tight">{value}</div>
      <div className="h-1 bg-elevated rounded-full overflow-hidden mt-2">
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
  const [currentIndex, setCurrentIndex] = useState(2); // Start at story 3
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
  const [hookInput, setHookInput] = useState("");

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
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-border shrink-0 max-lg:px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/stories")}
            className="flex items-center gap-2 text-[13px] text-dim hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            AI Intelligence
          </button>
          <span className="text-[11px] text-dim font-mono">/</span>
          <span className="text-[13px] font-medium truncate max-w-[400px]">{story.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-primary/15 text-primary">Scripting</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Action bar */}
        <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-[960px] mx-auto px-6 max-lg:px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAiCleanup}
                disabled={aiCleaning || !articleText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-medium text-dim hover:text-sensor border border-border hover:border-foreground/20 transition-colors disabled:opacity-30"
              >
                <Wand2 className={`w-3.5 h-3.5 ${aiCleaning ? "animate-spin" : ""}`} />
                Clean up with AI
              </button>
              <button
                onClick={() => toast("Re-fetching article…")}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-medium text-dim hover:text-sensor border border-border hover:border-foreground/20 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Re-fetch article
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] text-dim hover:text-foreground transition-colors disabled:opacity-20"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <span className="text-[11px] font-mono text-dim">
                {currentIndex + 1} / {stories.length}
              </span>
              <button
                onClick={() => setCurrentIndex(Math.min(stories.length - 1, currentIndex + 1))}
                disabled={currentIndex === stories.length - 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] text-dim hover:text-foreground transition-colors disabled:opacity-20"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* AI cleaning progress */}
        {aiCleaning && (
          <div className="max-w-[960px] mx-auto px-6 max-lg:px-4 pt-3">
            <Progress value={aiProgress} className="h-1 bg-muted" />
            <div className="text-[10px] font-mono text-dim mt-1 text-center">
              {aiProgress < 30 ? "Analyzing text…" : aiProgress < 70 ? "Cleaning up…" : aiProgress < 100 ? "Finalizing…" : "Done!"}
            </div>
          </div>
        )}

        <div className="max-w-[960px] mx-auto px-6 max-lg:px-4 py-8 space-y-8">
          {/* ─── ARTICLE SECTION ─── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-dim font-mono uppercase tracking-widest">Original Story</span>
              </div>
              <span className="text-[10px] font-mono text-success flex items-center gap-1">
                <Check className="w-3 h-3" /> Done
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-right leading-relaxed mb-3">
              سفاح تايمز سكوير - القاتل الأكثر إجراماً في تاريخ أمريكا
            </h1>
            <div className="flex items-center justify-end gap-3 mb-6 text-[11px] text-dim font-mono">
              <span>29-01-2022</span>
              <span>·</span>
              <span>الجزيرة نت</span>
              <button className="inline-flex items-center gap-1 text-blue hover:text-blue/80 transition-colors font-mono">
                <ExternalLink className="w-3 h-3" />
                Read source
              </button>
            </div>

            {/* Article body */}
            <div className="rounded-xl bg-background p-6">
              <textarea
                value={articleText}
                onChange={(e) => setArticleText(e.target.value)}
                disabled={aiCleaning}
                dir="rtl"
                rows={14}
                className="w-full text-[13px] bg-transparent text-foreground placeholder:text-dim/50 focus:outline-none text-right leading-[1.9] resize-y disabled:opacity-50 transition-opacity"
                placeholder="اكتب المقال الكامل هنا..."
              />
            </div>
          </section>

          {/* ─── AI WRITER ─── */}
          <section className="rounded-xl bg-surface border border-border overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-border">
              <span className="text-[10px] text-dim font-mono uppercase tracking-widest">AI Writer</span>
              <div className="flex items-center gap-1 p-0.5 bg-background rounded-full">
                <button
                  onClick={() => setScriptFormat("short")}
                  className={`px-4 py-1.5 text-[11px] font-semibold rounded-full transition-all ${
                    scriptFormat === "short" ? "bg-elevated text-foreground" : "text-dim hover:text-sensor"
                  }`}
                >
                  Short (up to 3 min)
                </button>
                <button
                  onClick={() => setScriptFormat("long")}
                  className={`px-4 py-1.5 text-[11px] font-semibold rounded-full transition-all ${
                    scriptFormat === "long" ? "bg-elevated text-foreground" : "text-dim hover:text-sensor"
                  }`}
                >
                  Video (3 min – unlimited)
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <button
                onClick={() => toast("Generating script from article…")}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-blue text-blue-foreground text-[12px] font-semibold hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate script from article
              </button>
            </div>
          </section>

          {/* ─── YOUTUBE TAGS ─── */}
          <section className="rounded-xl bg-surface border border-border overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-[10px] text-dim font-mono uppercase tracking-widest">YouTube Tags</span>
              <button
                onClick={handleSuggestTags}
                disabled={suggestingTags}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border text-[11px] font-medium text-dim hover:text-sensor transition-colors disabled:opacity-40"
              >
                <Sparkles className={`w-3 h-3 ${suggestingTags ? "animate-spin" : ""}`} />
                Suggest tags
              </button>
            </div>
            {tags.length > 0 ? (
              <div className="px-6 pb-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full bg-elevated text-[11px] font-medium text-sensor">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <div className="px-6 pb-4 text-[12px] text-dim text-right">
                Get AI-suggested tags (min 5) for YouTube. Use after you have a headline or script.
              </div>
            )}
          </section>

          {/* ─── SCORES ─── */}
          <section className="rounded-xl bg-surface border border-border p-6">
            <div className="grid grid-cols-4 gap-6">
              <ScoreBar label="Relevance" value={story.relevance} color="bg-purple" />
              <ScoreBar label="Virality" value={story.virality} color="bg-blue" />
              <ScoreBar label="First Mover" value={story.firstMover} color="bg-success" />
              <div>
                <div className="text-[10px] text-dim font-mono uppercase tracking-wider mb-1">Total</div>
                <div className="text-2xl font-bold font-mono tracking-tight">{story.totalScore}</div>
              </div>
            </div>
          </section>

          {/* ─── AI ANALYSIS ─── */}
          {story.aiAnalysis && (
            <section className="rounded-xl bg-surface border border-border p-6">
              <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">AI Analysis</div>
              <p className="text-[13px] text-sensor leading-relaxed text-right">{story.aiAnalysis}</p>
            </section>
          )}

          {/* ─── CHANNEL ─── */}
          <section className="rounded-xl bg-surface border border-border p-6">
            <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">Channel</div>
            <div className="relative">
              <button
                onClick={() => setChannelDropOpen(!channelDropOpen)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {selectedCh ? (
                  <>
                    <img src={selectedCh.avatarImg} alt={selectedCh.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-[13px] font-medium">{selectedCh.name}</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
                      <User className="w-4 h-4 text-dim" />
                    </div>
                    <span className="text-[13px] text-dim">Assign channel…</span>
                  </>
                )}
                <ChevronDown className={`w-4 h-4 text-dim transition-transform ${channelDropOpen ? "rotate-180" : ""}`} />
              </button>
              {channelDropOpen && (
                <div className="absolute z-10 mt-2 w-64 rounded-xl bg-elevated border border-border overflow-hidden shadow-lg">
                  {ourChannels.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedChannel(c.id);
                        setChannelDropOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors hover:bg-surface ${
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
          </section>

          {/* ─── SCRIPT EDITOR ─── */}
          <section className="rounded-xl bg-surface border border-border overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-border">
              <span className="text-[10px] text-dim font-mono uppercase tracking-widest">Script</span>
              <div className="text-[11px] text-dim">
                Last edited by <span className="text-sensor">Abdulaziz Aldhubaib</span> · less than a minute ago
              </div>
            </div>

            {/* Collaborator */}
            <div className="px-6 py-3 flex items-center gap-2 border-b border-border">
              <div className="w-5 h-5 rounded-full bg-destructive/30 flex items-center justify-center">
                <span className="text-[9px] font-bold text-destructive">(</span>
              </div>
              <span className="text-[12px] text-sensor">Abdulaziz Aldhubaib</span>
              <User className="w-3.5 h-3.5 text-dim" />
            </div>

            {/* Script title */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] text-dim font-mono uppercase tracking-wider">Title</label>
                {titleInput && editingField !== "title" && <CopyBtn text={titleInput} />}
              </div>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="عنوان السكريبت..."
                dir="rtl"
                className="w-full px-4 py-2.5 text-[14px] font-semibold bg-background border border-border rounded-xl text-foreground placeholder:text-dim/40 focus:outline-none focus:border-blue/40 text-right"
              />
            </div>

            {/* Script body */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] text-dim font-mono uppercase tracking-wider">Content</label>
              </div>
              <textarea
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                placeholder="Enter text or type '/' for commands"
                dir="rtl"
                rows={6}
                className="w-full px-4 py-3 text-[13px] bg-background border border-border rounded-xl text-foreground placeholder:text-dim/40 focus:outline-none focus:border-blue/40 text-right leading-relaxed resize-y font-mono"
              />
            </div>

            {/* File attachment area */}
            <div className="px-6 pb-4">
              <div className="rounded-xl border border-dashed border-border bg-background/50 px-4 py-3 flex items-center justify-end gap-2 text-dim hover:text-sensor transition-colors cursor-pointer">
                <span className="text-[12px]">Add file</span>
                <FileText className="w-4 h-4" />
              </div>
            </div>
          </section>

          {/* ─── EDIT HISTORY ─── */}
          <section className="rounded-xl bg-surface border border-border overflow-hidden">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-elevated/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                {historyOpen ? <ChevronUp className="w-4 h-4 text-dim" /> : <ChevronDown className="w-4 h-4 text-dim" />}
              </div>
              <span className="text-[10px] text-dim font-mono uppercase tracking-widest">Edit History</span>
            </button>
            {historyOpen && (
              <div className="px-6 pb-4 space-y-0">
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
          </section>

          {/* ─── MAIN ACTION ─── */}
          <button
            onClick={() => toast.success("Marked as Filmed")}
            className="w-full py-3.5 text-[14px] font-semibold bg-blue text-blue-foreground rounded-full hover:opacity-90 transition-opacity"
          >
            + Mark as Filmed
          </button>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
