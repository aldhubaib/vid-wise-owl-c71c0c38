import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, Check, AlertCircle, Save } from "lucide-react";
import { toast } from "sonner";

export interface SectionItem {
  id: string;
  text: string;
  enabled: boolean;
  source: "auto" | "manual";
  meta?: string;
}

export interface SectionData {
  id: string;
  items: SectionItem[];
}

// Available fields the user can insert into the editor
const SECTION_FIELDS: Record<string, { label: string; description: string }[]> = {
  base: [
    { label: "Channel Niche", description: "The main topic/niche of the channel" },
    { label: "Region", description: "Geographic region to search in" },
    { label: "Language", description: "Content language filter" },
    { label: "Time Range", description: "How far back to search" },
    { label: "Result Count", description: "Maximum number of stories" },
    { label: "Source Type", description: "News, courts, reports, etc." },
  ],
  seekTopics: [
    { label: "Topic", description: "A topic keyword to search for" },
    { label: "Story Type", description: "Crime, historical, political, etc." },
    { label: "Sentiment", description: "Dramatic, shocking, mysterious, etc." },
    { label: "Keyword", description: "Specific keyword to include" },
    { label: "Trend", description: "Currently trending topic" },
    { label: "Untouched Story", description: "Reference an untouched story" },
  ],
  memoryTier1: [
    { label: "Top Video", description: "A top performing video to find similar" },
    { label: "Gap Win", description: "A video that was a gap win" },
    { label: "High Views", description: "Video with high view count" },
    { label: "Engagement", description: "Video with high engagement rate" },
    { label: "Format", description: "Short or long format preference" },
  ],
  memoryTier2: [
    { label: "Competitor Check", description: "Verify competitors haven't covered" },
    { label: "Source Verify", description: "Ensure reliable sources exist" },
    { label: "Sentiment Filter", description: "Filter by story tone" },
    { label: "Freshness", description: "Prioritize recent stories" },
    { label: "Exclusivity", description: "Prioritize exclusive stories" },
    { label: "Custom Rule", description: "Custom refinement instruction" },
  ],
  inProduction: [
    { label: "Story Title", description: "Title of story in production" },
    { label: "Stage", description: "Current production stage" },
    { label: "Channel", description: "Which channel it's for" },
    { label: "Format", description: "Short or long format" },
  ],
  avoidList: [
    { label: "Competitor Story", description: "A story covered by competitors" },
    { label: "Competitor Name", description: "Exclude a specific competitor's topics" },
    { label: "Topic", description: "Topic to explicitly avoid" },
    { label: "Keyword", description: "Keyword to exclude" },
    { label: "Old Story", description: "Previously covered story" },
  ],
};

interface Props {
  id: string;
  number: number;
  title: string;
  titleAr: string;
  color: string;
  items: SectionItem[];
  onUpdate: (items: SectionItem[]) => void;
  allowAdd?: boolean;
  addPlaceholder?: string;
  suggestions?: string[];
}

export default function QuerySection({
  id,
  number,
  title,
  titleAr,
  color,
  items,
  onUpdate,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  const enabledCount = items.filter((i) => i.enabled).length;

  const [editorText, setEditorText] = useState(() => items.map(i => i.text).join("\n"));

  const isFilled = enabledCount > 0 || editorText.trim().length > 0;

  const fields = SECTION_FIELDS[id] || [];

  const insertField = (label: string) => {
    setEditorText(prev => prev + `[${label}] `);
  };

  const getEditorText = (): string => editorText;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const trimmed = getEditorText().trim();

    if (!trimmed) {
      toast.error(`${title} section is empty — add content before saving.`);
      return;
    }

    const emptyFields = trimmed.match(/\[[^\]]+\]\s*(?=\[|$|\n)/g);
    if (emptyFields) {
      toast.error(`Fill in the field values — found empty placeholders: ${emptyFields.slice(0, 3).join(", ")}`);
      return;
    }

    const lines = trimmed.split("\n").filter((l) => l.trim());
    const newItems: SectionItem[] = lines.map((line) => ({
      id: crypto.randomUUID(),
      text: line.trim(),
      enabled: true,
      source: "manual" as const,
    }));
    onUpdate(newItems);
    toast.success(`${title} section saved`);
  };

  useEffect(() => {
    if (expanded) {
      setEditorReady(true);
    }
  }, [expanded]);

  return (
    <>
      {/* Table row */}
      <tr
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer hover:bg-elevated/50 transition-colors group"
      >
        <td className="px-4 py-3 w-10">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
            isFilled ? `${color} text-foreground` : "bg-destructive/15 text-destructive"
          }`}>
            {number}
          </div>
        </td>
        <td className="py-3 pr-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-foreground">{title}</span>
            <span className="text-[10px] font-mono text-dim">{titleAr}</span>
          </div>
        </td>
        <td className="py-3 px-3 text-right">
          <span className="text-[11px] font-mono text-dim">{items.length} items</span>
        </td>
        <td className="py-3 px-3 text-right">
          {isFilled ? (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success/15 text-success">
              <Check className="w-3 h-3" />
            </span>
          ) : (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-destructive/15 text-destructive">
              <AlertCircle className="w-3 h-3" />
            </span>
          )}
        </td>
        <td className="py-3 px-4 w-8">
          {expanded ? <ChevronDown className="w-4 h-4 text-dim" /> : <ChevronRight className="w-4 h-4 text-dim" />}
        </td>
      </tr>

      {/* Expanded editor */}
      {expanded && (
        <tr>
          <td colSpan={5} className="px-4 pb-4 pt-1">
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              {/* BlockNote editor */}
              <div className="p-4 border-b border-border bn-container" onClick={(e) => e.stopPropagation()}>
                <div className="min-h-[150px] rounded-lg border border-border overflow-hidden bg-surface">
                  <BlockNoteView
                    editor={editor}
                    theme="dark"
                    data-theming-css-variables-demo
                  />
                </div>
              </div>

              {/* Available fields */}
              <div className="px-4 py-3">
                <div className="text-[9px] font-mono text-dim uppercase tracking-widest mb-2">Available Fields — click to insert</div>
                <div className="flex flex-wrap gap-1.5">
                  {fields.map((field) => (
                    <button
                      key={field.label}
                      onClick={(e) => { e.stopPropagation(); insertField(field.label); }}
                      className="group/field inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface border border-border text-[11px] font-mono text-sensor hover:text-foreground hover:border-blue/40 hover:bg-blue/5 transition-colors"
                      title={field.description}
                    >
                      <span className="text-blue text-[10px]">ƒ</span>
                      {field.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-elevated/30">
                <span className="text-[9px] font-mono text-dim">
                  Full rich-text editor · Click fields to insert · Use / for block commands
                </span>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue text-blue-foreground text-[10px] font-mono font-medium hover:opacity-90 transition-opacity"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
