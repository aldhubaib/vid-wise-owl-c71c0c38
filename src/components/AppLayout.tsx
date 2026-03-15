import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";

const DESKTOP_BREAKPOINT = 1024;

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= DESKTOP_BREAKPOINT : true
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isDesktop, drawerOpen]);

  const expanded = pinned || hovered;

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      {isDesktop && (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <AppSidebar collapsed={!expanded} pinned={pinned} onTogglePin={() => setPinned(!pinned)} />
        </div>
      )}

      {/* Mobile/Tablet header */}
      {!isDesktop && (
        <div className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 border-b border-border bg-background z-[100]">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-dim hover:text-sensor hover:bg-elevated transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-sm bg-primary" />
            </div>
            <span className="font-semibold text-[13px] text-foreground">Falak</span>
          </div>
          <div className="w-8" />
        </div>
      )}

      {/* Mobile/Tablet drawer overlay */}
      {!isDesktop && drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[500] backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile/Tablet drawer */}
      {!isDesktop && (
        <div
          className={`fixed top-0 left-0 w-[260px] h-screen bg-background border-r border-border z-[600] transition-transform duration-200 ease-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AppSidebar isMobile onClose={() => setDrawerOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main
        className={`flex-1 min-w-0 bg-surface relative z-10 ${
          isDesktop ? "pt-0 rounded-l-2xl" : "pt-12"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
