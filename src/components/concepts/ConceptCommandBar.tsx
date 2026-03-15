import { useState } from "react";
import { User, ChevronDown, Check, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { channels } from "@/data/mock";
import ch1 from "@/assets/avatars/ch1.jpg";
import ch2 from "@/assets/avatars/ch2.jpg";
import ch3 from "@/assets/avatars/ch3.jpg";


export default function ConceptCommandBar() {
  const ourChannels = channels.filter((c) => c.type === "ours").filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [channelDropOpen, setChannelDropOpen] = useState(false);
  const [scriptFormat, setScriptFormat] = useState<"short" | "long">("short");
  const [scriptDuration, setScriptDuration] = useState(3);
  const selectedCh = ourChannels.find((c) => c.id === selectedChannel);
  const canGenerate = !!selectedChannel;

  return (
    <div className="rounded-xl bg-background border border-border overflow-hidden">
      {/* Command bar — everything in one capsule */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3 flex-1">
          {/* The capsule */}
          <div className="inline-flex items-center bg-surface rounded-full border border-border overflow-hidden">
            {/* Channel */}
            <div className="relative">
              <button
                onClick={() => setChannelDropOpen(!channelDropOpen)}
                className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1.5 hover:bg-elevated transition-colors rounded-l-full"
              >
                {selectedCh ? (
                  <img src={selectedCh.avatarImg} alt={selectedCh.name} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-border/50 flex items-center justify-center">
                    <User className="w-3 h-3 text-dim" />
                  </div>
                )}
                <ChevronDown className={`w-2.5 h-2.5 text-dim transition-transform ${channelDropOpen ? "rotate-180" : ""}`} />
              </button>
              {channelDropOpen && (
                <div className="absolute z-10 mt-2 left-0 w-64 rounded-xl bg-surface border border-border overflow-hidden shadow-lg">
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

            {/* Inner divider */}
            <span className="w-px h-4 bg-border" />

            {/* Format toggle */}
            <div className="flex items-center px-1">
              {(["short", "long"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => { setScriptFormat(fmt); setScriptDuration(fmt === "short" ? 3 : 40); }}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors whitespace-nowrap ${
                    scriptFormat === fmt
                      ? "bg-background text-foreground shadow-sm"
                      : "text-dim hover:text-sensor"
                  }`}
                >
                  {fmt === "short" ? "Short" : "Video"}
                </button>
              ))}
            </div>

            {/* Inner divider */}
            <span className="w-px h-4 bg-border" />

            {/* Duration */}
            <div className="flex items-center gap-1 px-2.5 text-[11px] text-dim">
              <Clock className="w-3 h-3" />
              <input
                type="number"
                value={scriptDuration}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setScriptDuration(scriptFormat === "short" ? Math.max(1, Math.min(3, val)) : Math.max(3, val));
                }}
                className="w-10 px-1 py-0.5 text-[11px] font-mono bg-background border border-border rounded-full text-foreground text-center focus:outline-none focus:border-blue [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="font-mono text-[10px]">m</span>
            </div>

            {/* Inner divider */}
            <span className="w-px h-4 bg-border" />

            {/* Generate */}
            <button
              onClick={() => canGenerate ? toast("Generating…") : toast.error("Assign a channel first")}
              disabled={!canGenerate}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap rounded-r-full ${
                canGenerate ? "text-dim hover:text-foreground hover:bg-elevated" : "text-dim/30 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Generate
            </button>
          </div>
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

      <div className="px-5 py-4">
        <ScriptEditor />
      </div>
    </div>
  );
}
