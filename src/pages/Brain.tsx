import { useState } from "react";
import { RotateCcw, Save, FolderOpen, Compass, Search, Brain as BrainIcon, RefreshCw, Factory, ShieldOff, Pencil } from "lucide-react";
import { toast } from "sonner";
import QuerySection, { type SectionItem } from "@/components/brain/QuerySection";
import QueryPreview, { type QuerySections } from "@/components/brain/QueryPreview";
import { untouchedStories, publishedVideos, competitorStories } from "@/data/brainMock";
import { storiesMock } from "@/data/storiesMock";

function buildInitialSections(): QuerySections {
  return {
    base: [
      { id: "b1", text: "الجريمة والقضايا الحقيقية", enabled: true, source: "auto", meta: "Channel niche" },
      { id: "b2", text: "السعودية والخليج", enabled: true, source: "auto", meta: "Region" },
      { id: "b3", text: "آخر 7 أيام", enabled: true, source: "auto", meta: "Time range" },
      { id: "b4", text: "8 قصص كحد أقصى", enabled: true, source: "auto", meta: "Result count" },
      { id: "b5", text: "العربية", enabled: true, source: "auto", meta: "Language" },
    ],
    seekTopics: untouchedStories.map((s) => ({
      id: `seek-${s.id}`, text: s.title, enabled: true, source: "auto" as const, meta: `Open since ${s.date}`,
    })),
    memoryTier1: publishedVideos
      .filter((v) => v.result === "gap_win")
      .map((v) => ({
        id: `mem1-${v.id}`, text: v.title, enabled: true, source: "auto" as const, meta: `${v.views} views · Gap Win`,
      })),
    memoryTier2: [
      { id: "mem2-1", text: "تأكد أن القصص لم يغطها أي من المنافسين", enabled: true, source: "auto", meta: "Competitor check" },
      { id: "mem2-2", text: "أولوية للقصص ذات الطابع الدرامي والمثير", enabled: true, source: "auto", meta: "Sentiment filter" },
      { id: "mem2-3", text: "تأكد من وجود مصادر موثوقة لكل قصة", enabled: true, source: "auto", meta: "Source verification" },
    ],
    inProduction: storiesMock
      .filter((s) => ["approved", "filmed", "publish"].includes(s.stage))
      .map((s) => ({
        id: `prod-${s.id}`, text: s.title, enabled: true, source: "auto" as const, meta: `Stage: ${s.stage}`,
      })),
    avoidList: competitorStories.slice(0, 6).map((s) => ({
      id: `avoid-${s.id}`, text: s.title, enabled: true, source: "auto" as const,
      meta: `${s.competitors.map((c) => c.name).join(", ")} · ${s.totalViews}`,
    })),
  };
}

export default function Brain() {
  const [queryName, setQueryName] = useState("Weekly Story Hunt");
  const [editingName, setEditingName] = useState(false);
  const [sections, setSections] = useState<QuerySections>(buildInitialSections);
  const [savedQueries, setSavedQueries] = useState<{ name: string; sections: QuerySections }[]>([]);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [loadMenuOpen, setLoadMenuOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  const updateSection = (key: keyof QuerySections) => (items: SectionItem[]) => {
    setSections((prev) => ({ ...prev, [key]: items }));
  };

  const handleReset = () => {
    setSections(buildInitialSections());
    setQueryName("Weekly Story Hunt");
    toast.success("Query reset to defaults");
  };

  const handleSave = () => {
    const name = saveName.trim() || queryName;
    setSavedQueries((prev) => [...prev, { name, sections: JSON.parse(JSON.stringify(sections)) }]);
    toast.success(`Query "${name}" saved`);
    setSaveName("");
    setSaveMenuOpen(false);
  };

  const handleLoad = (saved: { name: string; sections: QuerySections }) => {
    setSections(JSON.parse(JSON.stringify(saved.sections)));
    setQueryName(saved.name);
    setLoadMenuOpen(false);
    toast.success(`Loaded "${saved.name}"`);
  };

  const totalEnabled = Object.values(sections).reduce(
    (sum, items) => sum + items.filter((i) => i.enabled).length, 0
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-border shrink-0 max-lg:px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold">Channel Brain</h1>
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] text-dim font-mono">Query Builder</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => { setSaveMenuOpen(!saveMenuOpen); setLoadMenuOpen(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] text-dim font-medium hover:text-sensor transition-colors"
            >
              <Save className="w-3 h-3" /> Save
            </button>
            {saveMenuOpen && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-elevated border border-border rounded-lg shadow-xl p-3 min-w-[220px]">
                <input type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)}
                  placeholder={queryName} className="w-full px-3 py-2 text-[11px] font-mono bg-surface border border-border rounded-lg text-foreground placeholder:text-dim/50 outline-none mb-2"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()} />
                <button onClick={handleSave} className="w-full px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold">
                  Save Query
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => { setLoadMenuOpen(!loadMenuOpen); setSaveMenuOpen(false); }}
              disabled={savedQueries.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] text-dim font-medium hover:text-sensor transition-colors disabled:opacity-30"
            >
              <FolderOpen className="w-3 h-3" /> Load ({savedQueries.length})
            </button>
            {loadMenuOpen && savedQueries.length > 0 && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-elevated border border-border rounded-lg shadow-xl min-w-[200px] py-1">
                {savedQueries.map((sq, i) => (
                  <button key={i} onClick={() => handleLoad(sq)} className="w-full text-left px-3 py-2 text-[11px] font-mono text-dim hover:text-foreground hover:bg-surface transition-colors">
                    {sq.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] text-dim font-medium hover:text-destructive transition-colors">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto">
        <div className="max-w-[960px] mx-auto px-6 max-lg:px-4 py-6 space-y-5">

          {/* === Single Query Box === */}
          <div className="rounded-xl border border-border bg-surface/30">
            {/* Query Name Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <BrainIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                {editingName ? (
                  <input
                    type="text"
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    onBlur={() => setEditingName(false)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                    autoFocus
                    className="text-[14px] font-semibold bg-transparent outline-none border-b border-primary text-foreground w-full"
                  />
                ) : (
                  <button onClick={() => setEditingName(true)} className="flex items-center gap-2 group">
                    <span className="text-[14px] font-semibold text-foreground">{queryName}</span>
                    <Pencil className="w-3 h-3 text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
                <div className="text-[10px] font-mono text-dim mt-0.5">
                  {totalEnabled} items active across 6 sections
                </div>
              </div>
            </div>

            {/* All Sections */}
            <div className="divide-y divide-border">
              <QuerySection id="base" number={1} title="Base" titleAr="الأساس"
                description="Channel niche, region, language, time range"
                icon={<Compass className="w-4 h-4" />} color="bg-blue/15"
                items={sections.base} onUpdate={updateSection("base")}
                addPlaceholder="Add base parameter..." />

              <QuerySection id="seekTopics" number={2} title="Seek Topics" titleAr="المواضيع المطلوبة"
                description="Stories and topics the AI should find"
                icon={<Search className="w-4 h-4" />} color="bg-success/15"
                items={sections.seekTopics} onUpdate={updateSection("seekTopics")}
                addPlaceholder="Add topic to search for..." />

              <QuerySection id="memoryTier1" number={3} title="Memory Tier 1" titleAr="الذاكرة ١"
                description="Top performing videos — find similar stories"
                icon={<BrainIcon className="w-4 h-4" />} color="bg-purple/15"
                items={sections.memoryTier1} onUpdate={updateSection("memoryTier1")}
                addPlaceholder="Add reference video..." />

              <QuerySection id="memoryTier2" number={4} title="Memory Tier 2" titleAr="الذاكرة ٢"
                description="Refinement rules — filter and verify results"
                icon={<RefreshCw className="w-4 h-4" />} color="bg-orange/15"
                items={sections.memoryTier2} onUpdate={updateSection("memoryTier2")}
                addPlaceholder="Add refinement rule..." />

              <QuerySection id="inProduction" number={5} title="In Production" titleAr="قيد الإنتاج"
                description="Currently producing — avoid duplicating"
                icon={<Factory className="w-4 h-4" />} color="bg-primary/15"
                items={sections.inProduction} onUpdate={updateSection("inProduction")}
                addPlaceholder="Add production item..." />

              <QuerySection id="avoidList" number={6} title="Avoid List" titleAr="قائمة التجنب"
                description="Competitor-covered stories to exclude"
                icon={<ShieldOff className="w-4 h-4" />} color="bg-destructive/15"
                items={sections.avoidList} onUpdate={updateSection("avoidList")}
                addPlaceholder="Add story to avoid..." />
            </div>
          </div>

          {/* Generated Preview */}
          <QueryPreview sections={sections} />

          <div className="text-[11px] text-dim font-mono text-center pb-4">
            All 6 sections must have active items · Query is sent to AI for story discovery
          </div>
        </div>
      </div>
    </div>
  );
}
