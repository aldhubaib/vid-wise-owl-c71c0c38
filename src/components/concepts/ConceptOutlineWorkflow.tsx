import { useState } from "react";
import { Sparkles, GripVertical, ChevronRight, Clock, Plus } from "lucide-react";

const mockOutline = [
  { id: 1, timestamp: "0:00", label: "Hook", text: "سؤال صادم عن البيانات المسربة", duration: "10s" },
  { id: 2, timestamp: "0:10", label: "Context", text: "تقديم التطبيق وعدد مستخدميه", duration: "25s" },
  { id: 3, timestamp: "0:35", label: "Problem", text: "كيف تم اكتشاف الثغرة الأمنية", duration: "40s" },
  { id: 4, timestamp: "1:15", label: "Deep Dive", text: "تفاصيل البيانات المسربة وحجم الضرر", duration: "45s" },
  { id: 5, timestamp: "2:00", label: "Impact", text: "تأثير التسريب على المستخدمين", duration: "30s" },
  { id: 6, timestamp: "2:30", label: "CTA", text: "نصائح لحماية بياناتك + اشتراك", duration: "20s" },
];

export default function ConceptOutlineWorkflow() {
  const [step, setStep] = useState<"outline" | "script">("outline");
  const [generating, setGenerating] = useState(false);

  const handleExpand = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setStep("script");
    }, 2000);
  };

  return (
    <div className="rounded-xl bg-background border border-border overflow-hidden">
      {/* Step indicator */}
      <div className="px-5 py-3 border-b border-border flex items-center gap-3">
        <button
          onClick={() => setStep("outline")}
          className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${
            step === "outline" ? "text-foreground" : "text-dim hover:text-sensor"
          }`}
        >
          <span className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center ${
            step === "outline" ? "bg-primary text-primary-foreground" : "bg-surface text-dim"
          }`}>1</span>
          Outline
        </button>
        <ChevronRight className="w-3 h-3 text-dim/30" />
        <button
          onClick={() => step === "script" && setStep("script")}
          className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${
            step === "script" ? "text-foreground" : "text-dim"
          }`}
        >
          <span className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center ${
            step === "script" ? "bg-primary text-primary-foreground" : "bg-surface text-dim"
          }`}>2</span>
          Full Script
        </button>
      </div>

      <div className="px-5 py-4">
        {step === "outline" && (
          <div className="space-y-4">
            {/* Outline items */}
            <div className="space-y-1">
              {mockOutline.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface/50 transition-colors group"
                >
                  <GripVertical className="w-3.5 h-3.5 text-dim/30 group-hover:text-dim transition-colors cursor-grab" />
                  <span className="text-[11px] font-mono text-dim w-10 shrink-0">{item.timestamp}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    item.label === "Hook" ? "bg-red/10 text-red" :
                    item.label === "CTA" ? "bg-success/10 text-success" :
                    "bg-surface text-dim"
                  }`}>
                    {item.label}
                  </span>
                  <input
                    dir="rtl"
                    defaultValue={item.text}
                    className="flex-1 text-[13px] bg-transparent text-foreground focus:outline-none text-right"
                  />
                  <span className="text-[10px] font-mono text-dim/50 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.duration}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full py-2 rounded-lg border border-dashed border-border text-[12px] text-dim hover:text-sensor hover:border-border transition-colors flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add segment
            </button>

            {/* Expand button */}
            <button
              onClick={handleExpand}
              disabled={generating}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
              {generating ? "Expanding outline to script…" : "Expand to Full Script"}
            </button>
          </div>
        )}

        {step === "script" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono text-success bg-success/10 px-2 py-0.5 rounded-full">Generated from outline</span>
            </div>
            <textarea
              dir="rtl"
              rows={12}
              className="w-full text-[14px] bg-transparent text-foreground placeholder:text-dim/50 focus:outline-none text-right leading-[1.9] resize-y"
              defaultValue={`هل تخيلت يومًا أن بياناتك الشخصية قد تكون معروضة للبيع الآن؟ هذا بالضبط ما حدث مع أكثر من 50 مليون مستخدم.\n\nالتطبيق اللي نتكلم عنه اليوم هو واحد من أشهر التطبيقات في العالم، وعدد مستخدميه يتجاوز 200 مليون شخص حول العالم.\n\nالقصة بدأت لما باحث أمني اسمه "أحمد" قرر يختبر حماية التطبيق، واكتشف ثغرة خطيرة تسمح بالوصول لقاعدة البيانات بالكامل.\n\nالبيانات المسربة شملت الأسماء الكاملة، الإيميلات، أرقام الجوالات، وحتى بعض المعلومات المالية مثل أرقام البطاقات.\n\nالتأثير كان كارثي - آلاف المستخدمين أبلغوا عن عمليات احتيال واختراق لحساباتهم البنكية.\n\nعشان تحمي نفسك: غيّر كلمات المرور، فعّل التحقق الثنائي، وراقب حساباتك البنكية. لا تنسون الاشتراك وتفعيل الجرس!`}
            />
            <div className="flex items-center justify-between text-[10px] text-dim font-mono">
              <span>~2:50 estimated · 6 segments</span>
              <button
                onClick={() => setStep("outline")}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                ← Back to outline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
