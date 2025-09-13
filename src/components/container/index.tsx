import { Footer } from "../footer";
import { Header } from "../header";

interface Props {
  children: React.ReactNode;
  title: string;
}

export function Container({ children, title }: Props) {
  return (
    <div className="w-full flex flex-col h-screen">
      <Header title={title} />
      <main className="w-full bg-white h-full overflow-y-scroll flex justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
