"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PokemonType } from "@/types/pokemon";

export interface UseFavoritesOptions {
  storageKey?: string;
  initial?: PokemonType[];
  immediatePersist?: boolean;
}

export interface UseFavoritesReturn {
  items: PokemonType[];
  add: (item: PokemonType) => void;
  removeById: (id: string) => void;
  clear: () => void;
  isFavoriteById: (id: string) => boolean;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function arrayToMap(arr: PokemonType[]): Map<string, PokemonType> {
  const m = new Map<string, PokemonType>();
  for (const it of arr) m.set(it.id, it);
  return m;
}

function mapToArray(m: Map<string, PokemonType>): PokemonType[] {
  return Array.from(m.values());
}

export function useFavorites({
  storageKey = "favorites",
  initial = [],
  immediatePersist = true,
}: UseFavoritesOptions = {}): UseFavoritesReturn {
  const isClient = typeof window !== "undefined";
  const [map, setMap] = useState<Map<string, PokemonType>>(() => {
    if (typeof window === "undefined") return arrayToMap(initial);
    // recupera os dados do local storage
    const stored = safeParse<PokemonType[]>(
      window.localStorage.getItem(storageKey),
      initial
    );
    return arrayToMap(stored);
  });

  const dirtyRef = useRef(false);

  useEffect(() => {
    if (!isClient) return;
    const storedArr = safeParse<PokemonType[]>(
      window.localStorage.getItem(storageKey),
      initial
    );
    setMap(arrayToMap(storedArr));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, storageKey]);

  useEffect(() => {
    if (!isClient) return;
    if (!immediatePersist && !dirtyRef.current) return;
    try {
      const arr = mapToArray(map);
      window.localStorage.setItem(storageKey, JSON.stringify(arr));
      dirtyRef.current = false;
    } catch {
      console.log("deu erro aqui");
    }
  }, [isClient, map, storageKey, immediatePersist]);

  useEffect(() => {
    if (!isClient) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        const nextArr = safeParse<PokemonType[]>(e.newValue, initial);
        setMap(arrayToMap(nextArr));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isClient, storageKey, initial]);

  // adiciona um favorito
  const add = useCallback((item: PokemonType) => {
    setMap((prev) => {
      const next = new Map(prev);
      next.set(item.id, item);
      dirtyRef.current = true;
      return next;
    });
  }, []);

  // remove um favorito pelo id
  const removeById = useCallback((id: string) => {
    setMap((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      dirtyRef.current = true;
      return next;
    });
  }, []);

  // limpa tudo
  const clear = useCallback(() => {
    setMap(() => {
      dirtyRef.current = true;
      return new Map();
    });
  }, []);

  // verifica se é favorito pelo id
  const isFavoriteById = useCallback((id: string) => map.has(id), [map]);

  // retorna todos os itens salvos
  const items = useMemo(() => mapToArray(map), [map]);

  return {
    items,
    add,
    removeById,
    clear,
    isFavoriteById,
  };
}
