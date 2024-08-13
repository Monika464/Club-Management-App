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

    //zczytywanie danych isera
  };

  //wybierz usera z selecta
  //edytuj pobierze dane przeksztalcone
  //kazdego mozna do multi ale jesli mial dług to ten dług zostaje
  //wyswietla sie jako dlugPass
  //uzytkownik multi maa wartoc multi: yes
  //edycja updatuje usera i ustawia wartosc multi na yes,due na null i dlug na dlugpass
  // tworzy wartosc dlug multi: number
  //w archiwum zapisuje sie kazdy dzien doliczany do multi
  //jak i update czyli zmiana z pass na multi

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
        skalkuluj sytuacje usera{" "}
      </button>
      {switchDebt && <p>jest zadluzenie {switchDebt} treningów </p>}
      {switchAdd && (
        <p>
          masz nadpłate ktora po zamianie na multi zostanie skasowana{" "}
          {switchAdd} treningi{" "}
        </p>
      )}
      {stopReported && <p>uzytkownik zawiesił czlonkostwo</p>}
      {pausaReported && <p>uzytkownik pauzuje z powodu kontuzji</p>}
      {multiReported && <p>uzytkownik Multisport lub Medicover</p>}

      <button onClick={handleSwitchToMulti} className="btn">
        przelacz usera na multi
      </button>
      {isSent && <p>uzytkownik teraz multi</p>}
    </div>
  );
};

export default SwithPassToMulti;
