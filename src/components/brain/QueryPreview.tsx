import { useState } from "react";
import { Copy, Check, Wand2 } from "lucide-react";
import { toast } from "sonner";
import type { QueryGroup } from "./QueryGroupBlock";
import { PARAMETER_CONFIG, OPERATOR_LABELS } from "./QueryParameterBlock";

function buildQueryText(group: QueryGroup, depth = 0): string {
  const parts: string[] = [];

  for (const param of group.parameters) {
    const config = PARAMETER_CONFIG[param.type];
    const value = param.values?.length ? param.values.join("، ") : param.value;
    if (!value) continue;

    switch (param.type) {
      case "topic":
        if (param.operator === "not_contains") {
          parts.push(`تجنب القصص المتعلقة بـ: "${value}"`);
        } else {
          parts.push(`ابحث عن قصص تتعلق بـ: "${value}"`);
        }
        break;
      case "region":
        if (param.operator === "is_not") {
          parts.push(`استبعد القصص من: ${value}`);
        } else {
          parts.push(`المنطقة: ${value}`);
        }
        break;
      case "time_range":
        parts.push(`الفترة الزمنية: آخر ${value}`);
        break;
      case "story_type":
        if (param.operator === "is_not") {
          parts.push(`استبعد نوع: ${value}`);
        } else {
          parts.push(`نوع القصة: ${value}`);
        }
        break;
      case "competitor_filter":
        if (param.operator === "exclude_all") {
          parts.push(`تجنب تماماً أي قصص غطاها أي من المنافسين`);
        } else if (param.operator === "not_covered_by") {
          parts.push(`تجنب القصص التي غطاها: ${value}`);
        } else {
          parts.push(`القصص التي غطاها: ${value}`);
        }
        break;
      case "min_views":
        parts.push(`إمكانية المشاهدات: ${OPERATOR_LABELS[param.operator]} ${value}`);
        break;
      case "language":
        parts.push(`اللغة: ${value}`);
        break;
      case "sentiment":
        parts.push(`طابع القصة: ${value}`);
        break;
      case "source_type":
        if (param.operator === "is_not") {
          parts.push(`استبعد مصادر: ${value}`);
        } else {
          parts.push(`نوع المصدر: ${value}`);
        }
        break;
      case "custom":
        parts.push(value);
        break;
    }
  }

  // Process sub-groups
  for (const subGroup of group.groups) {
    const subText = buildQueryText(subGroup, depth + 1);
    if (subText) {
      parts.push(`(${subText})`);
    }
  }

  const connector = group.logic === "AND" ? "\n" : "\nأو: ";
  return parts.join(connector);
}

function buildFullPrompt(group: QueryGroup): string {
  const queryBody = buildQueryText(group);
  if (!queryBody.trim()) return "";

  return `أعطني أبرز القضايا والأخبار بناءً على المعايير التالية:

${queryBody}

لكل قصة: العنوان، ملخص جملتين، رابط المصدر، وهل غطاها أحد من المنافسين؟`;
}

interface Props {
  group: QueryGroup;
}

export default function QueryPreview({ group }: Props) {
  const [copied, setCopied] = useState(false);
  const prompt = buildFullPrompt(group);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Query copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSendToAI = () => {
    if (!prompt) return;
    toast.success("Query sent to AI for story discovery");
  };

  const isEmpty = !prompt.trim();

  return (
    <div className="rounded-xl bg-background border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-dim">Generated Query Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={isEmpty}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] text-dim font-mono hover:text-sensor transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            Copy
          </button>
          <button
            onClick={handleSendToAI}
            disabled={isEmpty}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Wand2 className="w-3 h-3" />
            Send to Perplexity
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="p-5">
        {isEmpty ? (
          <div className="text-[12px] text-dim font-mono text-center py-8">
            Add parameters above to build your query...
          </div>
        ) : (
          <pre className="text-[12px] text-sensor font-mono leading-relaxed whitespace-pre-wrap text-right" dir="rtl">
            {prompt}
          </pre>
        )}
      </div>
    </div>
  );
}

export { buildFullPrompt };
