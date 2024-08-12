import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../App";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/auth/UserContext";
import { useSearchIndexCloseToday } from "../../hooks/useSearchIndexCloseToday";
import { useSearchDatesPlusN } from "../../hooks/useSearchDatesPlusN";
import { useSearchDatesByIndex } from "../../hooks/useSearchDatesByIndex";
import { useNavigate } from "react-router-dom";
import DateFnsFormat from "../DateFnsFormat";

export interface IdateObj {
  seconds: number;
  nanoseconds: number;
  toMillis(): number | Date;
}

const StopMembershipUser2: React.FunctionComponent = () => {
  const { currentUser } = useContext(UserContext);
  const [isSent, setisSent] = useState<boolean>(false);

  // const [currentUserPausaDate, setCurrentUserPausaDate] =
  //   useState<IdateObj | null>();
  const [dueDate, setDueDate] = useState<IdateObj | null>();
  const [stopReported, setStopReported] = useState<boolean>(false);
  const [pausaReported, setPausaReported] = useState<boolean>(false);
  const [stopDate, setStopDate] = useState<IdateObj | null>();

  const [finalDebt, setFinalDebt] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);
  const [isMulti, setIsMulti] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(false);
  //const [rendered, setRendered] = useState(false);

  const paymentDateIndex = useSearchDatesPlusN(0, currentUser?.uid);
  const dzisIndex = useSearchIndexCloseToday();
  const dzisData = useSearchDatesByIndex(dzisIndex);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setRendered(true);
  //   }, 1000); // 1000 milisekund = 1 sekunda

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

  // if (!rendered) {
  //   return <div>Loading...</div>;
  // }

  // if (!paymentDateIndex || !dzisIndex || !dzisData) {
  //   return <div>Loading data...</div>;
  // }
  useEffect(() => {
    const settingCurrentData = async () => {
      if (currentUser) {
        const userRef = doc(db, "usersData", currentUser?.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setName(docSnap.data().name);
          setSurname(docSnap.data().surname);

          //jesli mamy stop
          if (docSnap.data().stop) {
            setStopReported(true);
          }
          // jesli mamy pause
          if (docSnap.data().pause) {
            setPausaReported(true);
          }
          // jesli mamy dlug
          if (docSnap.data().debt) {
            setFinalDebt(docSnap.data().debt);
          }
          // jesli mamy multi
          if (docSnap.data().optionMulti === true) {
            setIsMulti(true);
          }
          // jesli mamy pass
          if (docSnap.data().optionPass === true) {
            setIsPass(true);
          }
          //jesli mamy due
          if (docSnap.data().due) {
            setDueDate(docSnap.data().due);
          }
        }
      }
    };
    settingCurrentData();
  }, [currentUser]);

  useEffect(() => {
    if (isMulti) {
      setStopDate(dzisData);
    }

    if (pausaReported) {
      setStopDate(dzisData);
    }

    if (isPass && paymentDateIndex !== null && dzisIndex !== undefined) {
      if (dzisIndex > paymentDateIndex) {
        setFinalDebt(dzisIndex - paymentDateIndex);
        setStopDate(dzisData);
      }
      if (dzisIndex <= paymentDateIndex) {
        setStopDate(dueDate);
      }
    }
  }, [dzisIndex, paymentDateIndex, dzisData, dueDate, isMulti, isPass]);

  const dataToActivityArchive = {
    created_at: serverTimestamp(),
    stopData: stopDate,
    userUid: currentUser?.uid,
    kto: `${name} ${surname}`,
  };

  //funkcja zapisujaca w bazie

  const sendStopToBase = async () => {
    //console.log("przycisk wcisnieto");
    if (currentUser && stopDate) {
      const userDataRef = doc(db, "usersData", currentUser.uid);

      if (pausaReported) {
        await updateDoc(userDataRef, {
          pause: null,
          add: null,
          stop: stopDate,
          restart: null,
          debt: finalDebt,
        })
          .then(() => console.log("stop date update succesful"))
          .then(() => setStopDate(null))
          .then(() => setisSent(true))
          .then(() => alert("rezygnacja zapisana"))
          .then(() => navigate("/userpanel"));
      }

      if (isMulti) {
        await updateDoc(userDataRef, {
          pause: null,
          add: null,
          stop: stopDate,
          restart: null,
          debt: finalDebt,
        })
          .then(() => console.log("stop date for multiuser update succesful"))
          .then(() => setStopDate(null))
          .then(() => setisSent(true))
          .then(() => setFinalDebt(null))
          .then(() => alert("rezygnacja zapisana"))
          .then(() => navigate("/userpanel"));
      }

      if (isPass) {
        console.log("czy tu jest isPass", isPass);
        if (finalDebt) {
          await updateDoc(userDataRef, {
            pause: null,
            add: null,
            stop: stopDate,
            restart: null,
            debt: finalDebt,
            due: null,
          })
            .then(() => console.log("stop date for passuser update succesful"))
            .then(() => setStopDate(null))
            .then(() => setisSent(true))
            .then(() => setFinalDebt(null))
            .then(() => alert("rezygnacja zapisana"))
            .then(() => navigate("/userpanel"));
        } else {
          await updateDoc(userDataRef, {
            pause: null,
            add: null,
            stop: stopDate,
            restart: null,
            debt: null,
            due: null,
          })
            .then(() => console.log("stop date for passuser update succesful"))
            .then(() => setStopDate(null))
            .then(() => setisSent(true))
            .then(() => alert("rezygnacja zapisana"))
            .then(() => navigate("/userpanel"));
        }
      }

      await addDoc(collection(db, "activitiArchive"), dataToActivityArchive);
    }
  };

  return (
    <div>
      {pausaReported && (
        <p>Pauzujacy użytkownik rezygnuje dzis z członkostwa</p>
      )}
      {!stopReported &&
        (dzisIndex >= paymentDateIndex ||
          paymentDateIndex === (null || undefined)) && (
          <div className="archive">
            <p>
              Czy na pewno chcesz zakończyć uczestnictwo w treningach? Treningi
              zostana zakonczone:{" "}
            </p>
            <p>
              <DateFnsFormat element={dzisData} />
            </p>
          </div>
        )}
      {dzisIndex < paymentDateIndex && !stopReported && dueDate && (
        <div className="archive">
          <p>
            Czy na pewno chcesz zakończyć uczestnictwo w treningach? Treningi
            zostana zakonczone:{" "}
          </p>
          <p>
            <DateFnsFormat element={dueDate} />
          </p>
        </div>
      )}

      {!stopReported && finalDebt && (
        <p>istniejące zadłużenie: {finalDebt} treningów</p>
      )}
      <br></br>
      {!stopReported && (
        <button onClick={sendStopToBase} className="btn">
          Potwierdż
        </button>
      )}
      {isSent && <p>wyslano</p>}
    </div>
  );
};

export default StopMembershipUser2;
