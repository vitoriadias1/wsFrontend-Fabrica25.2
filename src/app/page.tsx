"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "../services/api";
import { PokemonListType } from "@/types/pokemon";
import { Container } from "@/components/container";
import { PokemonList } from "@/components/pokemon-list";
import { useCache } from "@/hooks/useCache";

const BATCH_SIZE = 40;

export default function Home() {
  const { items: cached, setItems: setCache } = useCache({
    storageKey: "pokemons:list",
    initial: [],
  });

  const [pokemons, setPokemons] = useState<PokemonListType[]>(cached);
  const [loading, setLoading] = useState(pokemons.length === 0);

  useEffect(() => {
    if (cached.length > 0) setPokemons(cached);
  }, [cached]);

  const chunk = <T,>(arr: T[], size: number): T[][] => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };

  const toListItem = (detail: any): PokemonListType => ({
    id: detail.id,
    name: detail.name,
    image:
      detail?.sprites?.other?.["official-artwork"]?.front_default ??
      detail?.sprites?.front_default ??
      "",
  });

  const getPokemons = async () => {
    try {
      if (cached.length > 0) {
        setPokemons(cached);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data } = await api.get("/pokemon?limit=1500");
      const names: string[] = data.results.map((r: any) => r.name);

      const batches = chunk(names, BATCH_SIZE);
      const acc: PokemonListType[] = [];

      for (const group of batches) {
        const results = await Promise.allSettled(
          group.map(async (name) => {
            const { data: detail } = await api.get(`/pokemon/${name}`);
            return toListItem(detail);
          })
        );

        for (const r of results) {
          if (r.status === "fulfilled") acc.push(r.value);
        }
      }

      acc.sort((a, b) => Number(a.id) - Number(b.id));
      setPokemons(acc);
      setCache(acc);
    } catch (err) {
      console.error("Erro ao buscar pokemons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pokemons.length === 0) getPokemons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = useMemo(
    () =>
      `Listagem de Pokémons${pokemons.length ? ` (${pokemons.length})` : ""}`,
    [pokemons.length]
  );

  return (
    <Container title={title}>
      <PokemonList data={pokemons} loading={loading} />
    </Container>
  );
}
