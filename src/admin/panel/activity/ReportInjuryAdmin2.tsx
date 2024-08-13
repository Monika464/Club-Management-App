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
  // const paymentDateIndex  = useSearchDatesPlusN(0, chosenUserId);

  const userModForSelect = useModUsersForSelect();
  const [chosenUserId, setChosenUserId] = useState<string | null>(null);
  //const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(null);
  //const [name, setName] = useState("")
  //const [surname, setSurname] = useState("");
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
  //const [rendered, setRendered] = useState(false);

  const dzisIndex = useSearchIndexCloseToday();
  const dzisData = useSearchDatesByIndex(dzisIndex);
  const paymentDateIndex = useSearchDatesPlusN(0, chosenUserId);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setRendered(true);
  //   }, 1000); // 1000 milisekund = 1 sekunda

  //   return () => {
  //     clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
  //   };
  // }, []);

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
        setNewUsersList(usersToAdd); // Aktualizuj stan tablicy
      }
    };

    fetchData();

    // console.log('newUsersList',newUsersList)
  }, [db, useModUsersForSelect, dzisData]);

  // //ustawienie imienia i nazwiska
  // useEffect(()=>{

  //   if(db && chosenUserId){
  //   const userRef = doc(db, "usersData",chosenUserId);
  //   const getName =async()=>{

  //     const docSnap = await getDoc(userRef);
  //     console.log("snaaap",docSnap.data())

  //   }
  //   getName();
  // }

  // },[chosenUserId,db])
  //setting name
  // useEffect(()=>{

  //     const settingName = async ()=>{

  //         if(chosenUserId){
  //           const userRef = doc(db, "usersData",chosenUserId);
  //           const docSnap = await getDoc(userRef);

  //               if (docSnap.exists()) {
  //                 console.log("w snapie",docSnap.data().name)
  //                 setName(docSnap.data().name);
  //                 setSurname(docSnap.data().surname);
  //                } else{
  //                 console.log("snap nie istnieje")
  //                }
  //          }

  //       }
  //       settingName()
  //       console.log("a czy tu jest name",name, surname)
  //      },[db,dzisIndex,paymentDateIndex,rendered])

  //funkcja kalkulująca naleznosc

  const getAddfromBase = async () => {
    //console.log("paymentDateIndex",paymentDateIndex)
    //paymentDateIndex? console.log("paymentDateIndex",paymentDateIndex) : console.log("nic",paymentDateIndex)

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
        //jesli mamy multi
        if (docSnap.data().optionMulti === true) {
          setIsMulti(true);
          setPausaDate(dzisData);
          if (docSnap.data().debt) {
            setPausaDebt(docSnap.data().debt);
          }
        }
        //jesli mamy due
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
        Wylicz pauze{" "}
      </button>
      <br></br>

      {stopReported && <p>Treningi sa juz zakończone</p>}

      {/* {pausaDate && <p>Treningi zostana zawieszone: {pausaDate?.toDate()?.toString()}</p>} */}
      {pausaDate && (
        <div className="archive">
          <p>Treningi zostana zawieszone: </p>
          <p>
            <DateFnsFormat element={pausaDate} />
          </p>
        </div>
      )}

      {pausaDebt && <p>istniejące zadłużenie: {pausaDebt} treningów</p>}
      {pausaAdd && <p>pozostało opłaconych treningów: {pausaAdd} treningów</p>}
      {pausaDate && (
        <div>
          Uzupelnij formularz wspisując powód zawieszenia
          <input
            type="text"
            name="text"
            value={injuryDescription}
            onChange={handleDescriptInj}
            placeholder="Co się stało?"
            required
          />
          <button onClick={sendStopToBase} className="btn">
            Potwierdż
          </button>
        </div>
      )}
      {isSent && <p>wyslano</p>}
    </>
  );
};

export default ReportInjuryAdmin2;
