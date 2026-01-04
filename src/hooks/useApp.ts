import { useContext } from "react";
import { AppContext } from "../context/createAppContext";

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
