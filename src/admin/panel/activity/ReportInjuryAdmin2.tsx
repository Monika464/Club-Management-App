import { ChangeEvent, useEffect, useState } from "react";
import { useModUsersForSelect } from "../../../utils/hooks/useModUsersForSelect ";
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
import { useSearchIndexCloseToday } from "../../../utils/hooks/useSearchIndexCloseToday";
import { useSearchDatesByIndex } from "../../../utils/hooks/useSearchDatesByIndex";
import Select from "react-select";
import DateFnsFormat from "../../../utils/components/DateFnsFormat";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./reportinjuryadmin-translations";

export interface US {
  value: string | null;
  label: string | null;
}

export interface IusersForSelect {
  value: string;
  label: string;
}

export interface IdateObj {
  seconds: number;
  nanoseconds: number;
}

const ReportInjuryAdmin2: React.FunctionComponent = () => {
  const [newUsersList, setNewUsersList] = useState<US[]>([]);

  const userModForSelect = useModUsersForSelect();
  const [chosenUserId, setChosenUserId] = useState<string | null>(null);
  const [stopReported, setStopReported] = useState<boolean>(false);
  const [pausaReported, setPausaReported] = useState<boolean>(false);
  const [pausaDate, setPausaDate] = useState<IdateObj | null>();
  const [pausaDebt, setPausaDebt] = useState<number | null>(null);
  const [pausaAdd, setPausaAdd] = useState<number | null>(null);
  const [isSent, setisSent] = useState<boolean>(false);
  const [injuryDescription, setInjuryDescripton] = useState<string | undefined>(
    ""
  );
  const [archiveName, setArchiveName] = useState<string | null>("");
  const [isMulti, setIsMulti] = useState<boolean>(false);

  const dzisIndex = useSearchIndexCloseToday();
  const dzisData = useSearchDatesByIndex(dzisIndex);
  const paymentDateIndex = useSearchDatesPlusN(0, chosenUserId);

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  useEffect(() => {
    const fetchData = async () => {
      const usersToAdd = [];
      for (let i = 0; i < userModForSelect.length; i++) {
        const userRef = doc(db, "usersData", userModForSelect[i].value);
        const docSnap = await getDoc(userRef);
        // wykluczyc tych z pauza i stopem

        if (docSnap.exists()) {
          if (docSnap.data().pause || docSnap.data().stop) {
            continue;
          } else {
            if (docSnap.data().id === userModForSelect[i].value) {
              // Dodawanie użytkownika do listy w formie obiektu
              usersToAdd.push({
                value: userModForSelect[i].value,
                label: userModForSelect[i].label,
              });
            }
          }
        }
        setNewUsersList(usersToAdd);
      }
    };

    fetchData();

    // console.log('newUsersList',newUsersList)
  }, [db, useModUsersForSelect, dzisData]);

  const getAddfromBase = async () => {
    if (chosenUserId) {
      const userRef = doc(db, "usersData", chosenUserId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        //if stop
        if (docSnap.data().stop) {
          setStopReported(true);
        }
        if (docSnap.data().pause) {
          setPausaReported(true);
        }
        //if multi
        if (docSnap.data().optionMulti === true) {
          setIsMulti(true);
          setPausaDate(dzisData);
          if (docSnap.data().debt) {
            setPausaDebt(docSnap.data().debt);
          }
        }
        //if due
        if (docSnap.data().due) {
          if (paymentDateIndex !== null && dzisIndex) {
            // console.log("odpalonypaymentDateIndex")
            setPausaDate(dzisData);
            if (paymentDateIndex >= dzisIndex) {
              setPausaAdd(paymentDateIndex - dzisIndex);
            }
            if (dzisIndex > paymentDateIndex) {
              setPausaDebt(dzisIndex - paymentDateIndex);
            }
          }
        }
      } else {
        console.error("no database connection");
      }
    }

    //console.log('pausaDate',pausaDate)
  };

  const dataToActivityArchive = {
    created_at: serverTimestamp(),
    pausaData: pausaDate,
    userUid: chosenUserId,
    kto: `${archiveName}`,
    reason: injuryDescription,
  };

  //funkcja zapisujaca w bazie

  const sendStopToBase = async () => {
    if (chosenUserId) {
      const paymentDataRef = doc(db, "usersData", chosenUserId);

      if (isMulti) {
        await updateDoc(paymentDataRef, {
          pause: pausaDate,
          due: pausaDebt,
          return: null,
          add: null,
        })
          .then(() => console.log("debt modified. update succesful"))
          .then(() => setPausaDate(null))
          .then(() => setisSent(true));
      }

      if (!pausaReported && !stopReported) {
        await updateDoc(paymentDataRef, {
          pause: pausaDate,
          due: null,
          return: null,
          add: pausaAdd,
        })
          .then(() => console.log("debt modified. update succesful"))
          .then(() => setPausaDate(null))
          .then(() => setisSent(true));

        await addDoc(
          collection(db, "activitiArchive"),
          dataToActivityArchive
        ).then(() => console.log("pausa sent to archive"));
      }

      if (pausaDebt) {
        await updateDoc(paymentDataRef, {
          debt: pausaDebt,
        })
          .then(() => console.log("debt modified. update succesful"))
          .then(() => {
            setPausaDebt(null);
          });
      }
    }
  };

  const handleDescriptInj = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInjuryDescripton(value);
  };
  return (
    <>
      <Select
        closeMenuOnSelect={true}
        options={newUsersList}
        onChange={(choice) => {
          if (choice) {
            setChosenUserId(choice.value);
            setArchiveName(choice.label);
          }
          //setChosenUserByIdLabel(choice.label);

          setPausaReported(false);
          setisSent(false);
          setPausaDate(null);
          setPausaAdd(null);
          setPausaDebt(null);
          setStopReported(false);
        }}
      />

      <button onClick={getAddfromBase} className="btn">
        {t.calculatePause}{" "}
      </button>
      <br></br>

      {stopReported && <p>{t.trainingAlreadyStopped}</p>}

      {pausaDate && (
        <div className="archive">
          <p>{t.trainingPauseStartDate} </p>
          <p>
            <DateFnsFormat
              element={pausaDate}
              locale={currentLanguage as "pl" | "en"}
            />
          </p>
        </div>
      )}

      {/* {pausaDebt && <p>istniejące zadłużenie: {pausaDebt} treningów</p>} */}
      {pausaDebt && (
        <p>{t.existingDebt.replace("{debt}", pausaDebt.toString())}</p>
      )}
      {/* {pausaAdd && <p>pozostało opłaconych treningów: {pausaAdd} treningów</p>} */}
      {pausaAdd && (
        <p>
          {t.remainingPaidSessions.replace("{sessions}", pausaAdd.toString())}
        </p>
      )}
      {pausaDate && (
        <div>
          {t.fillFormReason}
          <input
            type="text"
            name="text"
            value={injuryDescription}
            onChange={handleDescriptInj}
            placeholder={t.whatHappened}
            required
          />
          <button onClick={sendStopToBase} className="btn">
            {t.confirm}
          </button>
        </div>
      )}
      {isSent && <p>{t.sent}</p>}
    </>
  );
};

export default ReportInjuryAdmin2;
