import { createContext } from "react";

export interface GamesContextType {
  games: Game[];
  setGames: (games: Game[]) => void;
}

export const GamesContext = createContext<GamesContextType>({
  games: [],
  setGames: () => {},
});
