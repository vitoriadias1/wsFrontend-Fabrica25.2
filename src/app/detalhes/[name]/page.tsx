/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Container } from "@/components/container";
import { useFavorites } from "@/hooks/useFavorites";
import { api } from "@/services/api";
import { PokemonType } from "@/types/pokemon";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";

interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

const typeColors: Record<string, string> = {
  normal: "bg-slate-500 text-white",
  fire: "bg-red-500 text-white",
  water: "bg-blue-500 text-white",
  grass: "bg-green-500 text-white",
  electric: "bg-yellow-400 text-black",
  ice: "bg-cyan-400 text-black",
  fighting: "bg-orange-700 text-white",
  poison: "bg-purple-500 text-white",
  ground: "bg-yellow-700 text-white",
  flying: "bg-indigo-300 text-black",
  psychic: "bg-pink-500 text-white",
  bug: "bg-lime-500 text-black",
  rock: "bg-stone-600 text-white",
  ghost: "bg-violet-700 text-white",
  dark: "bg-gray-800 text-white",
  dragon: "bg-indigo-700 text-white",
  steel: "bg-gray-500 text-white",
  fairy: "bg-pink-300 text-black",
};

const defaultTypeClass = "bg-gray-200 text-black";

export default function Page({ params }: PageProps) {
  const { name } = use(params);
  const [pokemon, setPokemon] = useState<PokemonType | null>(null);
  const { add, isFavoriteById, removeById } = useFavorites();

  const getPokemon = async () => {
    const { data } = await api.get(`/pokemon/${name}`);

    setPokemon({
      id: data.id,
      name: data.name,
      image: data.sprites.other["official-artwork"].front_default,
      experience: data.base_experience,
      types: data.types.map((item: any) => item.type),
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

  const toggleFavorite = () => {
    if (isFavoriteById(pokemon?.id as string)) {
      removeById(pokemon?.id as string);
    } else {
      add(pokemon as PokemonType);
    }
  };

  return (
    <Container title={getTitle()}>
      {pokemon && (
        <div className="w-full justify-center items-center flex-col">
          <div className="w-full flex justify-end px-6">
            <div className="">
              <button
                className={`p-2 rounded-md cursor-pointer border border-gray-300 ${
                  isFavoriteById(pokemon?.id as string)
                    ? "bg-orange-400"
                    : "bg-white"
                }`}
                onClick={() => toggleFavorite()}
                title="Favoritos"
              >
                <FiStar
                  className={`text-xl ${
                    isFavoriteById(pokemon?.id as string)
                      ? "text-white"
                      : "text-orange-400"
                  }`}
                />
              </button>
            </div>
          </div>
          {pokemon && (
            <>
              <div className="w-full flex flex-col md:flex-row items-center justify-center">
                <div className="w-full md:w-[280px] flex justify-center items-center">
                  <Image
                    src={pokemon.image}
                    alt={pokemon.name}
                    width={150}
                    height={150}
                    className="w-[140px] md:w-[200px]"
                  />
                </div>
                <div className="flex w-full md:w-[200px] px-4 md:px-0 text-black items-center h-auto md:h-[200px] pt-4 md:pt-0">
                  <ul className="space-y-1.5">
                    <li>
                      <strong>Id:</strong> {pokemon.id}
                    </li>
                    <li className="capitalize">
                      <strong>Nome:</strong> {pokemon.name}
                    </li>
                    <li className="capitalize">
                      <strong>Tipo:</strong>{" "}
                      {pokemon.types.map((item) => (
                        <span
                          key={item.name}
                          className={`px-2 py-1 rounded-md text-sm mr-1 font-normal capitalize ${
                            typeColors[item.name] || defaultTypeClass
                          }`}
                        >
                          {item.name}
                        </span>
                      ))}
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
      )}
    </Container>
  );
}
