import { useEffect, useState } from "react";
import { useModUsersForSelect } from "../../../utils/hooks/useModUsersForSelect ";
import Select from "react-select";
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
import { useSearchDatesByIndex } from "../../../utils/hooks/useSearchDatesByIndex";
import DateFnsFormat from "../../../utils/components/DateFnsFormat";

export interface Itest {}

export interface ITimestampObject {
  seconds: number;
  nanoseconds: number;
}

export const UsersPayments: React.FunctionComponent<Itest> = () => {
  const usersModForSelect = useModUsersForSelect();

  const [chosenUserById, setChosenUserById] = useState<string | null>(null);
  //const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(null)
  const [oldDueDate, setOldDueDate] = useState<ITimestampObject | null>(null);
  const [newDueDate, setNewDueDate] = useState<ITimestampObject | null>(null);
  const [hasDebt, setHasDebt] = useState<number | null>(null);
  const [modifyDebt, setModifyDebt] = useState<number | null>(null);
  const [hasAdd, setHasAdd] = useState<number | null>(null);
  const [modifyAdd, setModifyAdd] = useState<number | null>(null);
  const [debtSent, setDebtSent] = useState<boolean>(false);
  const [addSent, setAddSent] = useState<boolean>(false);
  const [dateSent, setDateSent] = useState<boolean>(false);
  const [isMulti, setIsMulti] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);

  const calculatedIndexOfNewDue = useSearchDatesPlusN(8, chosenUserById);
  const newDate = useSearchDatesByIndex(calculatedIndexOfNewDue);

  const checkingFunction = async () => {
    if (chosenUserById) {
      const userRef = doc(db, "usersData", chosenUserById);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setName(docSnap.data().name);
        setSurname(docSnap.data().surname);

        ///
        if (docSnap.data().optionMulti === true) {
          setIsMulti(true);
        }

        if (docSnap.data().optionPass === true) {
          if (docSnap.data().pause || docSnap.data().stop) {
            if (docSnap.data().add) {
              setHasAdd(calculatedIndexOfNewDue + docSnap.data().add);
            } else if (docSnap.data().debt) {
              setHasDebt(docSnap.data().debt);
              //jak debt mniejszy niz 8 to
              if (docSnap.data().debt < 8) {
                if (calculatedIndexOfNewDue && hasDebt) {
                  setModifyAdd(calculatedIndexOfNewDue - hasDebt);
                }
              }
              if (docSnap.data().debt >= 8) {
                if (hasDebt) {
                  setModifyDebt(hasDebt - 8);
                }
              }
            } else {
              setModifyAdd(8);
            }
            // jak nie ma debt ani add  to

            //jak w stopie mamy add to dodajemy to do
            //calculatedIndexOfNewDue
            //jak debt to od niego odejmujemy
          }
          if (docSnap.data().due) {
            setOldDueDate(docSnap.data().due);
            setNewDueDate(newDate);
          }
        }
      }
    }
  };

  useEffect(() => {}, [newDueDate]);

  useEffect(() => {
    if (hasDebt) {
      if (hasDebt <= 8) {
        setModifyAdd(8 - hasDebt);
        //czysc debt zapisz add
      } else {
        setModifyDebt(hasDebt - 8);
      }
    }
  }, [hasDebt]);

  useEffect(() => {
    if (hasAdd) {
      setModifyAdd(8 + hasAdd);
    }
  }, [hasAdd]);

  useEffect(() => {
    // console.log('hasDebt',hasDebt,'modifyDebt',modifyDebt,'hasAdd',hasAdd,'modifyAdd',modifyAdd)
  }, [hasDebt, hasAdd]);

  const handleAccept = async () => {
    const paymentDataRef = doc(db, "usersData", chosenUserById!);

    if (modifyDebt) {
      await updateDoc(paymentDataRef, {
        debt: modifyDebt,
      })
        .then(() => console.log("debt modified. update succesful"))
        .then(() => {
          setDebtSent(true);
        });

      //wyslij do bazy jako debt
    }
    if (modifyAdd) {
      await updateDoc(paymentDataRef, {
        add: modifyAdd,
        debt: null,
      })
        .then(() => console.log("new treinings added. update succesful"))
        .then(() => {
          setAddSent(true);
        });
      //wyslij do bazy jako add
    }

    const dataToPaymentArchive = {
      created_at: serverTimestamp(),
      userUid: chosenUserById,
      kto: `${name} ${surname}`,
      trenings: 8,
      amount: 120,
      due: newDueDate,
      prevdebt: hasDebt,
      prevadd: hasAdd,
    };

    if (newDueDate) {
      await updateDoc(paymentDataRef, {
        due: newDueDate,
      })
        .then(() => console.log("new payment day set. update succesful"))
        .then(() => {
          setDateSent(true);
        });
    }
    //dodaj do archive

    await addDoc(collection(db, "paymentArchive"), dataToPaymentArchive).then(
      () => console.log("payment set to archive")
    );
  };

  return (
    <>
      <Select
        options={usersModForSelect}
        onChange={(choice) => {
          // console.log("choice", choice)
          if (choice) {
            setChosenUserById(choice.value);
          }
          //setChosenUserByIdLabel(choice.label);
          setHasDebt(null);
          setHasAdd(null);
          setOldDueDate(null);
          setNewDueDate(null);
          setModifyDebt(null);
          setModifyAdd(null);
          setDebtSent(false);
          setAddSent(false);
          setDateSent(false);
          setIsMulti(false);
        }}
      />

      <button onClick={checkingFunction} className="btn">
        Edytuj uzytkownika
      </button>
      {isMulti && <p>użytkowników Multi ta metoda płatności nie obejmuje</p>}
      {}
      {/* {newDueDate && !isMulti && <div>
    <p>Poprzednia data naleznosci: {oldDueDate?.toDate()?.toString()}</p>
    <p>Nowa data: {newDueDate?.toDate()?.toString()}</p>
    </div>
    } */}
      {newDueDate && !isMulti && (
        <>
          <div className="archive">
            <p>Poprzednia data naleznosci: </p>
            <p>
              <DateFnsFormat element={oldDueDate} />
            </p>
          </div>

          <div className="archive">
            <p>Nowa data naleznosci</p>
            <p>
              <DateFnsFormat element={newDueDate} />
            </p>
          </div>
        </>
      )}
      {modifyDebt && <p>Nowa wartość zadłużenia wyniesie {modifyDebt}</p>}
      {modifyAdd && <p>Po wpłaceniu będą {modifyAdd} treningi do dodania</p>}
      <button onClick={handleAccept} className="btn">
        Zaakceptuj i wyslij
      </button>
      {debtSent && <p>Zadłużenie zmodyfikowane</p>}
      {addSent && <p>Nadpłata zmodyfikowana</p>}
      {dateSent && <p>Data zmodyfikowana</p>}
    </>
  );
};
