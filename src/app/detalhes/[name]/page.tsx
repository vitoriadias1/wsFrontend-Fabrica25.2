"use client";

import { Container } from "@/components/container";
import { api } from "@/services/api";
import { PokemonType } from "@/types/pokemon";
import Image from "next/image";
import { use, useEffect, useState } from "react";

interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

export default function Page({ params }: PageProps) {
  const { name } = use(params);
  const [pokemon, setPokemon] = useState<PokemonType | null>(null);

  const getPokemon = async () => {
    const { data } = await api.get(`/pokemon/${name}`);

    setPokemon({
      id: data.id,
      name: data.name,
      image: data.sprites.other["official-artwork"].front_default,
      experience: data.base_experience,
      type: data.types[0].type.name,
      url: "",
      weight: data.weight,
    });
  };

  useEffect(() => {
    if (name) {
      getPokemon();
    }
  }, [name]);

  /**
   * Condicional padrão
   * @returns String
   */
  const getTitle = () => {
    if (pokemon) {
      return `Pokemon: ${pokemon.name}`;
    } else {
      return "Carregando...";
    }
  };

  /**
   * Condicional Ternário
   */
  // const title = `${pokemon ? 'Pokemon: ' + pokemon.name : "Carregando..."} `

  return (
    <Container title={getTitle()}>
      <div className="w-[200px]">
        {pokemon && (
          <>
            <div className="w-full">
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                width={200}
                height={200}
              />
              <div className="w-full text-black">
                <ul>
                  <li>
                    <strong>Id:</strong> {pokemon.id}
                  </li>
                  <li>
                    <strong>Nome:</strong> {pokemon.name}
                  </li>
                  <li>
                    <strong>Tipo:</strong> {pokemon.type}
                  </li>
                  <li>
                    <strong>Peso:</strong> {pokemon.weight}
                  </li>
                  <li>
                    <strong>Experiencia:</strong> {pokemon.experience}
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
