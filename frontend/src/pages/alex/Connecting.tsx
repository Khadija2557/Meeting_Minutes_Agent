import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import alexAvatar from "@/assets/meeting-followup-agent.png";
import { fetchMeetings } from "@/lib/api";

export default function AlexConnecting() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);

  // Tunables: min screen time and optional safety max (not used by default)
  const minDurationMs = 2300; // ~2.3s for a smooth feel

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      if (!cancelled) setMinElapsed(true);
    }, minDurationMs);

    // Use a lightweight readiness probe. If backend responds, we consider Alex ready.
    fetchMeetings(1)
      .then(() => !cancelled && setReady(true))
      .catch(() => {
        // If readiness probe fails, we still allow transition after min duration
        // to avoid hanging; Alex dashboard has its own loading/error states.
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // Transition when either backend is ready OR minimum display time elapsed
    if (ready || minElapsed) {
      const t = setTimeout(() => navigate("/alex/dashboard"), 150);
      return () => clearTimeout(t);
    }
  }, [ready, minElapsed, navigate]);

  const statusText = useMemo(() => {
    if (!minElapsed && !ready) return "Initializing...";
    if (ready && !minElapsed) return "Alex is ready";
    return "Connecting to Alex...";
  }, [ready, minElapsed]);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="relative w-full max-w-xl mx-auto flex flex-col items-center gap-6 p-8">
        {/* Soft pulsing beam background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-pink/10 blur-2xl animate-alex-beam" />
        </div>

        {/* Alex avatar with subtle breathing animation */}
        <div className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-pink/20 shadow-md bg-white flex items-center justify-center animate-breathe">
          <img src={alexAvatar} alt="Alex" className="w-full h-full object-cover" />
        </div>

        {/* Status text */}
        <div className="relative z-10 text-center">
          <p className="text-xl md:text-2xl font-semibold text-foreground mb-2">Connecting to Alex...</p>
          <p className="text-sm text-muted-foreground">{statusText}</p>
        </div>

        {/* Minimal loading indicator */}
        <div className="relative z-10 mt-2">
          <div className="w-8 h-8 rounded-full border-2 border-pink/30 border-t-pink/70 animate-spin" />
        </div>
      </div>
    </div>
  );
}
