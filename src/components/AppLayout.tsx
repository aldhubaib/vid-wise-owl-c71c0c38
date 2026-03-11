import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AppSidebar />
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-[52px] flex items-center justify-between px-4 border-b border-border bg-background z-[100]">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 bg-elevated border border-border rounded-md flex flex-col items-center justify-center gap-1 cursor-pointer"
        >
          <span className="block w-3.5 h-[1.5px] bg-sensor rounded-sm" />
          <span className="block w-3.5 h-[1.5px] bg-sensor rounded-sm" />
          <span className="block w-3.5 h-[1.5px] bg-sensor rounded-sm" />
        </button>
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="hsl(var(--primary))" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="4" fill="hsl(var(--primary))" />
          </svg>
          <span className="font-bold text-sm text-foreground">Falak</span>
        </div>
        <div className="w-9" />
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
        className={`fixed top-0 left-0 w-[260px] h-screen bg-background border-r border-border z-[600] transition-transform duration-250 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar isMobile onClose={() => setDrawerOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 md:pt-0 pt-[52px]">
        <Outlet />
      </main>
    </div>
  );
}
