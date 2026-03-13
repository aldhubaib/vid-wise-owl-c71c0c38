import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { channels, videos } from "@/data/mock";
import { ChannelRightPanel } from "@/components/ChannelRightPanel";
import { VideoTable } from "@/components/VideoTable";
import { ArrowLeft, PanelRightClose, PanelRight } from "lucide-react";

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
      <div className="h-12 flex items-center justify-between px-6 border-b border-border bg-background sticky top-0 z-[100] max-md:px-4 shrink-0">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-[13px] text-dim cursor-pointer bg-transparent border-none font-sans hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Channels
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-foreground hidden sm:block" dir="rtl">{channel.name}</span>
          <button
            onClick={() => setPanelVisible(!panelVisible)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-dim hover:text-foreground hover:bg-elevated transition-colors hidden md:flex"
          >
            {panelVisible ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Main content */}
        <div className={`transition-[margin] duration-200 ease-out ${panelVisible ? "md:mr-[300px]" : ""}`}>
          {/* Hero */}
          <div className="px-6 py-5 border-b border-border flex items-start gap-3.5 max-md:px-4">
            <div className="w-12 h-12 rounded-full bg-elevated border border-border flex items-center justify-center text-lg shrink-0 max-md:w-10 max-md:h-10 max-md:text-base">
              {channel.avatar}
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight mb-0.5 max-md:text-sm" dir="rtl">
                {channel.name}
              </h1>
              <a
                href={`https://youtube.com/${channel.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-dim font-mono mb-2 inline-block hover:text-sensor transition-colors no-underline"
              >
                {channel.handle}
              </a>
              <div className="flex gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-mono font-medium bg-success/10 text-success border border-success/15">
                  Active
                </span>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-mono font-medium bg-blue/10 text-blue border border-blue/15">
                  {channel.country}
                </span>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-mono font-medium bg-elevated text-dim border border-border">
                  Since {channel.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-5 border-b border-border max-md:grid-cols-3 max-sm:grid-cols-2">
            {stats.map((s, i) => (
              <div key={s.label} className={`px-6 py-4 ${i > 0 ? "border-l border-border" : ""} max-md:border-l-0 max-md:border-b max-md:border-border`}>
                <div className="text-lg font-semibold font-mono tracking-tight mb-0.5">{s.val}</div>
                <div className="text-[11px] text-dim">{s.label}</div>
                <div className={`text-[11px] font-mono mt-0.5 ${s.up ? "text-success" : "text-destructive"}`}>
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          {/* Videos section */}
          <div className="px-6 py-5 pb-16 max-md:px-4 max-md:pb-20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-dim font-medium">Recent Videos</span>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mb-3 flex-wrap max-md:flex-nowrap max-md:overflow-x-auto max-md:pb-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`py-1 px-2.5 rounded-md text-[12px] font-medium border cursor-pointer transition-all whitespace-nowrap ${
                    activeFilter === tab
                      ? "bg-elevated text-foreground border-border"
                      : "bg-transparent text-dim border-transparent hover:text-sensor hover:bg-surface"
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
