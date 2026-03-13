import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { LayoutGrid, GitBranch, Circle, TrendingUp, AlignJustify, CircleDot, Settings, ChevronDown, Check, Pencil, Plus, Activity, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: LayoutGrid, label: "Channels", path: "/" },
  { icon: GitBranch, label: "Pipeline", path: "/pipeline" },
  { icon: Activity, label: "Monitor", path: "/monitor" },
  { icon: TrendingUp, label: "Analytics", path: "/analytics" },
  { icon: AlignJustify, label: "Stories", path: "/stories" },
  { icon: CircleDot, label: "Brain", path: "/brain" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const adminItems = [
  { icon: Circle, label: "Admin", path: "/admin" },
];

const projects = [
  { id: "falak", name: "Falak", initial: "F", active: true },
  { id: "nizek", name: "Nizek", initial: "N", active: false },
  { id: "darb", name: "Al-Darb", initial: "A", active: false },
];

interface AppSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({ onClose, isMobile, collapsed = false, onToggleCollapse }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname.startsWith("/channel");
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sidebarWidth = collapsed ? "w-[56px] min-w-[56px]" : "w-[220px] min-w-[220px]";

  return (
    <div className={`flex flex-col h-full bg-[#080808] transition-all duration-200 ${isMobile ? "" : `${sidebarWidth} sticky top-0 h-screen`}`}>
      {/* Brand / Project Switcher */}
      <div className="relative px-3 h-12 flex items-center justify-between shrink-0 border-[#080808]" ref={switcherRef}>
        {!collapsed ? (
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <span className="font-semibold text-[13px] text-foreground">Falak</span>
            <ChevronDown className={`w-3 h-3 text-dim transition-transform ${switcherOpen ? "rotate-180" : ""}`} />
          </button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-semibold text-primary mx-auto"
              >
                F
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Falak</TooltipContent>
          </Tooltip>
        )}

        {/* Dropdown */}
        {switcherOpen && !collapsed && (
          <div className="absolute top-full left-2 right-2 mt-1 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-3 py-2 text-[10px] font-medium text-dim uppercase tracking-wider">Projects</div>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSwitcherOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-[13px] hover:bg-elevated/60 transition-colors"
              >
                <span className={`flex-1 text-left truncate ${project.active ? "text-foreground font-medium" : "text-dim"}`}>
                  {project.name}
                </span>
                {project.active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            ))}
            <div className="border-t border-border mt-1.5 pt-1.5">
              <button
                onClick={() => setSwitcherOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-[13px] text-dim hover:text-sensor hover:bg-elevated/60 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit project</span>
              </button>
              <button
                onClick={() => setSwitcherOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-full text-[13px] text-dim hover:text-sensor hover:bg-elevated/60 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New project</span>
              </button>
            </div>
            <div className="pb-1.5" />
          </div>
        )}
      </div>

      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-dim text-sm hover:text-sensor hover:bg-elevated transition-colors"
        >
          ✕
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 py-1.5 px-2 bg-[#080808]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const btn = (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose?.();
              }}
              className={`w-full flex items-center ${collapsed ? "justify-center" : ""} gap-2.5 ${collapsed ? "px-0 py-2" : "px-2.5 py-[7px]"} rounded-full text-[13px] font-medium transition-colors mb-0.5 ${
                active
                  ? "bg-elevated text-foreground"
                  : "text-dim hover:bg-elevated/60 hover:text-sensor"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              {!collapsed && item.label}
            </button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>{btn}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }
          return btn;
        })}

        {adminItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const btn = (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onClose?.();
              }}
              className={`w-full flex items-center ${collapsed ? "justify-center" : ""} gap-2.5 ${collapsed ? "px-0 py-2" : "px-2.5 py-[7px]"} rounded-full text-[13px] font-medium transition-colors mb-0.5 ${
                active
                  ? "bg-elevated text-foreground"
                  : "text-dim hover:bg-elevated/60 hover:text-sensor"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
              {!collapsed && item.label}
            </button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>{btn}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }
          return btn;
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && onToggleCollapse && (
        <div className="px-2 py-1.5 bg-[#080808] flex justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleCollapse}
                className="w-7 h-7 rounded-full flex items-center justify-center text-dim hover:bg-elevated/60 hover:text-sensor transition-colors"
              >
                {collapsed ? <ChevronsRight className="w-3.5 h-3.5" strokeWidth={1.5} /> : <ChevronsLeft className="w-3.5 h-3.5" strokeWidth={1.5} />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{collapsed ? "Expand" : "Collapse"}</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* User */}
      <button
        onClick={() => setLogoutOpen(true)}
        className={`px-3 py-3 flex items-center gap-2.5 bg-[#080808] hover:bg-elevated/60 transition-colors w-full text-left ${collapsed ? "justify-center" : ""}`}
      >
        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-semibold text-primary shrink-0">
          A
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-foreground truncate">Abdulaziz</div>
            <div className="text-[11px] text-dim truncate">a@falak.io</div>
          </div>
        )}
      </button>

      {/* Logout dialog */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="sm:max-w-[360px] bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-[15px]">Sign out</DialogTitle>
            <DialogDescription className="text-[12px] text-dim">
              Are you sure you want to sign out of your account?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setLogoutOpen(false)}
              className="flex-1 px-4 py-2 text-[13px] font-medium rounded-full border border-border text-dim hover:text-sensor transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex-1 px-4 py-2 text-[13px] font-medium rounded-full bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
            >
              Sign out
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
