import React, { createContext, useContext, useState, ReactNode } from "react";

// Typy dla kontekstu
type Language = "en" | "pl";

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
}

// Domyślna wartość kontekstu
const defaultValue: LanguageContextType = {
  currentLanguage: "en",
  setCurrentLanguage: () => {},
};

// Tworzenie kontekstu
export const LanguageContext = createContext<LanguageContextType>(defaultValue);

// Typ dla komponentu Provider
interface LanguageProviderProps {
  children: ReactNode;
}

// Provider dla kontekstu
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook do użycia kontekstu
export const useLanguage = () => useContext(LanguageContext);

//https://www.youtube.com/watch?v=nTQ-PfUqDvM&t=744s
