"use client";
import { createContext, useContext } from "react";

const ReceptionistContext = createContext();

export const ReceptionistProvider = ({ children, value }) => (
  <ReceptionistContext.Provider value={value}>{children}</ReceptionistContext.Provider>
);

export const useReceptionist = () => useContext(ReceptionistContext);
