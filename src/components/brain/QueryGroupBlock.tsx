import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import QueryParameterBlock, { type QueryParameter, type ParameterType, PARAMETER_CONFIG } from "./QueryParameterBlock";

export interface QueryGroup {
  id: string;
  logic: "AND" | "OR";
  parameters: QueryParameter[];
  groups: QueryGroup[];
}

const ADDABLE_PARAMS: { type: ParameterType; label: string }[] = [
  { type: "topic", label: "Topic" },
  { type: "region", label: "Region" },
  { type: "time_range", label: "Time Range" },
  { type: "story_type", label: "Story Type" },
  { type: "competitor_filter", label: "Competitor Filter" },
  { type: "min_views", label: "Min Views" },
  { type: "language", label: "Language" },
  { type: "sentiment", label: "Sentiment" },
  { type: "source_type", label: "Source Type" },
  { type: "custom", label: "Custom" },
];

interface Props {
  group: QueryGroup;
  onUpdate: (group: QueryGroup) => void;
  onRemove?: (id: string) => void;
  depth?: number;
}

export default function QueryGroupBlock({ group, onUpdate, onRemove, depth = 0 }: Props) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const addParameter = (type: ParameterType) => {
    const config = PARAMETER_CONFIG[type];
    const newParam: QueryParameter = {
      id: crypto.randomUUID(),
      type,
      operator: config.operators[0],
      value: "",
    };
    onUpdate({ ...group, parameters: [...group.parameters, newParam] });
    setAddMenuOpen(false);
  };

  const addSubGroup = () => {
    const newGroup: QueryGroup = {
      id: crypto.randomUUID(),
      logic: group.logic === "AND" ? "OR" : "AND",
      parameters: [],
      groups: [],
    };
    onUpdate({ ...group, groups: [...group.groups, newGroup] });
    setAddMenuOpen(false);
  };

  const updateParameter = (param: QueryParameter) => {
    onUpdate({
      ...group,
      parameters: group.parameters.map((p) => (p.id === param.id ? param : p)),
    });
  };

  const removeParameter = (id: string) => {
    onUpdate({ ...group, parameters: group.parameters.filter((p) => p.id !== id) });
  };

  const updateSubGroup = (subGroup: QueryGroup) => {
    onUpdate({
      ...group,
      groups: group.groups.map((g) => (g.id === subGroup.id ? subGroup : g)),
    });
  };

  const removeSubGroup = (id: string) => {
    onUpdate({ ...group, groups: group.groups.filter((g) => g.id !== id) });
  };

  const toggleLogic = () => {
    onUpdate({ ...group, logic: group.logic === "AND" ? "OR" : "AND" });
  };

  const borderColor = depth === 0 ? "border-border" : depth === 1 ? "border-blue/20" : "border-purple/20";
  const bgColor = depth === 0 ? "bg-background" : depth === 1 ? "bg-blue/[0.03]" : "bg-purple/[0.03]";

  const allItems = [
    ...group.parameters.map((p) => ({ kind: "param" as const, item: p })),
    ...group.groups.map((g) => ({ kind: "group" as const, item: g })),
  ];

  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {depth > 0 && (
            <span className="text-[9px] font-mono text-dim uppercase tracking-wider">Sub-group</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRemove && (
            <button
              onClick={() => onRemove(group.id)}
              className="p-1.5 rounded-lg text-dim hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Parameters and sub-groups */}
      <div className="space-y-0">
        {allItems.map((entry, index) => (
          <div key={entry.kind === "param" ? entry.item.id : entry.item.id}>
            {entry.kind === "param" ? (
              <QueryParameterBlock
                parameter={entry.item as QueryParameter}
                onUpdate={updateParameter}
                onRemove={removeParameter}
              />
            ) : (
              <QueryGroupBlock
                group={entry.item as QueryGroup}
                onUpdate={updateSubGroup}
                onRemove={removeSubGroup}
                depth={depth + 1}
              />
            )}
            {/* Logic connector between items */}
            {index < allItems.length - 1 && (
              <div className="flex items-center gap-2 py-1.5 px-2">
                <div className="flex-1 h-px bg-border" />
                <button
                  onClick={toggleLogic}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                    group.logic === "AND"
                      ? "bg-blue/15 text-blue hover:bg-blue/25"
                      : "bg-orange/15 text-orange hover:bg-orange/25"
                  }`}
                >
                  {group.logic}
                </button>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add parameter button */}
      <div className="relative mt-3">
        <button
          onClick={() => setAddMenuOpen(!addMenuOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-dim/20 text-[11px] text-dim font-mono hover:text-sensor hover:border-dim/40 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Parameter
          <ChevronDown className="w-3 h-3" />
        </button>
        {addMenuOpen && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-elevated border border-border rounded-lg shadow-xl min-w-[200px] py-1">
            {ADDABLE_PARAMS.map((p) => (
              <button
                key={p.type}
                onClick={() => addParameter(p.type)}
                className="w-full text-left px-3 py-2 text-[11px] font-mono text-dim hover:text-foreground hover:bg-surface transition-colors flex items-center gap-2"
              >
                <span className={`w-2 h-2 rounded-full ${PARAMETER_CONFIG[p.type].color.split(" ")[0]}`} />
                {p.label}
              </button>
            ))}
            <div className="border-t border-border my-1" />
            <button
              onClick={addSubGroup}
              className="w-full text-left px-3 py-2 text-[11px] font-mono text-dim hover:text-foreground hover:bg-surface transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              Add Sub-group ({group.logic === "AND" ? "OR" : "AND"})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
