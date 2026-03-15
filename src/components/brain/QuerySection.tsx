import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, X, Check, AlertCircle } from "lucide-react";

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
  description: string;
  icon: React.ReactNode;
  color: string;
  items: SectionItem[];
  onUpdate: (items: SectionItem[]) => void;
  required?: boolean;
  allowAdd?: boolean;
  addPlaceholder?: string;
}

export default function QuerySection({
  id,
  number,
  title,
  titleAr,
  description,
  icon,
  color,
  items,
  onUpdate,
  required = true,
  allowAdd = true,
  addPlaceholder = "Add item...",
}: Props) {
  const [expanded, setExpanded] = useState(true);
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
    const newItem: SectionItem = {
      id: crypto.randomUUID(),
      text: addingText.trim(),
      enabled: true,
      source: "manual",
    };
    onUpdate([...items, newItem]);
    setAddingText("");
  };

  return (
    <div className={`rounded-xl border transition-all ${isFilled ? "border-border bg-background" : "border-destructive/30 bg-destructive/[0.03]"}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
      >
        {/* Number badge */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold shrink-0 ${
          isFilled ? `${color} text-foreground` : "bg-destructive/15 text-destructive"
        }`}>
          {number}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-foreground">{title}</span>
            <span className="text-[10px] font-mono text-dim">{titleAr}</span>
          </div>
          <div className="text-[10px] text-dim font-mono mt-0.5">{description}</div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 shrink-0">
          {isFilled ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-mono">
              <Check className="w-3 h-3" />
              {enabledCount} active
            </span>
          ) : required ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/15 text-destructive text-[10px] font-mono">
              <AlertCircle className="w-3 h-3" />
              Required
            </span>
          ) : (
            <span className="text-[10px] font-mono text-dim">Optional</span>
          )}
          {expanded ? <ChevronDown className="w-4 h-4 text-dim" /> : <ChevronRight className="w-4 h-4 text-dim" />}
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-4 border-t border-border">
          {/* Items */}
          <div className="space-y-1.5 mt-3">
            {items.length === 0 && (
              <div className="text-[11px] text-dim font-mono text-center py-4">
                No items yet — add items below
              </div>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-2.5 px-3 py-2 rounded-lg transition-all ${
                  item.enabled ? "bg-surface" : "bg-transparent opacity-40"
                }`}
              >
                {/* Toggle */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    item.enabled ? "bg-primary border-primary" : "border-dim/30"
                  }`}
                >
                  {item.enabled && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono text-foreground leading-relaxed" dir="rtl">
                    {item.text}
                  </div>
                  {item.meta && (
                    <div className="text-[9px] font-mono text-dim mt-0.5">{item.meta}</div>
                  )}
                </div>

                {/* Source badge */}
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ${
                  item.source === "auto" ? "bg-blue/10 text-blue" : "bg-orange/10 text-orange"
                }`}>
                  {item.source === "auto" ? "AUTO" : "MANUAL"}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-0.5 text-dim hover:text-destructive transition-colors shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add */}
          {allowAdd && (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                value={addingText}
                onChange={(e) => setAddingText(e.target.value)}
                placeholder={addPlaceholder}
                className="flex-1 px-3 py-2 text-[11px] font-mono bg-surface border border-border rounded-lg text-foreground placeholder:text-dim/40 outline-none"
                dir="rtl"
                onKeyDown={(e) => e.key === "Enter" && addItem()}
              />
              <button
                onClick={addItem}
                disabled={!addingText.trim()}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-dashed border-dim/20 text-[11px] text-dim font-mono hover:text-sensor hover:border-dim/40 transition-colors disabled:opacity-30"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
