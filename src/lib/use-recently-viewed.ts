"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) setIds(parsed);
      }
    } catch {}
  }, []);

  const addId = (id: string) => {
    setIds((prev) => {
      const next = [id, ...prev.filter((i) => i !== id)].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { ids, addId };
}
