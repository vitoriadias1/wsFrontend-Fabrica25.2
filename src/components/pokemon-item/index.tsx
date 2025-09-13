import { PokemonListType } from "@/types/pokemon";
import Link from "next/link";

interface Props {
  data: PokemonListType;
}

export function PokemonItem({ data }: Props) {
  return (
    <Link href={`/detalhes/${data.name}`}>
      <div className="w-full h-[30px] bg-blue-900 flex justify-center items-center">
        <p className="text-white">{data.name}</p>
      </div>
    </Link>
  );
}
