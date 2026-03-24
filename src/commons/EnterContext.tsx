import { useState, useEffect, type ReactNode } from "react";
import { EnterContext } from "./useEnterContext";

export function EnterProvider({ children }: { children: ReactNode }) {
  const [isEntered, setIsEntered] = useState(false);

  const enter = () => setIsEntered(true);

  useEffect(() => {
    if (!isEntered) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEntered]);

  return (
    <EnterContext.Provider value={{ isEntered, enter }}>
      {children}
    </EnterContext.Provider>
  );
}
