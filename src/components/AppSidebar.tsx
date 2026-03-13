import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, GitBranch, Shield, Settings, Search } from "lucide-react";

const navItems = [
{ icon: LayoutGrid, label: "Channels", path: "/" },
{ icon: GitBranch, label: "Pipeline", path: "/pipeline" },
{ icon: Shield, label: "Access Control", path: "/access" },
{ icon: Settings, label: "Settings", path: "/settings" }];


interface AppSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function AppSidebar({ onClose, isMobile }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname.startsWith("/channel");
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`flex flex-col h-full bg-background ${isMobile ? "" : "w-[220px] min-w-[220px] border-r border-border sticky top-0 h-screen"}`}>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-12 border-b border-border shrink-0">
        <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-sm bg-primary" />
        </div>
        <span className="font-semibold text-[13px] text-foreground">Falak</span>
        {!isMobile &&
        <span className="text-[10px] font-mono text-dim ml-auto">v2.0</span>
        }
      </div>

      {isMobile &&
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 rounded flex items-center justify-center text-dim text-sm hover:text-sensor hover:bg-elevated transition-colors">
        
          ✕
        </button>
      }

      {/* Search hint */}
      <div className="px-3 pt-3 pb-1">
        <div className="flex items-center gap-2 px-2.5 py-[6px] rounded-md bg-surface border border-border text-dim text-[12px] cursor-pointer hover:border-sensor/20 transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <span className="ml-auto text-[10px] font-mono border border-border rounded px-1 py-px">⌘K</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-1.5 px-2 bg-[#080808]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose?.();
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] font-medium transition-colors mb-0.5 ${
              active ?
              "bg-elevated text-foreground" :
              "text-dim hover:bg-surface hover:text-sensor"}`
              }>
              
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </button>);

        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-border flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-semibold text-primary shrink-0">
          A
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-foreground truncate">Abdulaziz</div>
          <div className="text-[11px] text-dim truncate">a@falak.io</div>
        </div>
      </div>
    </div>);

}