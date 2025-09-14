"use client";

import { Container } from "@/components/container";
import { PokemonList } from "@/components/pokemon-list";
import { useFavorites } from "@/hooks/useFavorites";

export default function Page() {
  const { items } = useFavorites();

  return (
    <Container title="Favoritos">
      <PokemonList data={items} loading={false} />
    </Container>
  );
}
