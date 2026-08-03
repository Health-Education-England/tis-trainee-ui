import { useState } from "react";

const STORAGE_KEY = "tss-dismissed-announcements";

function readDismissedIds(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useDismissedAnnouncements() {
  const [dismissedIds, setDismissedIds] = useState<string[]>(readDismissedIds);

  const dismiss = (id: string) => {
    const updatedIds = [...dismissedIds, id];
    setDismissedIds(updatedIds);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds));
  };

  return { dismissedIds, dismiss };
}
