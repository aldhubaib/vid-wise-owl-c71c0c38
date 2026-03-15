import { Zap, Shield, Eye, Flame } from "lucide-react";
import type { QueryGroup } from "./QueryGroupBlock";

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  group: QueryGroup;
}

const PRESETS: Preset[] = [
  {
    id: "gap_hunter",
    name: "Gap Hunter",
    description: "Find untouched stories not covered by any competitor",
    icon: <Flame className="w-4 h-4" />,
    color: "bg-success/10 border-success/20 text-success hover:bg-success/15",
    group: {
      id: "preset-gap",
      logic: "AND",
      parameters: [
        { id: "p1", type: "topic", operator: "contains", value: "جريمة حقيقية" },
        { id: "p2", type: "region", operator: "is", value: "السعودية" },
        { id: "p3", type: "time_range", operator: "last", value: "7 days" },
        { id: "p4", type: "competitor_filter", operator: "exclude_all", value: "all", values: ["Badr Al-Alawi", "Abulsadiq", "Walid Qasas", "Abu Talal", "SUL CASES"] },
      ],
      groups: [],
    },
  },
  {
    id: "viral_potential",
    name: "Viral Potential",
    description: "Stories with high view potential and dramatic sentiment",
    icon: <Eye className="w-4 h-4" />,
    color: "bg-blue/10 border-blue/20 text-blue hover:bg-blue/15",
    group: {
      id: "preset-viral",
      logic: "AND",
      parameters: [
        { id: "p1", type: "min_views", operator: "greater_than", value: "1M" },
        { id: "p2", type: "sentiment", operator: "is", value: "shocking" },
        { id: "p3", type: "time_range", operator: "last", value: "14 days" },
      ],
      groups: [],
    },
  },
  {
    id: "competitor_watch",
    name: "Competitor Watch",
    description: "See what competitors are covering to find patterns",
    icon: <Shield className="w-4 h-4" />,
    color: "bg-orange/10 border-orange/20 text-orange hover:bg-orange/15",
    group: {
      id: "preset-comp",
      logic: "AND",
      parameters: [
        { id: "p1", type: "competitor_filter", operator: "covered_by", value: "Badr Al-Alawi", values: ["Badr Al-Alawi"] },
        { id: "p2", type: "time_range", operator: "last", value: "30 days" },
        { id: "p3", type: "min_views", operator: "greater_than", value: "5M" },
      ],
      groups: [],
    },
  },
  {
    id: "quick_wins",
    name: "Quick Wins",
    description: "Fresh regional stories perfect for Shorts format",
    icon: <Zap className="w-4 h-4" />,
    color: "bg-purple/10 border-purple/20 text-purple hover:bg-purple/15",
    group: {
      id: "preset-quick",
      logic: "AND",
      parameters: [
        { id: "p1", type: "region", operator: "is", value: "الخليج" },
        { id: "p2", type: "time_range", operator: "last", value: "7 days" },
        { id: "p3", type: "story_type", operator: "is", value: "قضية اجتماعية" },
        { id: "p4", type: "competitor_filter", operator: "exclude_all", value: "all" },
      ],
      groups: [],
    },
  },
];

interface Props {
  onApply: (group: QueryGroup) => void;
}

export default function QueryPresets({ onApply }: Props) {
  return (
    <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-2">
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => {
            // Deep clone with new IDs
            const clone: QueryGroup = JSON.parse(JSON.stringify(preset.group));
            clone.id = crypto.randomUUID();
            clone.parameters = clone.parameters.map((p) => ({ ...p, id: crypto.randomUUID() }));
            onApply(clone);
          }}
          className={`flex items-start gap-3 p-3 rounded-xl border transition-colors text-left ${preset.color}`}
        >
          <div className="mt-0.5 shrink-0">{preset.icon}</div>
          <div>
            <div className="text-[12px] font-semibold">{preset.name}</div>
            <div className="text-[10px] opacity-70 font-mono mt-0.5">{preset.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
