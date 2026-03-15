import { useState } from "react";
import { Maximize2, Play, Pause } from "lucide-react";

export default function ConceptSplitView() {
  const [scriptText, setScriptText] = useState(
    "مرحبًا بكم في حلقة جديدة، اليوم سنتحدث عن موضوع مثير للاهتمام وهو تسريب بيانات ضخم أصاب أحد أشهر التطبيقات في العالم.\n\nالقصة بدأت عندما اكتشف باحث أمني ثغرة خطيرة في النظام تتيح الوصول إلى بيانات أكثر من 50 مليون مستخدم.\n\nالبيانات المسربة تشمل الأسماء الكاملة، عناوين البريد الإلكتروني، وأرقام الهواتف، وحتى بعض المعلومات المالية.\n\nالشركة المطورة للتطبيق أصدرت بيانًا اعتذاريًا ووعدت بإجراء تحقيق شامل."
  );
  const [scrolling, setScrolling] = useState(false);

  return (
    <div className="rounded-xl bg-background border border-border overflow-hidden">
      <div className="flex divide-x divide-border min-h-[350px]">
        {/* Editor side */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-[11px] text-dim font-mono uppercase tracking-wider">Editor</span>
            <span className="text-[10px] text-dim font-mono">{scriptText.split(/\s+/).length} words</span>
          </div>
          <div className="flex-1 p-4">
            <textarea
              dir="rtl"
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              className="w-full h-full text-[14px] bg-transparent text-foreground placeholder:text-dim/50 focus:outline-none text-right leading-[1.9] resize-none"
              placeholder="اكتب السكريبت هنا..."
            />
          </div>
        </div>

        {/* Teleprompter side */}
        <div className="w-[40%] flex flex-col bg-[hsl(var(--surface))]">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-[11px] text-dim font-mono uppercase tracking-wider">Teleprompter</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setScrolling(!scrolling)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors"
              >
                {scrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button className="w-7 h-7 rounded-full flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto flex items-start justify-center">
            <div
              dir="rtl"
              className="text-[20px] font-semibold text-foreground leading-[2] text-center max-w-[90%]"
            >
              {scriptText || <span className="text-dim/30">Preview will appear here…</span>}
            </div>
          </div>
          <div className="px-4 py-2 border-t border-border flex items-center justify-center gap-3">
            <span className="text-[10px] text-dim font-mono">Speed</span>
            <input
              type="range"
              min={1}
              max={5}
              defaultValue={3}
              className="w-24 h-1 accent-primary"
            />
            <span className="text-[10px] text-dim font-mono">Font</span>
            <input
              type="range"
              min={16}
              max={32}
              defaultValue={20}
              className="w-20 h-1 accent-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
