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

import { useLanguage } from "../../utils/context/LanguageContext";
import translations from "./backafterinjuryuser-translations";

export interface Itest {}

export interface IdateObj {
  seconds: number;
  nanoseconds: number;
}

export const BackAfterInjuryUser2: React.FunctionComponent<Itest> = () => {
  const { currentUser } = useContext(UserContext);
  const { currentLanguage } = useLanguage();

  const t = translations[currentLanguage as "en" | "pl"];

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

  const navigate = useNavigate();

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
        console.log("is pass");

        if (debtsToSubstract && dzisIndex) {
          setNewPaymentDateIndex(dzisIndex - debtsToSubstract);
          //  console.log("newPaymentDateIndex debts ", newPaymentDateIndex);
        }
        if (treningsToAdd && dzisIndex) {
          setNewPaymentDateIndex(dzisIndex + treningsToAdd);
          // console.log("newPaymentDateIndex add ", newPaymentDateIndex);
        }
        if (!debtsToSubstract && !treningsToAdd && dzisIndex) {
          setNewPaymentDateIndex(dzisIndex);
        }

        setNewPaymentDate(calcDatOfNewPay);
        //sprawdz czy tu kalkuluje
        // console.log("calcDatOfNewPay", calcDatOfNewPay);
      }
    };
    calculate();
  }, [getUserData]);

  // console.log("dzisData",dzisData, name, surname,newPaymentDateIndex,debtsToSubstract )

  //console.log("newPaymentDate", newPaymentDate);

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
          .then(() => alert(t.trainingReturnSaved))
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
            console.log(t.trainingReturnSaved);
          })
          .then(() => {
            setisSent(true);
          })
          .then(() => alert(t.trainingReturnSaved))
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
          <p>
            {t.trainingReturnStart}{" "}
            <DateFnsFormat
              element={dzisData}
              locale={currentLanguage as "pl" | "en"}
            />
          </p>
          {/* <p>{t.trainingReturnStart} </p>
          <p>
            <DateFnsFormat element={dzisData} /> {t.confirm}
          </p> */}
        </div>
      )}
      <br></br>
      {!isSent && currentUserPausaDate && (
        <button onClick={pushToBaseNewDueDay} className="btn">
          {t.confirmReturn}
        </button>
      )}
      {isSent && <p>{t.sent}</p>}
      {/* <button onClick={calculate}>caculate</button> */}
    </>
  );
};

export default BackAfterInjuryUser2;
