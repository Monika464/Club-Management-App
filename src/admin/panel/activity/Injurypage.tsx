import React from "react";
import { BackAfterInjuryAdmin2 } from "../activity/BackAfterInjuryAdmin2";
import ReportInjuryAdmin2 from "../activity/ReportInjuryAdmin2";
import "../pages/adminBlurredpages.css";
import { useState } from "react";

import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./injurypage-translations";

const Injurypage: React.FunctionComponent = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const [isReportInjuryBlur, setIsReportInjuryBlur] = useState(false);
  const [isBackAfterInjuryBlur, setIsBackAfterInjuryBlur] = useState(false);

  const handleReportInjuryClick = () => {
    setIsReportInjuryBlur(false);
    setIsBackAfterInjuryBlur(true);
  };

  const handleBackAfterInjuryClick = () => {
    setIsReportInjuryBlur(true);
    setIsBackAfterInjuryBlur(false);
  };

  return (
    <div className="injury-page-container">
      <p className={`title ${isReportInjuryBlur ? "blurred" : ""}`}>
        {t.reportInjury}
      </p>
      <div
        className={`component-container ${isReportInjuryBlur ? "blurred" : ""}`}
        onClick={handleReportInjuryClick}
      >
        <ReportInjuryAdmin2 />
      </div>

      <br></br>
      <br></br>

      <p className={`title ${isBackAfterInjuryBlur ? "blurred" : ""}`}>
        {t.backAfterInjury}
      </p>
      <div
        className={`component-container ${
          isBackAfterInjuryBlur ? "blurred" : ""
        }`}
        onClick={handleBackAfterInjuryClick}
      >
        <BackAfterInjuryAdmin2 />
      </div>
    </div>
  );
};

export default Injurypage;
