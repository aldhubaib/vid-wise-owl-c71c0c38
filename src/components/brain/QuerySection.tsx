import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, X, Check, AlertCircle, Save } from "lucide-react";
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
}

export default function QuerySection({
  number,
  title,
  titleAr,
  color,
  items,
  onUpdate,
  allowAdd = true,
  addPlaceholder = "Add item...",
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [addingText, setAddingText] = useState("");

  const enabledCount = items.filter((i) => i.enabled).length;
  const isFilled = enabledCount > 0;

  const toggleItem = (id: string) => {
    onUpdate(items.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i)));
  };

  const removeItem = (id: string) => {
    onUpdate(items.filter((i) => i.id !== id));
  };

  const addItem = () => {
    if (!addingText.trim()) return;
    onUpdate([...items, { id: crypto.randomUUID(), text: addingText.trim(), enabled: true, source: "manual" }]);
    setAddingText("");
  };

  return (
    <>
      {/* Table row */}
      <tr
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer hover:bg-elevated/50 transition-colors group"
      >
        {/* # */}
        <td className="px-4 py-3 w-10">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
            isFilled ? `${color} text-foreground` : "bg-destructive/15 text-destructive"
          }`}>
            {number}
          </div>
        </td>
        {/* Section name */}
        <td className="py-3 pr-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-foreground">{title}</span>
            <span className="text-[10px] font-mono text-dim">{titleAr}</span>
          </div>
        </td>
        {/* Items count */}
        <td className="py-3 px-3 text-right">
          <span className="text-[11px] font-mono text-dim">{items.length} items</span>
        </td>
        {/* Status */}
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
        {/* Chevron */}
        <td className="py-3 px-4 w-8">
          {expanded ? <ChevronDown className="w-4 h-4 text-dim" /> : <ChevronRight className="w-4 h-4 text-dim" />}
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr>
          <td colSpan={5} className="px-4 pb-4 pt-0">
            <div className="bg-elevated/50 rounded-lg border border-border p-3">
              {/* Items list */}
              <div className="space-y-1">
                {items.length === 0 && (
                  <div className="text-[11px] text-dim font-mono text-center py-3">No items yet</div>
                )}
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                      item.enabled ? "bg-surface" : "bg-transparent opacity-40"
                    }`}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        item.enabled ? "bg-primary border-primary" : "border-dim/30"
                      }`}
                    >
                      {item.enabled && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                    </button>
                    <div className="flex-1 min-w-0 text-[11px] font-mono text-foreground truncate" dir="rtl">
                      {item.text}
                    </div>
                    {item.meta && (
                      <span className="text-[9px] font-mono text-dim shrink-0">{item.meta}</span>
                    )}
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ${
                      item.source === "auto" ? "bg-blue/10 text-blue" : "bg-orange/10 text-orange"
                    }`}>
                      {item.source === "auto" ? "AUTO" : "MANUAL"}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                      className="p-0.5 text-dim hover:text-destructive transition-colors shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add input */}
              {allowAdd && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={addingText}
                    onChange={(e) => setAddingText(e.target.value)}
                    placeholder={addPlaceholder}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 px-3 py-1.5 text-[11px] font-mono bg-surface border border-border rounded-lg text-foreground placeholder:text-dim/40 outline-none"
                    dir="rtl"
                    onKeyDown={(e) => { e.stopPropagation(); if (e.key === "Enter") addItem(); }}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); addItem(); }}
                    disabled={!addingText.trim()}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-dim/20 text-[10px] text-dim font-mono hover:text-sensor transition-colors disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
              )}

              {/* Save button */}
              <div className="flex justify-end mt-2">
                <button
                  onClick={(e) => { e.stopPropagation(); toast.success(`${title} section saved`); }}
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
