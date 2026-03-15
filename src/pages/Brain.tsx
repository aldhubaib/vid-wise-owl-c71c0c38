import { useState } from "react";
import { RotateCcw, Save, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import QueryGroupBlock, { type QueryGroup } from "@/components/brain/QueryGroupBlock";
import QueryPreview from "@/components/brain/QueryPreview";
import QueryPresets from "@/components/brain/QueryPresets";

const DEFAULT_GROUP: QueryGroup = {
  id: "root",
  logic: "AND",
  parameters: [],
  groups: [],
};

export default function Brain() {
  const [queryGroup, setQueryGroup] = useState<QueryGroup>(DEFAULT_GROUP);
  const [savedQueries, setSavedQueries] = useState<{ name: string; group: QueryGroup }[]>([]);
  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const [loadMenuOpen, setLoadMenuOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  const handleReset = () => {
    setQueryGroup({ ...DEFAULT_GROUP, id: crypto.randomUUID(), parameters: [], groups: [] });
    toast.success("Query cleared");
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    setSavedQueries((prev) => [...prev, { name: saveName, group: JSON.parse(JSON.stringify(queryGroup)) }]);
    toast.success(`Query "${saveName}" saved`);
    setSaveName("");
    setSaveMenuOpen(false);
  };

  const handleLoad = (saved: { name: string; group: QueryGroup }) => {
    const clone: QueryGroup = JSON.parse(JSON.stringify(saved.group));
    clone.id = crypto.randomUUID();
    setQueryGroup(clone);
    setLoadMenuOpen(false);
    toast.success(`Loaded "${saved.name}"`);
  };

  const paramCount = countParams(queryGroup);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-border shrink-0 max-lg:px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold">Channel Brain</h1>
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] text-dim font-mono">Advanced Query Builder</span>
          {paramCount > 0 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              {paramCount} parameter{paramCount !== 1 ? "s" : ""}
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
        <div className="max-w-[960px] mx-auto px-6 max-lg:px-4 py-6 space-y-5">
          {/* Presets */}
          <div>
            <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">Quick Presets</div>
            <QueryPresets onApply={setQueryGroup} />
          </div>

          {/* Query Builder */}
          <div>
            <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">Query Builder</div>
            <QueryGroupBlock group={queryGroup} onUpdate={setQueryGroup} />
          </div>

          {/* Generated Preview */}
          <QueryPreview group={queryGroup} />

          {/* Footer */}
          <div className="text-[11px] text-dim font-mono text-center pb-4">
            Build your query visually · Send to AI for story discovery
          </div>
        </div>
      </div>
    </div>
  );
}

function countParams(group: QueryGroup): number {
  return group.parameters.length + group.groups.reduce((sum, g) => sum + countParams(g), 0);
}
