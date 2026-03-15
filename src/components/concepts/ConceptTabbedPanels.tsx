import { useState } from "react";
import { FileText, Sparkles, StickyNote } from "lucide-react";

const tabs = [
  { id: "script", label: "Script", icon: FileText, badge: "1,240 words" },
  { id: "hooks", label: "Hooks", icon: Sparkles, badge: "2" },
  { id: "notes", label: "Notes", icon: StickyNote, badge: "3" },
] as const;

type Tab = (typeof tabs)[number]["id"];

export default function ConceptTabbedPanels() {
  const [active, setActive] = useState<Tab>("script");

  return (
    <div className="rounded-xl bg-background border border-border overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-[12px] font-medium transition-colors border-b-2 -mb-px ${
              active === t.id
                ? "border-primary text-foreground"
                : "border-transparent text-dim hover:text-sensor"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
              active === t.id ? "bg-primary/10 text-primary" : "bg-surface text-dim"
            }`}>
              {t.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        {active === "script" && (
          <div className="space-y-3">
            <textarea
              dir="rtl"
              rows={10}
              placeholder="اكتب السكريبت هنا..."
              className="w-full text-[14px] bg-transparent text-foreground placeholder:text-dim/50 focus:outline-none text-right leading-[1.9] resize-y"
              defaultValue="مرحبًا بكم في حلقة جديدة، اليوم سنتحدث عن موضوع مثير للاهتمام وهو تسريب بيانات ضخم أصاب أحد أشهر التطبيقات في العالم. القصة بدأت عندما اكتشف باحث أمني ثغرة خطيرة..."
            />
            <div className="flex items-center justify-between text-[10px] text-dim font-mono">
              <span>1,240 words · ~8 min read</span>
              <span>Last edited 2 min ago</span>
            </div>
          </div>
        )}

        {active === "hooks" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] text-dim font-mono uppercase tracking-wider">Opening Hook (10s)</label>
              <textarea
                dir="rtl"
                rows={3}
                placeholder="الخطاف الافتتاحي..."
                className="w-full text-[14px] bg-surface/50 border border-border rounded-lg px-3 py-2.5 text-foreground placeholder:text-dim/50 focus:outline-none focus:border-primary/40 text-right leading-[1.8] resize-none"
                defaultValue="هل تخيلت يومًا أن بياناتك الشخصية قد تكون معروضة للبيع الآن؟"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] text-dim font-mono uppercase tracking-wider">Branded Start</label>
              <textarea
                dir="rtl"
                rows={2}
                className="w-full text-[13px] bg-surface/50 border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-primary/40 text-right leading-[1.8] resize-none"
                defaultValue="أنا عبدالعزيز الذهيب، وهذي قصتنا اليوم"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] text-dim font-mono uppercase tracking-wider">Branded End</label>
              <textarea
                dir="rtl"
                rows={2}
                className="w-full text-[13px] bg-surface/50 border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-primary/40 text-right leading-[1.8] resize-none"
                defaultValue="لا تنسون الاشتراك وتفعيل الجرس، ونشوفكم في الحلقة الجاية"
              />
            </div>
          </div>
        )}

        {active === "notes" && (
          <div className="space-y-3">
            {["Use dramatic pause after the reveal", "Add B-roll of the app interface", "Check legal disclaimer for names mentioned"].map((note, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg bg-surface/50 border border-border">
                <span className="text-[10px] font-mono text-dim mt-0.5">#{i + 1}</span>
                <span className="text-[13px] text-foreground flex-1">{note}</span>
              </div>
            ))}
            <button className="w-full py-2.5 rounded-lg border border-dashed border-border text-[12px] text-dim hover:text-sensor hover:border-border transition-colors">
              + Add note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
