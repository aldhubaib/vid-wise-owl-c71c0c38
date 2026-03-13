import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { channels as mockChannels } from "@/data/mock";
import { DeleteChannelModal } from "@/components/DeleteChannelModal";
import { Plus, ExternalLink, RefreshCw, X, Users, Eye, PlayCircle } from "lucide-react";

export default function Channels() {
  const navigate = useNavigate();
  const [channels] = useState(mockChannels);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleAdd = () => {
    if (!inputValue.trim()) {
      setInputError("Please enter a channel URL, handle, or ID");
      return;
    }
    setInputValue("");
    setInputError("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-6 border-b shrink-0 max-md:px-4 border-[#151619]">
        <h1 className="text-sm font-semibold">Channels</h1>
        <span className="text-[11px] font-mono text-dim">
          {channels.length} tracked
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Add channel */}
        <div className="px-6 pt-5 max-md:px-4">
          <div className="bg-surface p-4">
            <div className="flex gap-2 max-md:flex-col">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setInputError("");
                }}
                placeholder="Add channel — @handle or channel ID..."
                className={`flex-1 px-3 py-2 bg-elevated border rounded-md text-foreground text-[13px] font-sans outline-none transition-colors placeholder:text-dim min-w-0 ${
                inputError ? "border-destructive/50" : "border-border focus:border-sensor/30"}`
                } />
              
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-[13px] font-medium cursor-pointer whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-1.5 max-md:w-full max-md:justify-center">
                
                <Plus className="w-3.5 h-3.5" />
                Add Channel
              </button>
            </div>
            {inputError &&
            <p className="text-[11px] mt-2 text-destructive">{inputError}</p>
            }
          </div>
        </div>

        {/* Channel list */}
        <div className="px-6 py-4 max-md:px-4">
          <div className="grid grid-cols-1 gap-px bg-border overflow-hidden">
            {channels.map((ch) =>
            <div
              key={ch.id}
              className="bg-background flex items-center gap-3 px-4 py-3 hover:bg-elevated/40 transition-colors group">
              
                {/* Avatar */}
                <img src={ch.avatarImg} alt={ch.name} className="w-8 h-8 rounded-full object-cover shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-medium text-foreground truncate" dir="rtl">
                      {ch.name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                  </div>
                  <div className="text-[11px] text-dim font-mono">{ch.handle}</div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-[12px] font-mono text-sensor">
                    <Users className="w-3 h-3 text-dim" />
                    {ch.subscribers}
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] font-mono text-sensor">
                    <Eye className="w-3 h-3 text-dim" />
                    {ch.views}
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] font-mono text-sensor">
                    <PlayCircle className="w-3 h-3 text-dim" />
                    {ch.videos}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                  onClick={() => navigate(`/channel/${ch.id}`)}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors">
                  
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-md flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                  onClick={(e) => {e.stopPropagation();setDeleteTarget(ch.id);}}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-dim hover:text-destructive hover:bg-destructive/10 transition-colors">
                  
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteChannelModal
        open={!!deleteTarget}
        channelName={channels.find((c) => c.id === deleteTarget)?.name || ""}
        onClose={() => setDeleteTarget(null)}
        onDelete={() => setDeleteTarget(null)} />
      
    </div>);

}