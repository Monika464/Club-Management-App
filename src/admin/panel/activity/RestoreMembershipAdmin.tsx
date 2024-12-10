import Select from "react-select";
import { useModUsersForSelect } from "../../../utils/hooks/useModUsersForSelect ";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../App";
import { useSearchIndexCloseToday } from "../../../utils/hooks/useSearchIndexCloseToday";
import { useSearchDatesByIndex } from "../../../utils/hooks/useSearchDatesByIndex";
import DateFnsFormat from "../../../utils/components/DateFnsFormat";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./restoremembershipadmin-translations";

export interface US {
  value: string;
  label: string;
}

export const RestoreMembershipAdmin: React.FunctionComponent = () => {
  const [chosenUserId, setChosenUserId] = useState<string>("");
  const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(
    null
  );

  const userModForSelect = useModUsersForSelect();
  //zmodyfikuj zeby tylko zatrzymani
  const [newUsersList, setNewUsersList] = useState<US[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);
  const [debt, setDebt] = useState<number | null>(null);
  const [isStop, setIsStop] = useState<boolean>(false);
  const [isMulti, setIsMulti] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(false);
  const [restartDateIndex, setRestartDateIndex] = useState<number | null>(null);
  const [stopDateFromBase, setStopDateFromBase] = useState<Date | null>();
  const dzisIndex = useSearchIndexCloseToday();
  const dzisData = useSearchDatesByIndex(dzisIndex);
  const [isSent, setisSent] = useState<boolean>(false);
  const [rendered, setRendered] = useState(false);

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setRendered(true);
    }, 1000); // 1000 milisekund = 1 sekunda

    return () => {
      clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
    };
  }, []);

  useEffect(() => {
    // console.log("czy mamy restore",userModForSelect)

    const fetchData = async () => {
      const usersToAdd = [];

      //modyfikowanie listy

      for (let i = 0; i < userModForSelect.length; i++) {
        const userRef = doc(db, "usersData", userModForSelect[i].value);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          if (
            docSnap.data().stop &&
            docSnap.data().id === userModForSelect[i].value
          ) {
            usersToAdd.push({
              value: userModForSelect[i].value,
              label: userModForSelect[i].label,
            });
          }
        }

        setNewUsersList(usersToAdd);
      }
    };

    fetchData();
  }, [db, dzisData, dzisIndex, rendered]);

  const handleSetUserInfo = async () => {
    if (chosenUserId) {
      const userRef = doc(db, "usersData", chosenUserId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setName(docSnap.data().name);
        setSurname(docSnap.data().surname);

        if (docSnap.data().stop) {
          setIsStop(true);
          setStopDateFromBase(docSnap.data().stop);
        }

        if (docSnap.data().debt) {
          setDebt(docSnap.data().debt);
        }
        if (docSnap.data().optionMulti) {
          setIsMulti(docSnap.data().optionMulti);
        }
        if (docSnap.data().optionPass) {
          setIsPass(docSnap.data().optionPass);
        }
      }
    }
  };

  useEffect(() => {
    const calculateRestart = () => {
      if (dzisIndex || debt) {
        if (debt) {
          setRestartDateIndex(dzisIndex - debt);
        } else {
          setRestartDateIndex(dzisIndex);
        }
      }
    };
    calculateRestart();
  }, [handleSetUserInfo]);

  const restartNewData = useSearchDatesByIndex(restartDateIndex);

  const dataToActivityArchive = {
    created_at: serverTimestamp(),
    restartData: dzisData,
    userUid: chosenUserId,
    kto: `${name} ${surname}`,
  };

  const sendToBase = async () => {
    const paymentDataRef = doc(db, "usersData", chosenUserId);

    if (restartNewData && isPass) {
      await updateDoc(paymentDataRef, {
        stop: null,
        due: restartNewData,
        restart: dzisData,
        debt: null,
      }).then(() => console.log("restart succesful"));

      await addDoc(
        collection(db, "activitiArchive"),
        dataToActivityArchive
      ).then(() => {
        console.log("archive");
      });
    }

    if (restartNewData && isMulti) {
      await updateDoc(paymentDataRef, {
        stop: null,
        due: null,
        restart: dzisData,
        debt: null,
      }).then(() => console.log("restart succesful"));

      await addDoc(
        collection(db, "activitiArchive"),
        dataToActivityArchive
      ).then(() => {
        console.log("archive");
      });
    }
  };

  ////

  return (
    <>
      <Select
        closeMenuOnSelect={true}
        options={newUsersList}
        onChange={(choice) => {
          if (choice) {
            setChosenUserId(choice.value);
            setChosenUserByIdLabel(choice.label);
          }
          setIsStop(false);
          setDebt(null);
        }}
      />
      <p>{chosenUserByIdLabel}</p>

      <button onClick={handleSetUserInfo} className="btn">
        {t.countReturnDate}
      </button>

      {stopDateFromBase && (
        <div className="archive">
          <p>{t.userStopped}</p>
          <p>
            <DateFnsFormat
              element={stopDateFromBase}
              locale={currentLanguage as "pl" | "en"}
            />
          </p>
        </div>
      )}
      {/* {isStop && <p>Planowany powrót {dzisData?.toDate()?.toString()}</p>} */}
      {isStop && (
        <div className="archive">
          <p>{t.restoreMembership}</p>
          <p>
            <DateFnsFormat
              element={dzisData}
              locale={currentLanguage as "pl" | "en"}
            />{" "}
            ?
          </p>
        </div>
      )}
      {debt && <p>{t.existingDebt.replace("{debt}", debt.toString())}</p>}
      <button onClick={sendToBase} className="btn">
        {t.restoreMembership}
      </button>
    </>
  );
};
