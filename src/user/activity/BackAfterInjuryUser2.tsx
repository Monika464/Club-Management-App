import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/auth/UserContext";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../App";
import { useSearchIndexCloseToday } from "../../utils/hooks/useSearchIndexCloseToday";
import { useSearchDatesByIndex } from "../../utils/hooks/useSearchDatesByIndex";
import { useNavigate } from "react-router-dom";
import DateFnsFormat from "../../utils/components/DateFnsFormat";

export interface Itest {}

export interface IdateObj {
  seconds: number;
  nanoseconds: number;
}

export const BackAfterInjuryUser2: React.FunctionComponent<Itest> = () => {
  const { currentUser } = useContext(UserContext);

  const [treningsToAdd, setTreningsToAdd] = useState<number | null>(null);
  const [debtsToSubstract, setDebtsToSubstract] = useState<number | null>(null);
  const [currentUserPausaDate, setCurrentUserPausaDate] =
    useState<IdateObj | null>();
  const [newPaymentDateIndex, setNewPaymentDateIndex] = useState<number | null>(
    null
  );
  const [newPaymentDate, setNewPaymentDate] = useState<IdateObj | null>();
  const [name, setName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);
  const [isMulti, setIsMulti] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(false);
  const [isSent, setisSent] = useState<boolean>(false);

  const dzisIndex = useSearchIndexCloseToday();
  const dzisData = useSearchDatesByIndex(dzisIndex);

  //const [rendered, setRendered] = useState(false);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setRendered(true);
  //   }, 1000); // 1000 milisekund = 1 sekunda

  //   return () => {
  //     clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
  //   };
  // }, []);

  const calcDatOfNewPay = useSearchDatesByIndex(newPaymentDateIndex);

  const getUserData = async () => {
    if (currentUser) {
      const userRef = doc(db, "usersData", currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && docSnap.data().pause) {
        setName(docSnap.data().name);
        setSurname(docSnap.data().surname);
        setDebtsToSubstract(docSnap.data().debt);
        // console.log("debtsToSubstract ",debtsToSubstract,dzisIndex)
        setTreningsToAdd(docSnap.data().add);
        setCurrentUserPausaDate(docSnap.data().pause);

        if (docSnap.data().optionMulti) {
          setIsMulti(true);
        }
        if (docSnap.data().optionPass) {
          setIsPass(true);
        }
      }
    }
  };
  useEffect(() => {
    getUserData();

    //},[currentUser,db,dzisIndex,dzisData, rendered])
  }, [dzisIndex, currentUser, db, dzisData]);

  useEffect(() => {
    const calculate = async () => {
      if (isMulti) {
        setNewPaymentDateIndex(dzisIndex);
        setNewPaymentDate(calcDatOfNewPay);
      }

      if (isPass) {
        if (debtsToSubstract && dzisIndex) {
          setNewPaymentDateIndex(dzisIndex - debtsToSubstract);
        }
        if (treningsToAdd && dzisIndex) {
          setNewPaymentDateIndex(dzisIndex + treningsToAdd);
        }
        setNewPaymentDate(calcDatOfNewPay);
        //sprawdz czy tu kalkuluje
        // console.log("newPaymentDateIndex ",newPaymentDateIndex )
      }
    };
    calculate();
  }, [getUserData]);

  // console.log("dzisData",dzisData, name, surname,newPaymentDateIndex,debtsToSubstract )

  //console.log("newPaymentDate", newPaymentDate)

  const pushToBaseNewDueDay = async () => {
    // console.log("czy sie wczytuje?",isMulti, isPass)

    const dataToActivityArchive = {
      created_at: serverTimestamp(),
      returnData: dzisData,
      userUid: currentUser?.uid,
      kto: `${name} ${surname}`,
    };

    if (currentUser) {
      const userDataRef = doc(db, "usersData", currentUser.uid);

      if (isMulti) {
        await updateDoc(userDataRef, {
          pause: null,
          debt: debtsToSubstract,
        })
          .then(() => console.log("you are back. update succesful"))
          .then(() => setisSent(true))
          .then(() => alert("powrót do treningów zapisany"))
          .then(() => navigate("/userpanel"));

        await addDoc(collection(db, "activitiArchive"), dataToActivityArchive);
      }

      if (isPass) {
        await updateDoc(userDataRef, {
          due: newPaymentDate,
          add: null,
          debt: null,
          pause: null,
        })
          .then(() => {
            console.log("powrot do treningów nowa płatnosc zapisana");
          })
          .then(() => {
            setisSent(true);
          })
          .then(() => alert("powrót do treningów zapisany"))
          .then(() => navigate("/userpanel"));

        //kopia do archive
        await addDoc(collection(db, "activitiArchive"), dataToActivityArchive);
        //.then(()=> console.log("archive"))
      }
    }
  };

  //console.log("newPaymentDate ",newPaymentDate?.toDate() )

  return (
    <>
      {newPaymentDate && (
        <div className="archive">
          <p>Jeśli chcesz wrócic do treningów: </p>
          <p>
            <DateFnsFormat element={dzisData} /> zatwierdź
          </p>
        </div>
      )}
      <br></br>
      {!isSent && currentUserPausaDate && (
        <button onClick={pushToBaseNewDueDay} className="btn">
          Zatwierdz powrot
        </button>
      )}
      {isSent && <p>wyslano</p>}
      {/* <button onClick={calculate}>caculate</button> */}
    </>
  );
};

export default BackAfterInjuryUser2;
