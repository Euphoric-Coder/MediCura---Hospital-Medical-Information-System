"use client";
import { createContext, useContext } from "react";

const DoctorContext = createContext();

export const DoctorProvider = ({ children, value }) => (
  <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
);

export const useDoctor = () => useContext(DoctorContext);
