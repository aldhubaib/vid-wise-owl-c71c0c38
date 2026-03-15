import { useState } from "react";
import { User, ChevronDown, Check, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { channels } from "@/data/mock";
import ch1 from "@/assets/avatars/ch1.jpg";
import ch2 from "@/assets/avatars/ch2.jpg";
import ch3 from "@/assets/avatars/ch3.jpg";


export default function ConceptTwoRowSplit() {
  const ourChannels = channels.filter((c) => c.type === "ours").filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [channelDropOpen, setChannelDropOpen] = useState(false);
  const [scriptFormat, setScriptFormat] = useState<"short" | "long">("short");
  const [scriptDuration, setScriptDuration] = useState(3);
  const selectedCh = ourChannels.find((c) => c.id === selectedChannel);
  const canGenerate = !!selectedChannel;

  return (
    <div className="rounded-xl bg-background border border-border overflow-hidden">
      {/* Row 1: Channel + Collaborators */}
      <div className="px-5 py-2.5 flex items-center justify-between border-b border-border">
        <div className="relative flex items-center gap-3">
          <button
            onClick={() => setChannelDropOpen(!channelDropOpen)}
            className="flex items-center gap-2.5 hover:bg-surface px-2 py-1.5 rounded-lg transition-colors"
          >
            {selectedCh ? (
              <>
                <img src={selectedCh.avatarImg} alt={selectedCh.name} className="w-6 h-6 rounded-full object-cover" />
                <span className="text-[13px] font-medium text-foreground">{selectedCh.name}</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-dim" />
                </div>
                <span className="text-[13px] text-dim">Select channel</span>
              </>
            )}
            <ChevronDown className={`w-3 h-3 text-dim transition-transform ${channelDropOpen ? "rotate-180" : ""}`} />
          </button>
          {channelDropOpen && (
            <div className="absolute z-10 mt-2 top-full left-0 w-64 rounded-xl bg-surface border border-border overflow-hidden shadow-lg">
              {ourChannels.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedChannel(c.id); setChannelDropOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors hover:bg-elevated ${selectedChannel === c.id ? "bg-blue/10" : ""}`}
                >
                  <img src={c.avatarImg} alt={c.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="flex-1 text-right font-medium">{c.name}</span>
                  {selectedChannel === c.id && <Check className="w-3.5 h-3.5 text-blue" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Collaborators */}
        <div className="flex items-center -space-x-2">
          {[ch1, ch2, ch3].map((avatar, i) => (
            <div key={i} className="relative">
              <img src={avatar} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-background" />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-success border border-background" />
            </div>
          ))}
          <div className="w-7 h-7 rounded-full bg-surface border-2 border-background flex items-center justify-center text-[10px] text-muted-foreground font-medium">+2</div>
        </div>
      </div>

      {/* Row 2: Format + Duration + Generate */}
      <div className="px-5 py-2 flex items-center gap-4 border-b border-border bg-surface/20">
        <div className="flex items-center gap-1.5">
          {(["short", "long"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => { setScriptFormat(fmt); setScriptDuration(fmt === "short" ? 3 : 40); }}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors whitespace-nowrap border ${
                scriptFormat === fmt
                  ? "bg-background text-foreground border-border"
                  : "bg-transparent text-dim border-transparent hover:text-sensor hover:border-border/50"
              }`}
            >
              {fmt === "short" ? "Short" : "Video"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-dim">
          <Clock className="w-3.5 h-3.5" />
          <input
            type="number"
            value={scriptDuration}
            onChange={(e) => {
              const val = Number(e.target.value);
              setScriptDuration(scriptFormat === "short" ? Math.max(1, Math.min(3, val)) : Math.max(3, val));
            }}
            className="w-12 px-1.5 py-1 text-[12px] font-mono bg-background border border-border rounded-full text-foreground text-center focus:outline-none focus:border-blue [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="font-mono">min</span>
          <span className="text-[10px] text-dim/60">{scriptFormat === "short" ? "(max 3)" : "(min 3)"}</span>
        </div>

        <div className="flex-1" />

        <button
          onClick={() => canGenerate ? toast("Generating…") : toast.error("Assign a channel first")}
          disabled={!canGenerate}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors whitespace-nowrap border ${
            canGenerate ? "border-border/50 text-dim hover:text-sensor hover:border-border" : "border-border/30 text-dim/30 cursor-not-allowed"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate script
        </button>
      </div>

      <div className="px-5 py-6 text-center text-[12px] text-dim/40 font-mono">Script editor area</div>
    </div>
  );
}
