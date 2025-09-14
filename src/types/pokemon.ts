interface Type {
  name: string;
}

export interface PokemonType {
  id: string;
  name: string;
  image: string;
  types: Type[];
  weight: string;
  experience: string;
}

export interface PokemonListType {
  name: string;
  id: string;
  image: string;
}
