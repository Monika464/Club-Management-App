//import { Link } from "react-router-dom"
import { RestoreMembershipAdmin } from "../activity/RestoreMembershipAdmin";
//import StopMembershipAdmin from "../components/StopMembershipAdmin"
import StopMembershipAdmin2 from "../activity/StopMembershipAdmin2";
import { useState } from "react";

const Membershipage: React.FunctionComponent = () => {
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
        Zatrzymaj członkostwo wybranego użytkownika
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
        Oznacz powrót użytkownika do klubu
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
