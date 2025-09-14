import { PokemonListType } from "@/types/pokemon";
import { PokemonItem } from "../pokemon-item";
import { FiGrid, FiMenu, FiStar, FiX } from "react-icons/fi";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  data: PokemonListType[];
  loading: boolean;
}

type ViewType = "list" | "grid";

export function PokemonList({ data, loading }: Props) {
  const [view, setView] = useState<ViewType>("grid");
  const [rawInput, setRawInput] = useState("");
  const [query, setQuery] = useState("");
  const debounceRef = useRef<number | null>(null);
  const pathname = usePathname();
  const isFavoritePage = pathname === "/favoritos";

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => setQuery(rawInput), 200);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [rawInput]);

  const norm = (s: string) =>
    s
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  const filtered = useMemo(() => {
    if (!query) return data;
    const q = norm(query);
    return data.filter((p) => norm(p.name).includes(q));
  }, [data, query]);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row items-center justify-between px-8 py-2 gap-3">
        <div className="w-full md:w-auto flex items-center gap-2 border border-gray-300 rounded-md px-2 py-1 bg-white">
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="outline-none text-gray-800 placeholder:text-gray-500 bg-transparent w-full"
            aria-label="Buscar Pokémon"
          />
          {rawInput && (
            <button
              onClick={() => {
                setRawInput("");
                setQuery("");
              }}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Limpar busca"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="flex flex-row items-center gap-2">
          {!isFavoritePage && (
            <Link href="/favoritos">
              <button
                className={`p-2 rounded-md cursor-pointer bg-orange-400`}
                title="Favoritos"
              >
                <FiStar className="text-xl text-white" />
              </button>
            </Link>
          )}

          <button
            className={`p-2 rounded-md cursor-pointer ${
              view === "grid"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-900 border border-gray-300"
            }`}
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            title="Grade"
          >
            <FiGrid className="text-xl" />
          </button>
          <button
            className={`p-2 rounded-md cursor-pointer ${
              view === "list"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-900 border border-gray-300"
            }`}
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            title="Lista"
          >
            <FiMenu className="text-xl" />
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div
          className={[
            "w-full px-4 py-4",
            "overflow-y-auto",
            view === "grid"
              ? "grid grid-cols-2 justify-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3"
              : "flex items-center flex-col gap-2",
          ].join(" ")}
        >
          {filtered.map((pokemon) => (
            <PokemonItem key={pokemon.name} type={view} data={pokemon} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 w-full py-10 flex justify-center items-center">
          {loading && "Carregando..."}
          {!loading &&
            query !== "" &&
            `Nenhum Pokémon encontrado para "${query}".`}
        </div>
      )}
    </div>
  );
}
