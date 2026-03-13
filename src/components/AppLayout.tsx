import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AppSidebar />
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 border-b border-border bg-background z-[100]">
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

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[500] backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 w-[260px] h-screen bg-background border-r border-border z-[600] transition-transform duration-200 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar isMobile onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 md:pt-0 pt-12 bg-surface rounded-tl-xl rounded-bl-xl">
        <Outlet />
      </main>
    </div>
  );
}
