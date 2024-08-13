//import { Link } from "react-router-dom"
//import { BackAfterInjuryUser } from "../components/BackAfterInjuryUser"
import BackAfterInjuryUser2 from "./BackAfterInjuryUser2";
import { ReportInjuryUser2 } from "./ReportInjuryUser2";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/auth/UserContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../App";

const InjuryUserpage: React.FunctionComponent = () => {
  const { currentUser } = useContext(UserContext);
  const [stopReported, setStopReported] = useState<boolean>(false);
  const [pausaReported, setPausaReported] = useState<boolean>(false);

  const [isReportMemBlur, setIsReportMemBlur] = useState(true);

  const checkingFunc = async () => {
    if (currentUser) {
      const userRef = doc(db, "usersData", currentUser?.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        //jesli mamy stop
        if (docSnap.data().stop) {
          setStopReported(true);
        }
        // jesli mamy pause
        if (docSnap.data().pause) {
          setPausaReported(true);
        }
      }
    }
  };

  useEffect(() => {
    checkingFunc();
    // console.log("czy mamy tutaj info",stopReported,pausaReported)
  }, [db, currentUser]);

  const handleReportMemClick = () => {
    setIsReportMemBlur(false);
  };

  return (
    <div>
      {stopReported && (
        <p className="titleAlert">Twoje treningi są juz zakończone</p>
      )}
      {!stopReported && !pausaReported && (
        <p className="title">
          Jeżeli chcesz zgłosić kontuzję lub chorobe kliknij poniżej
        </p>
      )}

      <div className="mem-page-container">
        <p className={`title ${isReportMemBlur ? "blurred" : ""}`}></p>
        <div
          className={`component-container ${isReportMemBlur ? "blurred" : ""}`}
          onClick={handleReportMemClick}
        >
          <ReportInjuryUser2 />
        </div>
      </div>
      {pausaReported && (
        <p className="titleAlert">Treningi sa zawieszone z powodu kontuzji</p>
      )}
      {!stopReported && pausaReported && (
        <p className="title">Jeżeli chcesz zgłosić powrót kliknij poniżej</p>
      )}

      <div className="mem-page-container">
        <p className={`title ${isReportMemBlur ? "blurred" : ""}`}></p>
        <div
          className={`component-container ${isReportMemBlur ? "blurred" : ""}`}
          onClick={handleReportMemClick}
        >
          <BackAfterInjuryUser2 />
        </div>
      </div>
    </div>
  );
};

export default InjuryUserpage;
