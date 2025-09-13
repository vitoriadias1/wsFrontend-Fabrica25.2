"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";
import { PokemonListType } from "@/types/pokemon";
import { PokemonItem } from "@/components/pokemon-item";
import { Container } from "@/components/container";

export default function Home() {
  const [pokemons, setPokemons] = useState<PokemonListType[]>([]);

  const getpokemons = async () => {
    const { data } = await api.get("/pokemon?limit=100");

    setPokemons(
      data.results.map((item: any) => {
        return {
          name: item.name,
        };
      })
    );
  };

  useEffect(() => {
    if (pokemons.length === 0) {
      getpokemons();
    }
  }, [pokemons]);

  return (
    <Container title="Listagem de Pokemons">
      <div className="w-[200px]">
        {pokemons.map((pokemon) => (
          <PokemonItem data={pokemon} key={pokemon.name} />
        ))}
      </div>
    </Container>
  );
}
