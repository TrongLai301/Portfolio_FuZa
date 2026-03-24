import { createContext, useContext } from "react";

interface EnterContextType {
  isEntered: boolean;
  enter: () => void;
}

export const EnterContext = createContext<EnterContextType>({
  isEntered: false,
  enter: () => {},
});

export const useEnter = () => useContext(EnterContext);
