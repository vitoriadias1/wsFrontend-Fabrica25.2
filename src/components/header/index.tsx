interface Props {
  title: string;
}

export function Header({ title }: Props) {
  return (
    <header className="w-full bg-red-900 h-[60px] flex justify-center items-center">
      <h1 className="text-white font-bold">{title}</h1>
    </header>
  );
}
