import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../App";
import { UserContext } from "../../utils/auth/UserContext";
// import { BackAfterInjuryUser } from "../components/BackAfterInjuryUser";
import { RestoreMembershipUser } from "./RestoreMembershipUser";
//import StopMembershipUser from "../components/stop/StopMembershipUser";
import StopMembershipUser2 from "./StopmembershipUser2";
import { useLanguage } from "../../utils/context/LanguageContext";
import translations from "./membershipuserpage-translation";

const MembershiUserpage: React.FunctionComponent = () => {
  const { currentUser } = useContext(UserContext);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const [stopReported, setStopReported] = useState<boolean>(false);
  //const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const [isReportMemBlur, setIsReportMemBlur] = useState(true);
  //const [isBackAfterMemBlur, setIsBackAfterMemBlur] = useState(false);

  const checkingFunc = async () => {
    if (currentUser) {
      const userRef = doc(db, "usersData", currentUser?.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        if (docSnap.data().stop) {
          setStopReported(true);
        }
      }
    }
  };

  useEffect(() => {
    checkingFunc();
  }, [db, currentUser]);

  const handleReportMemClick = () => {
    setIsReportMemBlur(false);
    //setIsBackAfterMemBlur(true);
  };

  return (
    <div>
      {!stopReported && <p className="title">{t.ifYouWantToStop}</p>}

      <div className="mem-page-container">
        <p className={`title ${isReportMemBlur ? "blurred" : ""}`}></p>
        <div
          className={`component-container ${isReportMemBlur ? "blurred" : ""}`}
          onClick={handleReportMemClick}
        >
          {/* <StopMembershipUser /> */}
          <StopMembershipUser2 />
        </div>
      </div>

      <br />
      {stopReported && <p className="titleAlert">{t.yourTrainingsEnded}</p>}
      {stopReported && <p className="title"> {t.ifYouWantToReturn}</p>}

      <div className="mem-page-container">
        <p className={`title ${isReportMemBlur ? "blurred" : ""}`}></p>
        <div
          className={`component-container ${isReportMemBlur ? "blurred" : ""}`}
          onClick={handleReportMemClick}
        >
          <RestoreMembershipUser />
        </div>
      </div>
    </div>
  );
};

export default MembershiUserpage;
