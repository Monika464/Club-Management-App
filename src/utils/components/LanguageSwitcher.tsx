import React from "react";
import { useLanguage } from "../context/LanguageContext";
const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguage();

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === "en" ? "pl" : "en");
  };

  return (
    <div>
      <p>Current language: {currentLanguage}</p>
      <button onClick={toggleLanguage}>
        Switch to {currentLanguage === "en" ? "Polski" : "English"}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
