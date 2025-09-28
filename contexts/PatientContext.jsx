"use client";

import { createContext, useContext } from "react";

const PatientContext = createContext(null);

export const PatientProvider = ({ value, children }) => {
  return (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};
