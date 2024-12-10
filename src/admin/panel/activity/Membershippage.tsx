//import { Link } from "react-router-dom"
import { RestoreMembershipAdmin } from "../activity/RestoreMembershipAdmin";
//import StopMembershipAdmin from "../components/StopMembershipAdmin"
import StopMembershipAdmin2 from "../activity/StopMembershipAdmin2";
import { useState } from "react";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./membershippage-translations";

const Membershipage: React.FunctionComponent = () => {
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
        {t.stopMembership}
      </p>
      <div
        className={`component-container ${isReportInjuryBlur ? "blurred" : ""}`}
        onClick={handleReportInjuryClick}
      >
        <StopMembershipAdmin2 />
      </div>

      <br></br>
      <br></br>

      <p className={`title ${isBackAfterInjuryBlur ? "blurred" : ""}`}>
        {t.restoreMembership}
      </p>
      <div
        className={`component-container ${
          isBackAfterInjuryBlur ? "blurred" : ""
        }`}
        onClick={handleBackAfterInjuryClick}
      >
        <RestoreMembershipAdmin />
      </div>
    </div>
  );
};

export default Membershipage;
