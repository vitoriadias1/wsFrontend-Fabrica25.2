"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PokemonListType } from "@/types/pokemon";

export interface UseCacheOptions {
  storageKey?: string;
  initial?: PokemonListType[];
  immediatePersist?: boolean;
}

export interface UseCacheReturn {
  items: PokemonListType[];
  setItems: (arr: PokemonListType[]) => void; // sobrescreve tudo
  addMany: (arr: PokemonListType[]) => void; // acrescenta vários
  addOne: (item: PokemonListType) => void; // acrescenta 1
  clear: () => void;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useCache({
  storageKey = "cache:list",
  initial = [],
  immediatePersist = true,
}: UseCacheOptions = {}): UseCacheReturn {
  const isClient = typeof window !== "undefined";
  const dirtyRef = useRef(false);

  // 🔑 carrega do localStorage já no inicializador
  const [items, setItemsState] = useState<PokemonListType[]>(() => {
    if (typeof window === "undefined") return initial;
    return safeParse<PokemonListType[]>(
      window.localStorage.getItem(storageKey),
      initial
    );
  });

  // persiste quando mudar
  useEffect(() => {
    if (!isClient) return;
    if (!immediatePersist && !dirtyRef.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
      dirtyRef.current = false;
    } catch {
      console.warn("falha ao salvar cache");
    }
  }, [isClient, items, storageKey, immediatePersist]);

  // sincroniza entre abas
  useEffect(() => {
    if (!isClient) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const next = safeParse<PokemonListType[]>(e.newValue, initial);
        setItemsState(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isClient, storageKey, initial]);

  // helpers
  const setItems = useCallback((arr: PokemonListType[]) => {
    setItemsState(arr);
    dirtyRef.current = true;
  }, []);

  const addMany = useCallback((arr: PokemonListType[]) => {
    setItemsState((prev) => {
      const merged = [...prev, ...arr];
      dirtyRef.current = true;
      return merged;
    });
  }, []);

  const addOne = useCallback((item: PokemonListType) => {
    setItemsState((prev) => {
      const merged = [...prev, item];
      dirtyRef.current = true;
      return merged;
    });
  }, []);

  const clear = useCallback(() => {
    setItemsState([]);
    dirtyRef.current = true;
  }, []);

  return { items, setItems, addMany, addOne, clear };
}
