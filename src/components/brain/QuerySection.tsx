import { useState, useRef, useEffect } from "react";
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
  suggestions?: string[];
}

export default function QuerySection({
  number,
  title,
  titleAr,
  color,
  items,
  onUpdate,
  addPlaceholder = "Type to add...",
  suggestions = [],
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const enabledCount = items.filter((i) => i.enabled).length;
  const isFilled = enabledCount > 0;

  const toggleItem = (id: string) => {
    onUpdate(items.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i)));
  };

  const removeItem = (id: string) => {
    onUpdate(items.filter((i) => i.id !== id));
  };

  const addItem = (text: string) => {
    if (!text.trim()) return;
    onUpdate([...items, { id: crypto.randomUUID(), text: text.trim(), enabled: true, source: "manual" }]);
    setInputValue("");
    setShowSuggestions(false);
  };

  // Filter suggestions based on input
  const filtered = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !items.some((i) => i.text === s)
  );

  // Show suggestions when input is focused and has matching items
  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  // Close suggestions on outside click
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
            <div ref={containerRef} className="rounded-xl border border-border bg-background overflow-hidden">
              {/* Editor header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-elevated/30">
                <span className="text-[10px] font-mono text-dim uppercase tracking-widest">{title} Editor</span>
                <span className="text-[10px] font-mono text-dim">{enabledCount} of {items.length} active</span>
              </div>

              {/* Formula bar — input with pills */}
              <div className="px-4 py-3 border-b border-border">
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {items.filter((i) => i.enabled).map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/15 text-primary text-[11px] font-mono"
                    >
                      {item.text}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
                    onFocus={handleInputFocus}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={addPlaceholder}
                    className="w-full px-3 py-2 text-[12px] font-mono bg-surface border border-border rounded-lg text-foreground placeholder:text-dim/40 outline-none focus:border-blue/50 transition-colors"
                    dir="rtl"
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Enter" && inputValue.trim()) addItem(inputValue);
                    }}
                  />
                </div>
              </div>

              {/* Suggestions + Items split view */}
              <div className="flex min-h-[120px] max-h-[280px]">
                {/* Suggestions panel */}
                {showSuggestions && filtered.length > 0 && (
                  <div className="w-[240px] border-r border-border overflow-y-auto bg-elevated/20">
                    {filtered.map((s) => (
                      <button
                        key={s}
                        onClick={(e) => { e.stopPropagation(); addItem(s); }}
                        className="w-full text-right px-3 py-2 text-[11px] font-mono text-dim hover:text-foreground hover:bg-surface transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3 text-blue shrink-0" />
                        <span className="flex-1 text-right truncate">{s}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Items list */}
                <div className="flex-1 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="text-[11px] text-dim font-mono text-center py-8">
                      Type above or pick from suggestions to add items
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 px-4 py-2.5 transition-all ${
                            item.enabled ? "" : "opacity-35"
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
                          <button
                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                            className="p-0.5 text-dim hover:text-destructive transition-colors shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer with save */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-elevated/30">
                <span className="text-[9px] font-mono text-dim">
                  Press Enter to add · Click suggestions to insert
                </span>
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
