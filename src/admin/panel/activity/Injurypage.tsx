//import { Link } from "react-router-dom"
//import { BackAfterInjury } from "../components/stop/BackAfterInjuryAdmin"
import { BackAfterInjuryAdmin2 } from "../activity/BackAfterInjuryAdmin2";
import ReportInjuryAdmin2 from "../activity/ReportInjuryAdmin2";
import "../pages/adminBlurredpages.css";
import { useState } from "react";

const Injurypage: React.FunctionComponent = () => {
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
        Oznacz kontuzję użytkownika
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
        Oznacz powrót użytkownika po kontuzji
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

// const Injurypage: React.FunctionComponent =() => {

//     return(

//         <div>
//           <p className="title"> Oznacz kontuzję użytkownika</p>
//             <ReportInjuryAdmin2/>

// <br></br><br></br>
// <p className="title"> Oznacz powrót uzytkownika po kontuzji</p>
//             <BackAfterInjuryAdmin2/>

//         </div>
//     )

// }

export default Injurypage;
