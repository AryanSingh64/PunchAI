import { useRef, useState, useCallback } from "react";
import { validateStudyData } from "../lib/schema";

const TIMEOUT_MS = 15000;

export function useAI() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [rawError, setRawError] = useState(null);
  const abortRef = useRef(null);
  const requestIdRef = useRef(0);

  const generate = useCallback(async (text, mode, onSuccess) => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const thisRequestId = ++requestIdRef.current;

    setStatus("loading");
    setError(null);
    setRawError(null);

    // Timeout
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const customGeminiKey = localStorage.getItem("punchai-gemini-key") || "";
    const customGroqKey = localStorage.getItem("punchai-groq-key") || "";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customGeminiKey ? { "x-gemini-key": customGeminiKey } : {}),
          ...(customGroqKey ? { "x-groq-key": customGroqKey } : {}),
        },
        body: JSON.stringify({ text, mode }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Stale response guard — another request was made after this one
      if (thisRequestId !== requestIdRef.current) return;

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Server error: ${res.status}`);
      }

      const raw = await res.json();

      // Validate shape with Zod
      const { data, error: validationError } = validateStudyData(raw);
      if (validationError) {
        throw new Error(validationError);
      }

      setStatus("success");
      onSuccess(data);
    } catch (err) {
      clearTimeout(timeoutId);
      if (thisRequestId !== requestIdRef.current) return;

      if (err.name === "AbortError") {
        setStatus("error");
        setError("Request timed out. Please try again.");
      } else {
        setStatus("error");
        setError(err.message || "Something went wrong.");
        if (err.raw) setRawError(err.raw);
      }
    }
  }, []);

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setStatus("idle");
    setError(null);
    setRawError(null);
  }, []);

  return { status, error, rawError, generate, reset };
}
