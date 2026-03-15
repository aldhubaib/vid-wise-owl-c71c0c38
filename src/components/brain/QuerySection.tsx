import { useState, useRef, useEffect } from "react";
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
  const [editorText, setEditorText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const enabledCount = items.filter((i) => i.enabled).length;
  const isFilled = enabledCount > 0 || editorText.trim().length > 0;

  // Sync items to editor text on first expand
  useEffect(() => {
    if (expanded && !editorText && items.length > 0) {
      setEditorText(items.map((i) => i.text).join("\n"));
    }
  }, [expanded]);

  const fields = SECTION_FIELDS[id] || [];

  const insertField = (label: string) => {
    const insertion = `[${label}] `;
    if (textareaRef.current) {
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newText = editorText.substring(0, start) + insertion + editorText.substring(end);
      setEditorText(newText);
      // Refocus and set cursor
      setTimeout(() => {
        ta.focus();
        ta.selectionStart = ta.selectionEnd = start + insertion.length;
      }, 0);
    } else {
      setEditorText((prev) => prev + insertion);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const trimmed = editorText.trim();

    // Validate: must not be empty
    if (!trimmed) {
      toast.error(`${title} section is empty — add content before saving.`);
      return;
    }

    // Validate: check for empty field placeholders like [Topic] with no value
    const emptyFields = trimmed.match(/\[[^\]]+\]\s*(?=\[|$|\n)/g);
    if (emptyFields) {
      toast.error(`Fill in the field values — found empty placeholders: ${emptyFields.slice(0, 3).join(", ")}`);
      return;
    }

    // Parse editor text into items
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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-mono">
              <Check className="w-3 h-3" />
              {enabledCount}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/15 text-destructive text-[10px] font-mono">
              <AlertCircle className="w-3 h-3" />
              Empty
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
              {/* Text editor */}
              <div className="p-4 border-b border-border">
                <textarea
                  ref={textareaRef}
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={`Write your ${title.toLowerCase()} query here... Use fields below to insert parameters.`}
                  className="w-full min-h-[100px] px-3 py-2.5 text-[12px] font-mono bg-surface border border-border rounded-lg text-foreground placeholder:text-dim/40 outline-none focus:border-blue/50 transition-colors resize-y"
                  dir="rtl"
                />
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
                  Click a field to insert · Write freely in the editor
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
