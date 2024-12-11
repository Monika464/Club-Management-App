import React from "react";
import { useEffect, useState } from "react";
import Select from "react-select";
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
import { useSearchDatesPlusN } from "../../../utils/hooks/useSearchDatesPlusN";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./switchpasstomulti-translations";

export interface US {
  value: string | null;
  label: string | null;
}

const SwithPassToMulti: React.FunctionComponent = () => {
  const userModForSelect = useModUsersForSelect();

  const [chosenUserId, setChosenUserId] = useState<string | null>(null);
  //const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);
  const [newUsersList, setNewUsersList] = useState<US[]>([]);

  const [stopReported, setStopReported] = useState<boolean>(false);
  const [pausaReported, setPausaReported] = useState<boolean>(false);
  //const [pausaDate, setPausaDate] = useState<Date | null>();
  const [switchDebt, setSwitchDebt] = useState<number | null>(null);
  const [switchAdd, setSwitchAdd] = useState<number | null>(null);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [multiReported, setMultiReported] = useState<boolean>(false);

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const dzisIndex = useSearchIndexCloseToday();
  const dzisData = useSearchDatesByIndex(dzisIndex);
  const paymentDateIndex = useSearchDatesPlusN(0, chosenUserId);

  //modyfikowanie listy userów

  useEffect(() => {
    const fetchData = async () => {
      const usersToAdd = [];

      for (let i = 0; i < userModForSelect.length; i++) {
        const userRef = doc(db, "usersData", userModForSelect[i].value);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          if (docSnap.data().optionPass === true) {
            // Dodawanie użytkownika do listy w formie obiektu
            usersToAdd.push({
              value: userModForSelect[i].value,
              label: userModForSelect[i].label,
            });
          }

          setNewUsersList(usersToAdd); // Aktualizuj stan tablicy
        }
      }
    };
    fetchData();

    //console.log('newUsersList',newUsersList)
  }, [db, useModUsersForSelect, dzisData]);

  //console.log('newUsersList',newUsersList)

  //ustawienie imienia i nazwiska

  useEffect(() => {
    const settingName = async () => {
      if (chosenUserId) {
        const userRef = doc(db, "usersData", chosenUserId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setName(docSnap.data().name);
          setSurname(docSnap.data().surname);
        }
      }
    };
    settingName();
    // console.log("chosenUserByIdLabel",chosenUserByIdLabel,"name",name,"surname",surname)
  }, [dzisData, userModForSelect]);

  const dataToActivityArchive = {
    timestamp: serverTimestamp(),
    optionismulti: true,
    userUid: chosenUserId,
    kto: `${name} ${surname}`,
  };

  //kalkulacja ewentualnych naleznosci z due date
  const getAddfromBase = async () => {
    if (chosenUserId) {
      const userRef = doc(db, "usersData", chosenUserId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        //jesli mamy stop
        if (docSnap.data().stop) {
          setStopReported(true);
        }
        if (docSnap.data().pause) {
          setPausaReported(true);
        }

        if (docSnap.data().optionMulti) {
          setMultiReported(true);
        }

        //jesli mamy due
        if (docSnap.data().due) {
          if (paymentDateIndex !== null && dzisIndex) {
            //console.log("odpalonypaymentDateIndex")
            //setPausaDate(dzisData);
            if (paymentDateIndex >= dzisIndex) {
              setSwitchAdd(paymentDateIndex - dzisIndex);
            }
            if (dzisIndex > paymentDateIndex) {
              setSwitchDebt(dzisIndex - paymentDateIndex);
            }
          }
        }
      } else {
        console.error("no database connection");
      }
    }
  };

  //funkcja zmienia na multi

  const handleSwitchToMulti = async () => {
    const paymentDataRef = doc(db, "usersData", chosenUserId!);

    await updateDoc(paymentDataRef, {
      optionMulti: true,
      optionPass: false,
      debt: switchDebt,
      add: null,
      due: null,
    })
      .then(() => console.log("now multisport Medicover user"))
      //.then(()=>  setStopDate(null))
      .then(() => setIsSent(true));

    await addDoc(collection(db, "optionsArchive"), dataToActivityArchive).then(
      () => console.log("archive")
    );
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
          //setChosenUserByIdLabel(choice.label);
          setSwitchDebt(null);
          setSwitchAdd(null);
          setPausaReported(false);
          setStopReported(false);
          setIsSent(false);
          setMultiReported(false);
        }}
      />

      <button onClick={getAddfromBase} className="btn">
        {t.calculateUserSituation}{" "}
      </button>
      {switchDebt && (
        <p>
          {t.debt} {switchDebt} {t.classes}{" "}
        </p>
      )}
      {switchAdd && (
        <p>
          {t.add} {switchAdd} {t.classes}{" "}
        </p>
      )}
      {stopReported && <p>{t.stopped}</p>}
      {pausaReported && <p>{t.injuried}</p>}
      {multiReported && <p>{t.multi}</p>}

      <button onClick={handleSwitchToMulti} className="btn">
        {t.switchToMulti}
      </button>
      {isSent && <p>{t.userNowMulti}</p>}
    </div>
  );
};

export default SwithPassToMulti;
