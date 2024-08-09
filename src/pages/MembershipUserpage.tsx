
import { useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../App";
import { UserContext } from "../utils/auth/UserContext";
// import { BackAfterInjuryUser } from "../components/BackAfterInjuryUser";
import { RestoreMembershipUser } from "../components/stop/RestoreMembershipUser";
import StopMembershipUser from "../components/stop/StopMembershipUser";


const MembershiUserpage: React.FunctionComponent = () => {
    const { currentUser } = useContext(UserContext);
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
    
    //   const handleBackAfterMemClick = () => {
    //     setIsReportMemBlur(true);
    //     setIsBackAfterMemBlur(false);
    //   };

    return (
        <div>
            {!stopReported && <p className="title">Jeżeli chcesz zatrzymać treningi z końcem opłaconego okresu, kliknij poniżej</p>}
            
       <div className="mem-page-container"> 

            <p className={`title ${isReportMemBlur ? "blurred" : ""}`}>
            
           </p>
                 <div
                     className={`component-container ${
                    isReportMemBlur ? "blurred" : ""
                      }`}
                    onClick={handleReportMemClick}
                     >
                    <StopMembershipUser />
                </div>
      </div>
                
          

            <br />
            {stopReported && <p className="titleAlert">Twoje treningi są juz zakończone</p>}
            {stopReported && <p className="title"> Jeśli chcesz zgłosić powrót, kliknij poniżej</p>}
            
            <div className="mem-page-container"> 
     
                 <p className={`title ${isReportMemBlur ? "blurred" : ""}`}>
                 
                </p>
                      <div
                          className={`component-container ${
                         isReportMemBlur ? "blurred" : ""
                           }`}
                         onClick={handleReportMemClick}
                          >
                          <RestoreMembershipUser />
                      </div>
            </div>
           
       
       </div>);
};





// const MembershiUserpage: React.FunctionComponent = () => {
//     const { currentUser } = useContext(UserContext);
//     const [stopReported, setStopReported] = useState<boolean>(false);
//     const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

//     const checkingFunc = async () => {
//         if (currentUser) {
//             const userRef = doc(db, "usersData", currentUser?.uid);
//             const docSnap = await getDoc(userRef);

//             if (docSnap.exists()) {
//                 if (docSnap.data().stop) {
//                     setStopReported(true);
//                 }
//             }
//         }
//     };

//     useEffect(() => {
//         checkingFunc();
//     }, [db, currentUser]);

//     const handleStopClick = () => {
//         setSelectedComponent("StopMembershipUser");
//     };

//     const handleRestoreClick = () => {
//         setSelectedComponent("RestoreMembershipUser");
//     };

//     return (
//         <div>
//             {!stopReported && <p className="title">Jeżeli chcesz zatrzymać treningi z końcem opłaconego okresu, kliknij poniżej</p>}
//             <StopMembershipUser className={`component-container ${selectedComponent === "StopMembershipUser" ? "" : "blurred"}`} onClick={handleStopClick}/>

//             <br />

//             {stopReported && <p className="title">Twoje treningi są zatrzymane. Jeśli chcesz zgłosić powrót, kliknij poniżej</p>}
//             <RestoreMembershipUser className={`component-container ${selectedComponent === "RestoreMembershipUser" ? "blurred" : ""}`} onClick={handleRestoreClick} />
//         </div>   
//     );
// };
export default MembershiUserpage;


