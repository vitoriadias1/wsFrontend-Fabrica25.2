import { PokemonListType } from "@/types/pokemon";
import Image from "next/image";
import Link from "next/link";

interface Props {
  data: PokemonListType;
  type: "grid" | "list";
}

export function PokemonItem({ data, type }: Props) {
  return (
    <Link href={`/detalhes/${data.name}`}>
      <div
        className={`flex justify-center items-center py-2 flex-col text-center ${
          type === "grid"
            ? "h-[120px] w-full md:w-[140px] border border-gray-300 rounded-xl"
            : "h-[100px] w-full md:w-[250px]"
        }`}
      >
        <div className="w-[80px] flex justify-center">
          <Image src={data.image} alt={data.name} width={60} height={60} />
        </div>
        <p className="text-gray-800 text-md capitalize text-sm">#{data.id}</p>
        <p className="text-gray-800 text-md capitalize text-sm">{data.name}</p>
      </div>
    </Link>
  );
}
