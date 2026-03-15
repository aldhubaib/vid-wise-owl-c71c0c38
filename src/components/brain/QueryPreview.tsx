import { useState } from "react";
import { Copy, Check, Wand2 } from "lucide-react";
import { toast } from "sonner";
import type { SectionItem } from "./QuerySection";

export interface QuerySections {
  base: SectionItem[];
  seekTopics: SectionItem[];
  memoryTier1: SectionItem[];
  memoryTier2: SectionItem[];
  inProduction: SectionItem[];
  avoidList: SectionItem[];
}

function buildFullPrompt(sections: QuerySections): string {
  const base = sections.base.filter((i) => i.enabled);
  const seek = sections.seekTopics.filter((i) => i.enabled);
  const mem1 = sections.memoryTier1.filter((i) => i.enabled);
  const mem2 = sections.memoryTier2.filter((i) => i.enabled);
  const prod = sections.inProduction.filter((i) => i.enabled);
  const avoid = sections.avoidList.filter((i) => i.enabled);

  const parts: string[] = [];

  // Section 1 — Base
  if (base.length > 0) {
    const baseText = base.map((i) => i.text).join("، ");
    parts.push(`أعطني أبرز القضايا والأخبار: ${baseText}`);
  }

  // Section 2 — Seek Topics
  if (seek.length > 0) {
    parts.push(`\nأولوية: ابحث عن تطورات جديدة في:`);
    seek.forEach((i) => parts.push(`• ${i.text}`));
  }

  // Section 3 — Memory Tier 1
  if (mem1.length > 0) {
    parts.push(`\nابحث عن قصص مشابهة في النوع والشعور لـ:`);
    mem1.forEach((i) => parts.push(`• "${i.text}" ${i.meta ? `(${i.meta})` : ""}`));
  }

  // Section 4 — Memory Tier 2
  if (mem2.length > 0) {
    parts.push(`\nراجع النتائج وتأكد من توافقها مع:`);
    mem2.forEach((i) => parts.push(`• ${i.text}`));
  }

  // Section 5 — In Production
  if (prod.length > 0) {
    parts.push(`\nتجنب اقتراح قصص مشابهة لهذه (قيد الإنتاج حالياً):`);
    prod.forEach((i) => parts.push(`• "${i.text}"`));
  }

  // Section 6 — Avoid List
  if (avoid.length > 0) {
    parts.push(`\nتجنب تماماً أي قصص مشابهة لـ:`);
    avoid.forEach((i) => parts.push(`• "${i.text}"`));
  }

  // Footer
  if (parts.length > 0) {
    parts.push(`\nلكل قصة: العنوان، ملخص جملتين، رابط المصدر، وهل غطاها أحد من المنافسين؟`);
  }

  return parts.join("\n");
}

function isQueryComplete(sections: QuerySections): boolean {
  return (
    sections.base.some((i) => i.enabled) &&
    sections.seekTopics.some((i) => i.enabled) &&
    sections.memoryTier1.some((i) => i.enabled) &&
    sections.memoryTier2.some((i) => i.enabled) &&
    sections.inProduction.some((i) => i.enabled) &&
    sections.avoidList.some((i) => i.enabled)
  );
}

interface Props {
  sections: QuerySections;
}

export default function QueryPreview({ sections }: Props) {
  const [copied, setCopied] = useState(false);
  const prompt = buildFullPrompt(sections);
  const complete = isQueryComplete(sections);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Query copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSendToAI = () => {
    if (!prompt || !complete) return;
    toast.success("Query sent to AI for story discovery");
  };

  const filledCount = [
    sections.base, sections.seekTopics, sections.memoryTier1,
    sections.memoryTier2, sections.inProduction, sections.avoidList,
  ].filter((s) => s.some((i) => i.enabled)).length;

  return (
    <div className="rounded-xl bg-background border border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${complete ? "bg-success animate-pulse" : "bg-orange"}`} />
          <span className="text-[10px] font-mono uppercase tracking-widest text-dim">
            Generated Query
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
            complete ? "bg-success/15 text-success" : "bg-orange/15 text-orange"
          }`}>
            {filledCount}/6 sections
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!prompt.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-[11px] text-dim font-mono hover:text-sensor transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            Copy
          </button>
          <button
            onClick={handleSendToAI}
            disabled={!complete}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Wand2 className="w-3 h-3" />
            Send to Perplexity
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="p-5">
        {!prompt.trim() ? (
          <div className="text-[12px] text-dim font-mono text-center py-8">
            Fill all 6 sections to generate the query...
          </div>
        ) : (
          <div>
            {!complete && (
              <div className="text-[10px] font-mono text-orange bg-orange/10 rounded-lg px-3 py-2 mb-3">
                ⚠ Complete all sections to enable "Send to Perplexity"
              </div>
            )}
            <pre className="text-[12px] text-sensor font-mono leading-relaxed whitespace-pre-wrap text-right" dir="rtl">
              {prompt}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export { buildFullPrompt, isQueryComplete };
