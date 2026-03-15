import { useState, useMemo } from "react";
import { RotateCcw, Save, FolderOpen, Compass, Search, Brain as BrainIcon, RefreshCw, Factory, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import QuerySection, { type SectionItem } from "@/components/brain/QuerySection";
import QueryPreview, { type QuerySections } from "@/components/brain/QueryPreview";
import { untouchedStories, publishedVideos, competitorStories, competitorChannels } from "@/data/brainMock";
import { storiesMock } from "@/data/storiesMock";

// Auto-populate from mock data
function buildInitialSections(): QuerySections {
  return {
    // Section 1 — Base: channel niche, region, time range
    base: [
      { id: "b1", text: "الجريمة والقضايا الحقيقية", enabled: true, source: "auto", meta: "Channel niche" },
      { id: "b2", text: "السعودية والخليج", enabled: true, source: "auto", meta: "Region" },
      { id: "b3", text: "آخر 7 أيام", enabled: true, source: "auto", meta: "Time range" },
      { id: "b4", text: "8 قصص كحد أقصى", enabled: true, source: "auto", meta: "Result count" },
      { id: "b5", text: "العربية", enabled: true, source: "auto", meta: "Language" },
    ],

    // Section 2 — Seek Topics: untouched stories to prioritize
    seekTopics: untouchedStories.map((s) => ({
      id: `seek-${s.id}`,
      text: s.title,
      enabled: true,
      source: "auto" as const,
      meta: `Open since ${s.date}`,
    })),

    // Section 3 — Memory Tier 1: top performing published videos (find similar)
    memoryTier1: publishedVideos
      .filter((v) => v.result === "gap_win")
      .map((v) => ({
        id: `mem1-${v.id}`,
        text: v.title,
        enabled: true,
        source: "auto" as const,
        meta: `${v.views} views · Gap Win`,
      })),

    // Section 4 — Memory Tier 2: refinement criteria
    memoryTier2: [
      { id: "mem2-1", text: "تأكد أن القصص لم يغطها أي من المنافسين", enabled: true, source: "auto", meta: "Competitor check" },
      { id: "mem2-2", text: "أولوية للقصص ذات الطابع الدرامي والمثير", enabled: true, source: "auto", meta: "Sentiment filter" },
      { id: "mem2-3", text: "تأكد من وجود مصادر موثوقة لكل قصة", enabled: true, source: "auto", meta: "Source verification" },
    ],

    // Section 5 — In Production: stories currently being worked on
    inProduction: storiesMock
      .filter((s) => ["approved", "filmed", "publish"].includes(s.stage))
      .map((s) => ({
        id: `prod-${s.id}`,
        text: s.title,
        enabled: true,
        source: "auto" as const,
        meta: `Stage: ${s.stage}`,
      })),

    // Section 6 — Avoid List: competitor stories already covered
    avoidList: competitorStories.slice(0, 6).map((s) => ({
      id: `avoid-${s.id}`,
      text: s.title,
      enabled: true,
      source: "auto" as const,
      meta: `${s.competitors.map((c) => c.name).join(", ")} · ${s.totalViews}`,
    })),
  };
}

export default function Brain() {
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
    toast.success("Query reset to defaults");
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    setSavedQueries((prev) => [...prev, { name: saveName, sections: JSON.parse(JSON.stringify(sections)) }]);
    toast.success(`Query "${saveName}" saved`);
    setSaveName("");
    setSaveMenuOpen(false);
  };

  const handleLoad = (saved: { name: string; sections: QuerySections }) => {
    setSections(JSON.parse(JSON.stringify(saved.sections)));
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
          {totalEnabled > 0 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              {totalEnabled} items active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Save */}
          <div className="relative">
            <button
              onClick={() => { setSaveMenuOpen(!saveMenuOpen); setLoadMenuOpen(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] text-dim font-medium hover:text-sensor transition-colors"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
            {saveMenuOpen && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-elevated border border-border rounded-lg shadow-xl p-3 min-w-[220px]">
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Query name..."
                  className="w-full px-3 py-2 text-[11px] font-mono bg-surface border border-border rounded-lg text-foreground placeholder:text-dim/50 outline-none mb-2"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <button
                  onClick={handleSave}
                  disabled={!saveName.trim()}
                  className="w-full px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold disabled:opacity-30"
                >
                  Save Query
                </button>
              </div>
            )}
          </div>

          {/* Load */}
          <div className="relative">
            <button
              onClick={() => { setLoadMenuOpen(!loadMenuOpen); setSaveMenuOpen(false); }}
              disabled={savedQueries.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] text-dim font-medium hover:text-sensor transition-colors disabled:opacity-30"
            >
              <FolderOpen className="w-3 h-3" />
              Load ({savedQueries.length})
            </button>
            {loadMenuOpen && savedQueries.length > 0 && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-elevated border border-border rounded-lg shadow-xl min-w-[200px] py-1">
                {savedQueries.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleLoad(sq)}
                    className="w-full text-left px-3 py-2 text-[11px] font-mono text-dim hover:text-foreground hover:bg-surface transition-colors"
                  >
                    {sq.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] text-dim font-medium hover:text-destructive transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto">
        <div className="max-w-[960px] mx-auto px-6 max-lg:px-4 py-6 space-y-3">
          {/* Section 1 — Base */}
          <QuerySection
            id="base"
            number={1}
            title="Base"
            titleAr="الأساس"
            description="Channel niche, region, language, time range — the foundation of your query"
            icon={<Compass className="w-4 h-4" />}
            color="bg-blue/15"
            items={sections.base}
            onUpdate={updateSection("base")}
            addPlaceholder="Add base parameter..."
          />

          {/* Section 2 — Seek Topics */}
          <QuerySection
            id="seekTopics"
            number={2}
            title="Seek Topics"
            titleAr="المواضيع المطلوبة"
            description="Stories and topics you want the AI to find — auto-filled from untouched stories"
            icon={<Search className="w-4 h-4" />}
            color="bg-success/15"
            items={sections.seekTopics}
            onUpdate={updateSection("seekTopics")}
            addPlaceholder="Add topic to search for..."
          />

          {/* Section 3 — Memory Tier 1 */}
          <QuerySection
            id="memoryTier1"
            number={3}
            title="Memory Tier 1"
            titleAr="الذاكرة — المستوى الأول"
            description="Top performing videos — AI finds similar stories in tone and type"
            icon={<BrainIcon className="w-4 h-4" />}
            color="bg-purple/15"
            items={sections.memoryTier1}
            onUpdate={updateSection("memoryTier1")}
            addPlaceholder="Add reference video..."
          />

          {/* Section 4 — Memory Tier 2 */}
          <QuerySection
            id="memoryTier2"
            number={4}
            title="Memory Tier 2"
            titleAr="الذاكرة — المستوى الثاني"
            description="Refinement criteria — results from Tier 1 are filtered through these rules"
            icon={<RefreshCw className="w-4 h-4" />}
            color="bg-orange/15"
            items={sections.memoryTier2}
            onUpdate={updateSection("memoryTier2")}
            addPlaceholder="Add refinement rule..."
          />

          {/* Section 5 — In Production */}
          <QuerySection
            id="inProduction"
            number={5}
            title="In Production"
            titleAr="قيد الإنتاج"
            description="Stories currently being produced — AI avoids suggesting duplicates"
            icon={<Factory className="w-4 h-4" />}
            color="bg-primary/15"
            items={sections.inProduction}
            onUpdate={updateSection("inProduction")}
            addPlaceholder="Add production item..."
          />

          {/* Section 6 — Avoid List */}
          <QuerySection
            id="avoidList"
            number={6}
            title="Avoid List"
            titleAr="قائمة التجنب"
            description="Competitor-covered stories — AI excludes anything similar to these"
            icon={<ShieldOff className="w-4 h-4" />}
            color="bg-destructive/15"
            items={sections.avoidList}
            onUpdate={updateSection("avoidList")}
            addPlaceholder="Add story to avoid..."
          />

          {/* Generated Preview */}
          <QueryPreview sections={sections} />

          {/* Footer */}
          <div className="text-[11px] text-dim font-mono text-center pb-4">
            All 6 sections must have active items · Query is sent to AI for story discovery
          </div>
        </div>
      </div>
    </div>
  );
}
