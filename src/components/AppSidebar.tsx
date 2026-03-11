import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: "⊞", label: "Channels", path: "/" },
  { icon: "⋯", label: "Pipeline", path: "/pipeline" },
  { icon: "⊙", label: "Access Control", path: "/access" },
  { icon: "⚙", label: "Settings", path: "/settings" },
];

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
    <div className={`flex flex-col h-full ${isMobile ? "" : "w-[220px] min-w-[220px] border-r border-border sticky top-0 h-screen"}`}>
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="hsl(var(--primary))" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="4" fill="hsl(var(--primary))" />
          </svg>
          <span className="font-bold text-sm tracking-tight text-foreground">Falak</span>
        </div>
        {!isMobile && (
          <span className="text-[10px] font-mono text-dim ml-auto">v2.0</span>
        )}
      </div>

      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 bg-elevated border border-border rounded flex items-center justify-center text-dim text-sm hover:text-sensor transition-colors"
        >
          ✕
        </button>
      )}

      <nav className="flex-1 py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              onClose?.();
            }}
            className={`w-full flex items-center gap-2.5 px-5 py-2 text-[13px] font-medium transition-colors ${
              isActive(item.path)
                ? "bg-elevated text-foreground"
                : "text-dim hover:bg-surface hover:text-sensor"
            }`}
          >
            <span className="text-sm">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-5 py-3.5 border-t border-border flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-elevated border border-border flex items-center justify-center text-[11px] font-semibold text-sensor shrink-0">
          A
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-foreground truncate">Abdulaziz</div>
          <div className="text-[11px] text-dim truncate">a@falak.io</div>
        </div>
      </div>
    </div>
  );
}
