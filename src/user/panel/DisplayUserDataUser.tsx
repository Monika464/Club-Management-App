//import { useFetchDates } from "../../hooks/useFetchDates";
//import { useFetchUsers } from "../../hooks/useFetchUsers";
import { useSearchIndexCloseToday } from "../../utils/hooks/useSearchIndexCloseToday";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/auth/UserContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../App";
import { useSearchDatesPlusN } from "../../utils/hooks/useSearchDatesPlusN";
import "./displayUserDataUser.css";
import { format } from "date-fns";
export interface IDisplayUserDataUser {}

export interface ITimestampObject {
  toMillis(): number | Date;
  seconds: number;
  nanoseconds: number;
}

export const DisplayUserDataUser: React.FunctionComponent<
  IDisplayUserDataUser
> = () => {
  const [debt, setDebt] = useState<number | null>(null);
  const [add, setAdd] = useState<number | null>(null);
  const [isMulti, setIsMulti] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(false);
  const [isPause, setIsPause] = useState<boolean>(false);
  const [isStop, setisStop] = useState<boolean>(false);
  const [due, setDue] = useState<ITimestampObject | null>(null);
  const [rendered, setRendered] = useState(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const { currentUser } = useContext(UserContext);
  const dzisIndex = useSearchIndexCloseToday();
  const paymentDateIndex = useSearchDatesPlusN(0, currentUser?.uid);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRendered(true);
    }, 1000); // 1000 milisekund = 1 sekunda

    return () => {
      clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
    };
  }, []);

  const getUserDatafromBase = useCallback(async () => {
    // console.log('paymentDateIndex',paymentDateIndex, "dis index",dzisIndex )
    if (currentUser) {
      const userRef = doc(db, "usersData", currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        //multi
        if (docSnap.data().optionMulti === true) {
          // console.log("optionMulti",docSnap.data().optionMulti === true)
          setIsMulti(true);
          // console.log("optionMulti",isMulti)
        }
        //pass
        if (docSnap.data().optionPass === true) {
          // console.log("optionPass",docSnap.data().optionPass === true)
          setIsPass(true);
        }
        //debt
        if (docSnap.data().debt) {
          // console.log("czy tu jest debt",docSnap.data().debt)
          setDebt(docSnap.data().debt);
        }

        //add
        if (docSnap.data().add) {
          setAdd(docSnap.data().add);
        }

        //due
        if (docSnap.data().due) {
          setDue(docSnap.data().due);
          //console.log("czy due",due?.toMillis().toString())
        }
        //pause
        if (docSnap.data().pause) {
          setIsPause(true);
        }

        //stop
        if (docSnap.data().stop) {
          setisStop(docSnap.data().stop);
        }
      }
    }
  }, [currentUser, db, rendered]);

  useEffect(() => {
    getUserDatafromBase();
    //console.log("current user", currentUser?.email, "multi",isMulti, isPause,"add",add)
    //console.log("debt", debt)
    //paymentDateIndex < dzisIndex ? console.log('zzzadłuzenie:' , dzisIndex -paymentDateIndex, 'treningi')
    // :console.log("nie ma zadluzenia")
  }, [getUserDatafromBase, rendered]);

  const handleEditDetails = () => {
    setIsEdited(!isEdited);
    //navigate('/userpanel')
  };

  return (
    <>
      {/*uzytkownik multi */}
      {isMulti && (
        <>
          {debt && (
            <div className="debt">
              <p> zadluzenie {debt} treningów</p>
            </div>
          )}
          <div></div>
        </>
      )}
      {/*uzytkownik pass*/}
      {isPass && (
        <>
          {(isPause || isStop) && (
            <>
              {debt && (
                <div className="debt">
                  <p> zadluzenie {debt} wejść</p>
                </div>
              )}
            </>
          )}
          {isPause && <>{add && <p>dodatkowo: {add} wejścia</p>}</>}
        </>
      )}
      {!isPause && !isStop && !isMulti && (
        <div>
          {paymentDateIndex < dzisIndex && (
            <p className="debt">
              zadłuzenie: {dzisIndex - paymentDateIndex} wejść
            </p>
          )}
        </div>
      )}
      <br></br> <br></br>
      <button onClick={handleEditDetails} className="btnsmall">
        {isEdited ? "Zamknij" : "Edytuj szczegóły"}
      </button>
      {isEdited && (
        <>
          {due && (
            <p>
              należna płatność {format(new Date(due.toMillis()), "dd.MM.yyyy")}
            </p>
          )}
          {!isStop && !isPause && <div>status aktywny</div>}
          {isStop && <p>członkostwo zatrzymane</p>}
          {isPause && <p>zgłoszona kontuzja</p>}
          {isPass && <p>uzytkownik karnetu</p>}
          {isMulti && <p>uzytkownik multi/medicov</p>}
        </>
      )}
    </>
  );
};
