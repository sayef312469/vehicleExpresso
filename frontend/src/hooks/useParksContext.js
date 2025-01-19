import { ParksContext } from "../context/ParksContext";
import { useContext } from "react";

export const useParksContext = () => {
  const context = useContext(ParksContext);

  if (!context) {
    throw Error("useParksContext must be used inside a ParksContextProvider");
  }

  return context;
};
