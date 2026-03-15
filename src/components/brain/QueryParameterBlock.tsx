import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, GripVertical } from "lucide-react";

export type ParameterType =
  | "topic"
  | "region"
  | "time_range"
  | "story_type"
  | "competitor_filter"
  | "min_views"
  | "language"
  | "sentiment"
  | "source_type"
  | "custom";

export interface QueryParameter {
  id: string;
  type: ParameterType;
  operator: string;
  value: string;
  values?: string[];
}

const PARAMETER_CONFIG: Record<
  ParameterType,
  {
    label: string;
    color: string;
    operators: string[];
    presets?: string[];
    inputType: "select" | "text" | "number" | "multi-select";
  }
> = {
  topic: {
    label: "Topic",
    color: "bg-blue/20 border-blue/30 text-blue",
    operators: ["contains", "equals", "not_contains"],
    presets: ["جريمة حقيقية", "هروب من سجن", "سرقة بنك", "قضايا مخدرات", "اغتيال", "تحقيق جنائي", "اختفاء", "مافيا"],
    inputType: "select",
  },
  region: {
    label: "Region",
    color: "bg-purple/20 border-purple/30 text-purple",
    operators: ["is", "is_not"],
    presets: ["السعودية", "الخليج", "مصر", "العراق", "سوريا", "أمريكا اللاتينية", "أوروبا", "أمريكا"],
    inputType: "select",
  },
  time_range: {
    label: "Time Range",
    color: "bg-success/20 border-success/30 text-success",
    operators: ["last", "before", "between"],
    presets: ["7 days", "14 days", "30 days", "60 days", "90 days"],
    inputType: "select",
  },
  story_type: {
    label: "Story Type",
    color: "bg-orange/20 border-orange/30 text-orange",
    operators: ["is", "is_not"],
    presets: ["قضية حقيقية", "حدث تاريخي", "عملية عسكرية", "جريمة منظمة", "فضيحة سياسية", "قضية اجتماعية"],
    inputType: "select",
  },
  competitor_filter: {
    label: "Competitor Filter",
    color: "bg-destructive/20 border-destructive/30 text-destructive",
    operators: ["not_covered_by", "covered_by", "exclude_all"],
    presets: ["Badr Al-Alawi", "Abulsadiq", "Walid Qasas", "Abu Talal", "SUL CASES"],
    inputType: "multi-select",
  },
  min_views: {
    label: "Min Views Potential",
    color: "bg-blue/20 border-blue/30 text-blue",
    operators: ["greater_than", "less_than"],
    presets: ["100K", "500K", "1M", "5M", "10M"],
    inputType: "select",
  },
  language: {
    label: "Language",
    color: "bg-purple/20 border-purple/30 text-purple",
    operators: ["is", "is_not"],
    presets: ["العربية", "English", "Español", "Français"],
    inputType: "select",
  },
  sentiment: {
    label: "Sentiment",
    color: "bg-orange/20 border-orange/30 text-orange",
    operators: ["is"],
    presets: ["dramatic", "shocking", "mysterious", "inspirational", "controversial"],
    inputType: "select",
  },
  source_type: {
    label: "Source Type",
    color: "bg-success/20 border-success/30 text-success",
    operators: ["is", "is_not"],
    presets: ["أخبار", "محاكم", "تقارير أمنية", "وثائقيات", "شهادات"],
    inputType: "select",
  },
  custom: {
    label: "Custom",
    color: "bg-sensor/20 border-sensor/30 text-sensor",
    operators: ["contains", "equals", "not_contains"],
    presets: [],
    inputType: "text",
  },
};

const OPERATOR_LABELS: Record<string, string> = {
  contains: "contains",
  equals: "equals",
  not_contains: "NOT contains",
  is: "is",
  is_not: "is NOT",
  not_covered_by: "NOT covered by",
  covered_by: "covered by",
  exclude_all: "exclude ALL",
  last: "last",
  before: "before",
  between: "between",
  greater_than: ">",
  less_than: "<",
};

interface Props {
  parameter: QueryParameter;
  onUpdate: (param: QueryParameter) => void;
  onRemove: (id: string) => void;
}

export default function QueryParameterBlock({ parameter, onUpdate, onRemove }: Props) {
  const [operatorOpen, setOperatorOpen] = useState(false);
  const [valueOpen, setValueOpen] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const config = PARAMETER_CONFIG[parameter.type];

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (blockRef.current && !blockRef.current.contains(e.target as Node)) {
        setOperatorOpen(false);
        setValueOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const selectedValues = parameter.values || (parameter.value ? [parameter.value] : []);

  return (
    <div ref={blockRef} className={`flex items-center gap-0 rounded-lg border ${config.color} overflow-hidden group`}>
      {/* Drag handle */}
      <div className="px-2 py-3 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab">
        <GripVertical className="w-3 h-3" />
      </div>

      {/* Parameter name */}
      <div className="px-3 py-2.5 text-[11px] font-mono font-bold uppercase tracking-wider border-r border-current/10 shrink-0">
        {config.label}
      </div>

      {/* Operator dropdown */}
      <div className="relative">
        <button
          onClick={() => { setOperatorOpen(!operatorOpen); setValueOpen(false); }}
          className="flex items-center gap-1 px-3 py-2.5 text-[11px] font-mono border-r border-current/10 hover:bg-current/5 transition-colors"
        >
          {OPERATOR_LABELS[parameter.operator] || parameter.operator}
          <ChevronDown className="w-3 h-3" />
        </button>
        {operatorOpen && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-elevated border border-border rounded-lg shadow-xl min-w-[140px] py-1">
            {config.operators.map((op) => (
              <button
                key={op}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate({ ...parameter, operator: op });
                  setOperatorOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-[11px] font-mono hover:bg-surface transition-colors ${
                  parameter.operator === op ? "text-foreground font-semibold" : "text-dim"
                }`}
              >
                {OPERATOR_LABELS[op]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="relative flex-1">
        {config.inputType === "text" ? (
          <input
            type="text"
            value={parameter.value}
            onChange={(e) => onUpdate({ ...parameter, value: e.target.value })}
            placeholder="Enter value..."
            className="w-full px-3 py-2.5 text-[11px] font-mono bg-transparent text-foreground placeholder:text-dim/50 outline-none min-w-[160px]"
          />
        ) : config.inputType === "multi-select" ? (
          <div>
            <button
              onClick={() => { setValueOpen(!valueOpen); setOperatorOpen(false); }}
              className="flex items-center gap-1 px-3 py-2.5 text-[11px] font-mono hover:bg-current/5 transition-colors w-full"
            >
              <span className="flex-1 text-right truncate">
                {selectedValues.length > 0 ? selectedValues.join(", ") : "Select..."}
              </span>
              <ChevronDown className="w-3 h-3 shrink-0" />
            </button>
            {valueOpen && config.presets && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-elevated border border-border rounded-lg shadow-xl min-w-[180px] py-1">
                {config.presets.map((preset) => {
                  const isSelected = selectedValues.includes(preset);
                  return (
                    <button
                      key={preset}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newValues = isSelected
                          ? selectedValues.filter((v) => v !== preset)
                          : [...selectedValues, preset];
                        onUpdate({ ...parameter, values: newValues, value: newValues.join(", ") });
                      }}
                      className={`w-full text-right px-3 py-1.5 text-[11px] font-mono hover:bg-surface transition-colors flex items-center gap-2 ${
                        isSelected ? "text-foreground font-semibold" : "text-dim"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-primary border-primary" : "border-dim/30"
                      }`}>
                        {isSelected && <span className="text-[8px] text-primary-foreground">✓</span>}
                      </span>
                      <span className="flex-1 text-right">{preset}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => { setValueOpen(!valueOpen); setOperatorOpen(false); }}
              className="flex items-center gap-1 px-3 py-2.5 text-[11px] font-mono hover:bg-current/5 transition-colors w-full"
            >
              <span className="flex-1 text-right truncate">
                {parameter.value || "Select..."}
              </span>
              <ChevronDown className="w-3 h-3 shrink-0" />
            </button>
            {valueOpen && config.presets && (
              <div className="absolute top-full right-0 mt-1 z-50 bg-elevated border border-border rounded-lg shadow-xl min-w-[180px] py-1 max-h-[200px] overflow-y-auto">
                {config.presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate({ ...parameter, value: preset });
                      setValueOpen(false);
                    }}
                    className={`w-full text-right px-3 py-1.5 text-[11px] font-mono hover:bg-surface transition-colors ${
                      parameter.value === preset ? "text-foreground font-semibold" : "text-dim"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
                {/* Custom input at bottom */}
                <div className="border-t border-border mt-1 pt-1 px-2 pb-1">
                  <input
                    type="text"
                    placeholder="Custom value..."
                    className="w-full px-2 py-1 text-[11px] font-mono bg-surface rounded text-foreground placeholder:text-dim/50 outline-none text-right"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                        onUpdate({ ...parameter, value: (e.target as HTMLInputElement).value });
                        setValueOpen(false);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(parameter.id)}
        className="px-2.5 py-2.5 text-current/40 hover:text-destructive transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export { PARAMETER_CONFIG, OPERATOR_LABELS };
export type { ParameterType as ParamType };
