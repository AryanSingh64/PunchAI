import { useState, useCallback } from "react";

const HISTORY_KEY = "studyai-history";
const MAX_HISTORY = 10;

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch {
    // localStorage full — ignore
  }
}

export function useHistory() {
  const [history, setHistory] = useState(loadFromStorage);

  const saveSession = useCallback((data) => {
    const session = {
      id: Date.now(),
      topic: data.topic || "Study Session",
      cardCount: data.cards?.length || 0,
      quizCount: data.quiz?.length || 0,
      createdAt: new Date().toISOString(),
      data,
    };
    setHistory((prev) => {
      const filtered = prev.filter((s) => s.topic !== session.topic);
      const updated = [session, ...filtered].slice(0, MAX_HISTORY);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeSession = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return { history, saveSession, removeSession, clearAll };
}
