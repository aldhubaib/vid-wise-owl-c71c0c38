import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { channels, videos } from "@/data/mock";
import { ChannelRightPanel } from "@/components/ChannelRightPanel";
import { VideoTable } from "@/components/VideoTable";

const filterTabs = ["All Videos", "Videos", "Shorts", "Analyzed", "Failed"];

export default function ChannelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const channel = channels.find((c) => c.id === id);
  const channelVideos = videos.filter((v) => v.channelId === id);
  const [activeFilter, setActiveFilter] = useState("All Videos");
  const [panelVisible, setPanelVisible] = useState(true);

  if (!channel) {
    return <div className="p-10 text-sensor">Channel not found</div>;
  }

  const filteredVideos = channelVideos.filter((v) => {
    if (activeFilter === "All Videos") return true;
    if (activeFilter === "Videos") return v.type === "video";
    if (activeFilter === "Shorts") return v.type === "short";
    if (activeFilter === "Analyzed") return v.status === "done";
    if (activeFilter === "Failed") return v.status === "failed";
    return true;
  });

  const stats = [
    { val: channel.subscribers, label: "Subscribers", change: channel.growthSubs, up: true },
    { val: channel.views, label: "Total Views", change: channel.growthViews, up: true },
    { val: channel.videos, label: "Videos", change: "+4", up: true },
    { val: channel.avgViews, label: "Avg. Views", change: "-1.2%", up: false },
    { val: channel.engRate, label: "Eng. Rate", change: "+0.3%", up: true },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="h-[49px] flex items-center justify-between px-10 border-b border-border bg-background sticky top-0 z-[100] max-md:px-4 shrink-0">
        <button
          onClick={() => navigate("/")}
          className="text-[13px] text-sensor cursor-pointer bg-transparent border-none font-sans hover:text-foreground transition-colors"
        >
          ← Back to Channels
        </button>
        <button
          onClick={() => setPanelVisible(!panelVisible)}
          className="py-1.5 px-3.5 rounded bg-transparent border border-border text-sensor text-xs font-sans cursor-pointer transition-all hover:border-dim hover:text-foreground hidden md:block"
        >
          {panelVisible ? "Hide Panel" : "Show Panel"}
        </button>
      </div>

      <div className="flex-1 relative">
        {/* Main content */}
        <div className={`transition-[margin] duration-250 ease-out ${panelVisible ? "md:mr-[300px]" : ""}`}>
          {/* Hero */}
          <div className="px-10 py-7 pb-6 border-b border-border flex items-start gap-4 max-md:px-4 max-md:py-5">
            <div className="w-[60px] h-[60px] rounded-full bg-elevated border border-border flex items-center justify-center text-[22px] shrink-0 max-md:w-11 max-md:h-11 max-md:text-lg">
              {channel.avatar}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 max-md:text-base" dir="rtl">
                {channel.name}
              </h1>
              <a
                href={`https://youtube.com/${channel.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-dim font-mono mb-2.5 inline-block hover:text-sensor transition-colors no-underline"
              >
                youtube.com/{channel.handle}
              </a>
              <div className="flex gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-mono font-medium bg-success/[0.12] text-success border border-success/20">
                  ● Active
                </span>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-mono font-medium bg-blue/[0.12] text-blue border border-blue/20">
                  {channel.country}
                </span>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-mono font-medium bg-elevated text-dim border border-border">
                  Since {channel.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-5 gap-px bg-border border-b border-border max-md:grid-cols-3 max-sm:grid-cols-2 max-md:overflow-x-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-background px-6 py-4">
                <div className="text-xl font-bold font-mono tracking-tight mb-0.5">{s.val}</div>
                <div className="text-[11px] text-dim">{s.label}</div>
                <div className={`text-[11px] font-mono mt-0.5 ${s.up ? "text-success" : "text-destructive"}`}>
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          {/* Videos section */}
          <div className="px-10 py-7 pb-16 max-md:px-4 max-md:pb-20">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] text-dim font-mono uppercase tracking-widest">Recent Videos</span>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mb-3.5 flex-wrap max-md:flex-nowrap max-md:overflow-x-auto max-md:pb-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`py-1 px-3 rounded text-[11px] font-medium font-mono border cursor-pointer transition-all whitespace-nowrap ${
                    activeFilter === tab
                      ? "bg-border text-foreground border-dim"
                      : "bg-elevated text-dim border-border hover:text-sensor"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <VideoTable videos={filteredVideos} onVideoClick={(vid) => navigate(`/video/${vid}`)} />
          </div>
        </div>

        {/* Right panel */}
        <ChannelRightPanel channel={channel} visible={panelVisible} />
      </div>
    </div>
  );
}
