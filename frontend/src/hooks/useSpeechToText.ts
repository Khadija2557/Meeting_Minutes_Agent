import { useCallback, useEffect, useRef, useState } from "react";

export type STTStatus = "idle" | "listening" | "unsupported" | "error";

export function useSpeechToText() {
  const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const [status, setStatus] = useState<STTStatus>(Recognition ? "idle" : "unsupported");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (!Recognition) return;
    const rec = new Recognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event: any) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        finalText += result[0].transcript;
      }
      setTranscript(prev => {
        // If listening, replace interim text; keep it simple
        return finalText.trim();
      });
    };

    rec.onerror = (e: any) => {
      setError(e?.error || "speech-error");
      setStatus("error");
    };

    rec.onend = () => {
      if (status === "listening") {
        // Auto-restart for uninterrupted listening
        try {
          rec.start();
        } catch {
          // ignore
        }
      }
    };

    recognitionRef.current = rec;
    return () => {
      try { rec.stop(); } catch {}
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setTranscript("");
      setError(null);
      setStatus("listening");
      recognitionRef.current.start();
    } catch (e: any) {
      setError(e?.message || "Unable to start speech recognition");
      setStatus("error");
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.onend = null; // prevent auto-restart
      recognitionRef.current.stop();
      setStatus("idle");
    } catch (e: any) {
      setError(e?.message || "Unable to stop speech recognition");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
    setStatus(Recognition ? "idle" : "unsupported");
  }, [Recognition]);

  return {
    supported: !!Recognition,
    status,
    transcript,
    error,
    start,
    stop,
    reset,
    isListening: status === "listening",
  };
}
