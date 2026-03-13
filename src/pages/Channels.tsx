import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { channels as mockChannels } from "@/data/mock";
import { DeleteChannelModal } from "@/components/DeleteChannelModal";
import { Plus, ExternalLink, RefreshCw, X, Users, Eye, PlayCircle, Star, Swords } from "lucide-react";

type FilterType = "ours" | "competition";

export default function Channels() {
  const navigate = useNavigate();
  const [channels] = useState(mockChannels);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("ours");

  // Show all channels, toggle only affects add type

  const handleAdd = () => {
    const val = inputValue.trim();
    if (!val) {
      setInputError("Please enter a channel URL, handle, or ID");
      return;
    }
    // Check if already exists
    const exists = channels.some(
      (ch) => ch.handle === val || ch.handle === `@${val}` || ch.id === val
    );
    if (exists) {
      setInputError("This channel is already tracked");
      return;
    }
    setInputValue("");
    setInputError("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="h-12 flex items-center px-6 border-b shrink-0 max-md:px-4 border-[#151619]">
        <h1 className="text-sm font-semibold">
          Channels <span className="text-dim font-normal">({channels.length})</span>
        </h1>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Add channel */}
        <div className="px-6 pt-5 pb-1 max-md:px-4">
          <div className="flex gap-2 max-md:flex-col items-start">
            {/* Type selector */}
            <div className="flex items-center bg-elevated rounded-full p-0.5 shrink-0">
              <button
                onClick={() => setFilter("ours")}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors ${
                  filter === "ours" ? "bg-surface text-foreground" : "text-dim hover:text-sensor"
                }`}
              >
                Ours
              </button>
              <button
                onClick={() => setFilter("competition")}
                className={`px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors ${
                  filter === "competition" ? "bg-surface text-foreground" : "text-dim hover:text-sensor"
                }`}
              >
                Competition
              </button>
            </div>
            <div className="flex-1 relative max-md:w-full">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setInputError("");
                }}
                placeholder="@handle or channel ID..."
                className={`w-full pl-3 pr-3 py-2 bg-background border text-foreground text-[13px] font-sans outline-none transition-colors placeholder:text-dim ${
                  inputError ? "border-destructive/50" : "border-border focus:border-[#2a2a2e]"
                }`}
                style={{ borderRadius: '8px' }}
              />
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-foreground text-background text-[13px] font-medium cursor-pointer whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-1.5 max-md:w-full max-md:justify-center"
              style={{ borderRadius: '8px' }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
          {inputError && (
            <p className="text-[11px] mt-1.5 text-destructive">{inputError}</p>
          )}
        </div>

        {/* Channel list */}
        <div className="px-6 py-4 max-md:px-4">
          <div className="rounded-xl overflow-hidden border border-border" style={{ borderRadius: '12px' }}>
            {channels.map((ch) => {
              return (
              <div
                key={ch.id}
                className="bg-background flex items-center gap-3 px-4 py-3 hover:bg-[#0d0d10] transition-colors group border-b border-border last:border-b-0"
              >

                {/* Avatar */}
                <div className="relative shrink-0">
                  <img src={ch.avatarImg} alt={ch.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="absolute top-0 left-0 w-2 h-2 rounded-full bg-success border-2 border-background" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-medium text-foreground truncate" dir="rtl">
                      {ch.name}
                    </span>
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
                    className="w-7 h-7 rounded-md flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-md flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(ch.id); }}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-dim hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      <DeleteChannelModal
        open={!!deleteTarget}
        channelName={channels.find((c) => c.id === deleteTarget)?.name || ""}
        onClose={() => setDeleteTarget(null)}
        onDelete={() => setDeleteTarget(null)}
      />
    </div>
  );
}
