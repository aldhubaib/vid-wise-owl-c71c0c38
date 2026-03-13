import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, GitBranch, Shield, Settings, Search, ChevronDown, Check, Pencil, Plus } from "lucide-react";

const navItems = [
  { icon: LayoutGrid, label: "Channels", path: "/" },
  { icon: GitBranch, label: "Pipeline", path: "/pipeline" },
  { icon: Shield, label: "Access Control", path: "/access" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const projects = [
  { id: "falak", name: "Falak", initial: "f.", active: true },
  { id: "nizek", name: "Nizek", initial: "n.", active: false },
  { id: "darb", name: "Al-Darb", initial: "a.", active: false },
];

interface AppSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function AppSidebar({ onClose, isMobile }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [switcherOpen, setSwitcherOpen] = useState(false);
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

  return (
    <div className={`flex flex-col h-full bg-background ${isMobile ? "" : "w-[220px] min-w-[220px] border-r border-border sticky top-0 h-screen"}`}>
      {/* Brand / Project Switcher */}
      <div className="relative px-4 h-12 flex items-center justify-between shrink-0" ref={switcherRef}>
        <button
          onClick={() => setSwitcherOpen(!switcherOpen)}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <span className="font-semibold text-[13px] text-foreground">Falak</span>
          <ChevronDown className={`w-3 h-3 text-dim transition-transform ${switcherOpen ? "rotate-180" : ""}`} />
        </button>


        {/* Dropdown */}
        {switcherOpen && (
          <div className="absolute top-full left-2 right-2 mt-1 bg-elevated border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="px-3 py-2 text-[10px] font-medium text-dim uppercase tracking-wider">Projects</div>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSwitcherOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] hover:bg-background transition-colors"
              >
                <span className={`flex-1 text-left truncate ${project.active ? "text-foreground font-medium" : "text-dim"}`}>
                  {project.name}
                </span>
                {project.active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            ))}
            <div className="border-t border-border">
              <button
                onClick={() => setSwitcherOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-dim hover:text-sensor hover:bg-surface transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit project</span>
              </button>
              <button
                onClick={() => setSwitcherOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-dim hover:text-sensor hover:bg-surface transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New project</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded flex items-center justify-center text-dim text-sm hover:text-sensor hover:bg-elevated transition-colors"
        >
          ✕
        </button>
      )}

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
              className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-full text-[13px] font-medium transition-colors mb-0.5 ${
                active
                  ? "bg-elevated text-foreground"
                  : "text-dim hover:bg-elevated/60 hover:text-sensor"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3 flex items-center gap-2.5 bg-[#080808]">
        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-semibold text-primary shrink-0">
          A
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-foreground truncate">Abdulaziz</div>
          <div className="text-[11px] text-dim truncate">a@falak.io</div>
        </div>
      </div>
    </div>
  );
}
