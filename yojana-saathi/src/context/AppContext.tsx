"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Language, CitizenProfile } from "@/types";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isVolunteerMode: boolean;
  setIsVolunteerMode: (v: boolean) => void;
  profile: CitizenProfile;
  setProfile: (p: CitizenProfile) => void;
  resetProfile: () => void;
}

const defaultProfile: CitizenProfile = {
  state: null,
  district: null,
  age: null,
  gender: null,
  annualHouseholdIncome: null,
  occupation: null,
  educationLevel: null,
  socialCategory: null,
  disabilityStatus: null,
  isFarmer: null,
  landHoldingAcres: null,
  documentsAvailable: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isVolunteerMode, setIsVolunteerMode] = useState(false);
  const [profile, setProfile] = useState<CitizenProfile>({ ...defaultProfile });

  const resetProfile = () => setProfile({ ...defaultProfile });

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        isVolunteerMode,
        setIsVolunteerMode,
        profile,
        setProfile,
        resetProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}

export { defaultProfile };
