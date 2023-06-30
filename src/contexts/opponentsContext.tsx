import { createContext } from "react";

export interface OpponentsContextType {
  opponents: string[];
  setOpponents: (opponents: string[]) => void;
}

export const OpponentsContext = createContext<OpponentsContextType>({
  opponents: [],
  setOpponents: () => {},
});
