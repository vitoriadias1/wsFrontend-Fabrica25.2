import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  title: string;
}

export function Header({ title }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  return (
    <header className="w-full md:w-[600px] h-[100px] flex justify-between items-center bg-white/95 rounded-xl my-4 relative pokemon-shadow">
      {!isHomePage && (
        <div className="px-4 w-[60px] flex justify-center items-center z-30">
          <button
            onClick={() => router.back()}
            className="w-full cursor-pointer"
          >
            <FiChevronLeft className="text-black text-3xl font-bold" />
          </button>
        </div>
      )}
      <div className="flex absolute w-full h-full top-0 left-0 border-0 justify-center items-center">
        <h1 className="text-xl font-bold text-gray-800 capitalize">{title}</h1>
      </div>
    </header>
  );
}
