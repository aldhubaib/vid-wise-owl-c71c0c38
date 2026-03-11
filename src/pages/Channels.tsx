import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { channels as mockChannels } from "@/data/mock";
import { DeleteChannelModal } from "@/components/DeleteChannelModal";

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
      <div className="px-10 pt-8 flex items-start justify-between max-md:px-4 max-md:pt-5 max-md:flex-wrap max-md:gap-2">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight mb-1 max-md:text-lg">Channels</h1>
          <p className="text-[13px] text-dim">Monitor YouTube channels and track their performance</p>
        </div>
        <span className="py-1 px-3 rounded bg-elevated border border-border text-xs font-mono text-sensor whitespace-nowrap">
          {channels.length} channels
        </span>
      </div>

      {/* Add channel */}
      <div className="mx-10 mt-6 bg-surface border border-border rounded-md p-5 max-md:mx-4 max-md:mt-4">
        <h3 className="text-[13px] font-semibold mb-3.5">+ Add New Channel</h3>
        <div className="flex gap-2.5 max-md:flex-col">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setInputError("");
            }}
            placeholder="@handle, or channel ID..."
            className={`flex-1 px-3.5 py-2 bg-elevated border rounded text-foreground text-[13px] font-sans outline-none transition-colors placeholder:text-dim min-w-0 ${
              inputError ? "border-destructive/50" : "border-border focus:border-dim"
            }`}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded bg-primary border-none text-primary-foreground text-[13px] font-medium cursor-pointer whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity max-md:w-full"
          >
            + Add
          </button>
        </div>
        <p className={`text-[11px] mt-2 ${inputError ? "text-destructive" : "text-dim"}`}>
          {inputError || "Examples: youtube.com/@channelname, @handle, or UCxxx..."}
        </p>
      </div>

      {/* Channel grid */}
      <div className="grid grid-cols-3 gap-3 px-10 py-5 pb-10 max-md:grid-cols-1 max-md:px-4 max-md:pb-20">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="bg-surface border border-border rounded-md p-5 flex flex-col gap-4 hover:border-dim transition-colors"
          >
            {/* Top */}
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-elevated border border-border shrink-0 flex items-center justify-center text-base">
                {ch.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-right whitespace-nowrap overflow-hidden text-ellipsis mb-0.5" dir="rtl">
                  {ch.name}
                </div>
                <div className="text-[11px] text-dim font-mono text-right">{ch.handle}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-dim mt-0.5 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Active
                </div>
                <div className="text-[10px] text-dim font-mono mt-0.5 text-right">
                  ⟳ Synced {ch.lastSynced}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between">
              {[
                { icon: "👥", val: ch.subscribers, label: "Subs" },
                { icon: "👁", val: ch.views, label: "Views" },
                { icon: "▶", val: ch.videos, label: "Videos" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-dim">{s.icon}</span>
                  <span className="text-sm font-bold font-mono tracking-tight">{s.val}</span>
                  <span className="text-[10px] text-dim">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-1.5">
              <button
                onClick={() => navigate(`/channel/${ch.id}`)}
                className="flex-1 py-1.5 px-3 rounded bg-elevated border border-border text-sensor text-xs font-medium cursor-pointer transition-colors hover:bg-border hover:text-foreground flex items-center justify-center gap-1.5"
              >
                ↗ View Details
              </button>
              <button className="w-[30px] h-[30px] rounded bg-elevated border border-border text-dim cursor-pointer flex items-center justify-center transition-colors hover:bg-border hover:text-sensor shrink-0 text-xs">
                ⟳
              </button>
              <button
                onClick={() => setDeleteTarget(ch.id)}
                className="w-[30px] h-[30px] rounded bg-elevated border border-border text-dim cursor-pointer flex items-center justify-center transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 shrink-0 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
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
