import { useEffect, useState } from "react";
import { useModUsersForSelect } from "../../../utils/hooks/useModUsersForSelect ";
import { useSearchIndexCloseToday } from "../../../utils/hooks/useSearchIndexCloseToday";
import { useSearchDatesByIndex } from "../../../utils/hooks/useSearchDatesByIndex";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../App";
import Select from "react-select";
import DateFnsFormat from "../../../utils/components/DateFnsFormat";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./switchmultitopass-translations";
//data do zatwierdzenia cofke sie o sume tych debt wzgledem daty wybranej rozpoczecia
export interface US {
  value: string;
  label: string;
}

export interface IDateObject {
  seconds: number;
  nanoseconds: number;
}

const SwitchMultiToPass: React.FunctionComponent = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const [newUsersList, setNewUsersList] = useState<US[]>([]);
  const [chosenUserId, setChosenUserId] = useState<string | null>(null);

  const [name, setName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);

  const [multiReported, setMultiReported] = useState<boolean>(false);
  const [hasDebt, setHasDebt] = useState<number | null>(null);
  const [newPaymentDateIndex, setNewPaymentDateIndex] = useState<number | null>(
    null
  );
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [newPaymentDate, setNewPaymentDate] = useState<IDateObject | null>(
    null
  );

  const userModForSelect = useModUsersForSelect();
  const dzisIndex = useSearchIndexCloseToday();
  const dzisData = useSearchDatesByIndex(dzisIndex);

  //modyfikowanie listy userów

  useEffect(() => {
    const fetchData = async () => {
      const usersToAdd = [];

      for (let i = 0; i < userModForSelect.length; i++) {
        const userRef = doc(db, "usersData", userModForSelect[i].value);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists() && docSnap.data()?.optionMulti) {
          // Dodawanie użytkownika do listy w formie obiektu
          usersToAdd.push({
            value: userModForSelect[i].value,
            label: userModForSelect[i].label,
          });
        }
      }
      setNewUsersList(usersToAdd);
    };

    fetchData();

    //console.log('newUsersList',newUsersList)
  }, [db, useModUsersForSelect, dzisData]);

  const getAddfromBase = async () => {
    setIsCalculating(true);
    if (chosenUserId) {
      const userRef = doc(db, "usersData", chosenUserId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setName(docSnap.data().name);
        setSurname(docSnap.data().surname);

        if (docSnap.data().optionMulti) {
          setMultiReported(true);
        }

        //jesli mamy due optionMulti
        if (docSnap.data().optionMulti) {
          // console.log("multi user")
          if (docSnap.data().debt) {
            setHasDebt(docSnap.data().debt);
          }
        }
      } else {
        console.error("no database connection");
      }
    }
  };

  const calcDatOfNewPay = useSearchDatesByIndex(newPaymentDateIndex);

  //const calcDatOfNewPay = newPaymentDateIndex !== null ? useSearchDatesByIndex(newPaymentDateIndex) : null;

  useEffect(() => {
    if (chosenUserId) {
      if (!hasDebt && dzisIndex !== null) {
        setNewPaymentDateIndex(dzisIndex);
      }

      if (hasDebt && dzisIndex !== null) {
        setNewPaymentDateIndex(dzisIndex - hasDebt);
      }

      if (calcDatOfNewPay !== null && chosenUserId) {
        setNewPaymentDate(calcDatOfNewPay);
      }
    }
  }, [chosenUserId, multiReported, calcDatOfNewPay]);

  //console.log("newPaymentDate",newPaymentDate);

  const dataToActivityArchive = {
    timestamp: serverTimestamp(),
    optionismulti: false,
    userUid: chosenUserId,
    kto: `${name} ${surname}`,
  };

  const handleSwitchToPass = async () => {
    const paymentDataRef = doc(db, "usersData", chosenUserId!);

    // await updateDoc(paymentDataRef, {
    //   optionMulti: false,
    //   optionPass: true,
    //   debt: hasDebt,
    //   due: calcDatOfNewPay,
    // })

    await updateDoc(paymentDataRef, {
      optionMulti: false,
      optionPass: true,
      debt: null,
      due: calcDatOfNewPay,
    })
      .then(() => console.log("now pass user"))
      //.then(()=>  setStopDate(null))
      .then(() => setIsSent(true));

    await addDoc(collection(db, "optionsArchive"), dataToActivityArchive).then(
      () => console.log("archive")
    );

    //zczytywanie danych isera
  };

  return (
    <div>
      <Select
        closeMenuOnSelect={true}
        options={newUsersList}
        onChange={(choice) => {
          if (choice && choice.value) {
            setChosenUserId(choice.value);
          }

          setNewPaymentDate(null);
          setIsCalculating(false);
        }}
      />
      {/*<p>{chosenUserByIdLabel}</p>*/}
      <button onClick={getAddfromBase} className="btn">
        {t.calculateUserSituation}{" "}
      </button>
      <br></br>

      {newPaymentDate && isCalculating && (
        <div className="archive">
          <p>{t.debtFrom}</p>
          <p>
            <DateFnsFormat
              element={newPaymentDate}
              locale={currentLanguage as "pl" | "en"}
            />
          </p>
        </div>
      )}

      <button onClick={handleSwitchToPass} className="btn">
        {t.switchToPass}s
      </button>
      {isSent && <p>{t.userNowPass}</p>}
    </div>
  );
};

export default SwitchMultiToPass;
