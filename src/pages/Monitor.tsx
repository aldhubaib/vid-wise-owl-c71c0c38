import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Circle, Pause, RotateCw, Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { monitorHealth, monitorCadence, monitorQuota, monitorChannels } from "@/data/monitorMock";

const filterTabs = ["All", "Due today", "Issues"];

export default function Monitor() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [countdown, setCountdown] = useState(21);
  const q = monitorQuota;

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 0 ? 21 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = monitorChannels.filter((ch) => {
    if (search && !ch.name.includes(search) && !ch.handle.includes(search)) return false;
    if (activeFilter === "Issues") return ch.isStale;
    return true;
  });

  const counts: Record<string, number> = {
    All: monitorChannels.length,
    "Due today": 32,
    Issues: monitorChannels.filter((c) => c.isStale).length,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-6 border-b border-[#151619] shrink-0 max-lg:px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold">Monitor</h1>
          <span className="text-[11px] text-dim font-mono">
            Now checking @badr3 · 32 / 47 due today · API quota resets in {q.resetsIn}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/15 text-success text-[11px] font-medium">
            <Circle className="w-2 h-2 fill-current" />
            Crawler running · {countdown}s
          </span>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-[11px] text-dim font-medium hover:text-sensor transition-colors">
            <Pause className="w-3 h-3" />
            Pause
          </button>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-[11px] text-dim font-medium hover:text-sensor transition-colors">
            <RotateCw className="w-3 h-3" />
            Force run all
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Cards row */}
        <div className="px-6 pt-5 max-lg:px-4 grid grid-cols-2 max-lg:grid-cols-1 gap-4 mb-5">
          {/* Channel Health */}
          <div className="rounded-xl bg-background overflow-hidden">
            <div className="px-4 py-3">
              <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-3">Channel Health</div>
              <div className="grid grid-cols-4 gap-0">
                {[
                  { val: monitorHealth.total, label: "TOTAL", color: "" },
                  { val: monitorHealth.healthy, label: "HEALTHY", color: "text-success" },
                  { val: monitorHealth.inactive, label: "INACTIVE", color: "text-orange" },
                  { val: monitorHealth.gone, label: "GONE", color: "text-destructive" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className={`text-xl font-semibold font-mono tracking-tight ${s.color}`}>{s.val}</div>
                    <div className="text-[10px] text-dim font-mono uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="text-[10px] text-dim font-mono uppercase tracking-widest mb-2.5">Check Cadence (Auto-learned)</div>
              {monitorCadence.map((c) => {
                const dotColor = c.color === "success" ? "bg-success" : c.color === "blue" ? "bg-blue" : c.color === "dim" ? "bg-dim" : "";
                return (
                  <div key={c.label} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      {dotColor ? (
                        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      ) : (
                        <span className="w-2" />
                      )}
                      <span className="text-[12px] text-sensor font-medium">{c.label}</span>
                      <span className="text-[11px] text-dim font-mono">{c.desc}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-dim">
                      <span>{c.channels} ch</span>
                      <span>{c.freq}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Quota */}
          <div className="rounded-xl bg-background overflow-hidden">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] text-dim font-mono uppercase tracking-widest">API Quota — Today</div>
                <span className="text-[11px] text-dim font-mono">Resets in {q.resetsIn}</span>
              </div>
              <div className="grid grid-cols-3 gap-0 mb-4">
                {[
                  { val: q.used.toLocaleString(), label: "USED", color: "text-orange" },
                  { val: q.remaining.toLocaleString(), label: "REMAINING", color: "text-success" },
                  { val: q.checksLeft, label: "CHECKS LEFT", color: "" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className={`text-xl font-semibold font-mono tracking-tight ${s.color}`}>{s.val}</div>
                    <div className="text-[10px] text-dim font-mono uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-dim font-mono">Total quota</span>
                <span className="text-[11px] text-dim font-mono">{q.used.toLocaleString()} / {q.total.toLocaleString()} {q.pct}%</span>
              </div>
              <div className="h-1.5 bg-elevated rounded-full overflow-hidden mb-2">
                <div className="h-full bg-success rounded-full" style={{ width: `${q.pct}%` }} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-dim font-mono">{q.apiKeys} API keys · {q.unitsPerDay.toLocaleString()} units/day</span>
                <span className="text-[11px] text-success font-mono">✓ Sufficient for today</span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-lg font-semibold font-mono tracking-tight">{q.checksToday}</span>
                  <span className="text-[10px] text-dim font-mono ml-2">checks today</span>
                </div>
                <div>
                  <span className="text-lg font-semibold font-mono tracking-tight">{q.queuedTomorrow}</span>
                  <span className="text-[10px] text-dim font-mono ml-2">queued tomorrow</span>
                </div>
                <span className="text-[11px] text-dim font-mono ml-auto">~{q.unitsPerCheck} units per check</span>
              </div>
            </div>
          </div>
        </div>

        {/* Channel table */}
        <div className="px-6 pb-8 max-lg:px-4">
          {/* Filters + search */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-1.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 text-[12px] font-medium rounded-full transition-colors whitespace-nowrap border ${
                    activeFilter === tab
                      ? "bg-surface text-foreground border-border"
                      : "bg-transparent text-dim border-border/50 hover:text-sensor hover:border-border"
                  }`}
                >
                  {tab} <span className="text-[11px] opacity-60">({counts[tab]})</span>
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dim" />
              <input
                type="text"
                placeholder="Search channels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-[12px] bg-transparent border border-border/50 rounded-full text-sensor placeholder:text-dim focus:outline-none focus:border-border w-[180px]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_90px_90px_90px_90px_80px_80px] px-4 py-2.5 bg-background border-b border-border">
              {["CHANNEL", "LAST CHECK", "NEW VIDEOS", "LAST VIDEO", "NEXT CHECK", "CADENCE", "OVERRIDE"].map((h) => (
                <span key={h} className="text-[10px] text-dim font-mono uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {/* Rows */}
            {filtered.map((ch) => (
              <div
                key={ch.id}
                onClick={() => navigate(`/channel/${ch.id}`)}
                className="grid grid-cols-[1fr_90px_90px_90px_90px_80px_80px] px-4 py-3 bg-background border-b border-border last:border-b-0 hover:bg-[#0d0d10] transition-colors cursor-pointer group items-center"
              >
                <div className="flex items-center gap-2.5">
                  <img src={ch.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[13px] font-medium truncate">{ch.name}</span>
                      <ArrowUpRight className="w-3 h-3 text-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <span className="text-[11px] text-dim font-mono">{ch.handle}</span>
                  </div>
                </div>
                <span className="text-[12px] text-dim font-mono">{ch.lastCheck}</span>
                <span className={`text-[12px] font-mono ${ch.newVideos ? "text-orange" : "text-dim"}`}>
                  {ch.newVideos || "—"}
                </span>
                <span className={`text-[12px] font-mono ${ch.isStale ? "text-orange" : "text-dim"}`}>
                  {ch.lastVideo}
                </span>
                <span className="text-[12px] text-dim font-mono">{ch.nextCheck}</span>
                <span className={`text-[12px] font-mono ${ch.cadenceType === "owned" ? "text-orange" : "text-dim"}`}>
                  {ch.cadence} {ch.cadenceType === "owned" ? "· owned" : "auto"}
                </span>
                <div>
                  {ch.override === "Auto" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-[11px] text-dim font-mono">
                      Auto <ChevronDown className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <span className="text-[11px] text-dim font-mono">locked</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
