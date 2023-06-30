import { createContext } from "react";

export interface TableLoadContextType {
  isLoadingTable: boolean;
  setIsLoadingTable: (isLoadingTable: boolean) => void;
}

export const TableLoadContext = createContext<TableLoadContextType>({
  isLoadingTable: false,
  setIsLoadingTable: () => {},
});
