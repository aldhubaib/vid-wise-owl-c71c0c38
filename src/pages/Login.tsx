import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--primary) / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-[380px] bg-surface border border-border rounded-lg p-10 flex flex-col items-center mx-4">
        <div className="mb-5">
          <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="hsl(var(--primary))" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="4" fill="hsl(var(--primary))" />
          </svg>
        </div>

        <h1 className="text-lg font-bold tracking-tight mb-1.5 text-center">
          Sign in to Falak
        </h1>
        <p className="text-[13px] text-dim text-center mb-8 leading-relaxed">
          YouTube channel intelligence<br />for Arabic content creators
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-elevated border border-border rounded-md text-foreground text-[13px] font-medium transition-all hover:bg-border hover:border-dim ${
            loading ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"
          }`}
        >
          {loading ? (
            <div className="w-3.5 h-3.5 border-2 border-border border-t-sensor rounded-full animate-spin-slow" />
          ) : (
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </button>

        <div className="w-full h-px bg-border my-6" />

        <div className="w-full bg-blue/[0.07] border border-blue/[0.15] rounded-md p-3 flex items-start gap-2.5">
          <span className="text-[13px] pt-px text-blue shrink-0">⊙</span>
          <p className="text-xs text-dim leading-relaxed">
            Access is restricted to <span className="text-sensor font-medium">approved accounts</span> only. Sign in with your authorized Google account to continue.
          </p>
        </div>

        <p className="mt-7 text-[11px] text-dim text-center font-mono">
          falak · v2.0 · yt intelligence
        </p>
      </div>
    </div>
  );
}
