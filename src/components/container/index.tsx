import Image from "next/image";
import { Footer } from "../footer";
import { Header } from "../header";
import "./styles.css";

interface Props {
  children: React.ReactNode;
  title: string;
}

export function Container({ children, title }: Props) {
  return (
    <div className="bg-background-mobile md:bg-background-desktop w-full flex flex-col h-screen justify-center items-center px-4 md:px-0">
      {/* Logo Pokemon */}
      <div className="w-full h-[250px] flex justify-center items-center">
        <Image src="/pokemon.svg" alt="Pokemon Logo" width={250} height={250} />
      </div>

      <Header title={title} />
      <main className="w-full md:w-[600px] h-full overflow-y-hidden flex justify-center bg-white/95 rounded-xl minimal-scrollbar py-2 pokemon-shadow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
