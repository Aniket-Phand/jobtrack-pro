import { createContext, useContext } from "react";

export const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);