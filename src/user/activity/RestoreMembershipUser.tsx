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

export const RestoreMembershipUser: React.FunctionComponent = () => {
  const { currentUser } = useContext(UserContext);
  const [name, setName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);
  const [debt, setDebt] = useState<number | null>(null);
  const [isStop, setIsStop] = useState<boolean>(false);
  const [restartDateIndex, setRestartDateIndex] = useState<number | null>(null);
  const [isMulti, setIsMulti] = useState<boolean>(false);
  const [isPass, setIsPass] = useState<boolean>(false);
  const [isSent, setisSent] = useState<boolean>(false);
  const dzisIndex = useSearchIndexCloseToday();
  const dzisData = useSearchDatesByIndex(dzisIndex);
  const navigate = useNavigate();
  const [stopDateFromBase, setStopDateFromBase] = useState<Date | null>();
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRendered(true);
    }, 1000); // 1000 milisekund = 1 sekunda

    return () => {
      clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      const initial = async () => {
        const userRef = doc(db, "usersData", currentUser?.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          if (docSnap.data().stop) {
            setIsStop(true);
            setStopDateFromBase(docSnap.data().stop);

            setName(docSnap.data().name);
            setSurname(docSnap.data().surname);
            if (docSnap.data().debt) {
              setDebt(docSnap.data().debt);
            }
            if (docSnap.data().optionMulti === true) {
              setIsMulti(true);
            }
          } else {
            //console.log("uzytkownik aktywny")
          }
        }
      };
      initial();
    }
  }, [currentUser, db, rendered]);

  //ustawienie imienia i nazwiska

  useEffect(() => {
    const handleSetUserInfo = async () => {
      // console.log("klikniete")
      if (currentUser) {
        const userRef = doc(db, "usersData", currentUser?.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setName(docSnap.data().name);
          setSurname(docSnap.data().surname);

          if (docSnap.data().optionMulti === true) {
            setIsMulti(true);
          }
          if (docSnap.data().optionPass === true) {
            setIsPass(true);
          }
          // console.log('isPass',isPass)

          if (docSnap.data().stop) {
            setIsStop(true);
            //console.log('isStop',isStop)
            if (docSnap.data().debt) {
              setDebt(docSnap.data().debt);
            }
          } else {
            //console.log("aktywny")
          }
        }
        //console.log("name", name)
      }
    };

    handleSetUserInfo();
    // console.log('name',name,'dzisData',dzisData?.toDate(),'debt',debt,isPass)
  }, [db, dzisIndex, currentUser, rendered]);

  //wyliczam nowa date jesli jest dlug, jesli nie ma due date na dzi

  useEffect(() => {
    if (isMulti) {
      setRestartDateIndex(null);
    }
    if (isPass) {
      if (dzisIndex || debt) {
        if (debt) {
          setRestartDateIndex(dzisIndex - debt);
        } else {
          setRestartDateIndex(dzisIndex);
        }
      }
    }
    // console.log('UUUUrestartNewData',restartNewData?.toDate())
  }, [dzisIndex, currentUser, rendered]);

  const restartNewData = useSearchDatesByIndex(restartDateIndex);

  //console.log('restartNewData',restartNewData?.toDate())

  const dataToActivityArchive = {
    created_at: serverTimestamp(),
    restartData: dzisData,
    userUid: currentUser?.uid,
    kto: `${name} ${surname}`,
  };

  const sendToBase = async () => {
    //console.log("wcisnieto przycisk",isPass,restartNewData)

    if (currentUser) {
      const paymentDataRef = doc(db, "usersData", currentUser.uid);

      if (isMulti) {
        await updateDoc(paymentDataRef, {
          stop: null,
          due: null,
          restart: dzisData,
          debt: debt,
        })
          .then(() => console.log("restart succesful"))
          .then(() => setisSent(true));

        await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
          .then(() => console.log("archive"))
          .then(() => navigate("/userpanel"));
      }

      if (isPass) {
        if (restartNewData) {
          await updateDoc(paymentDataRef, {
            stop: null,
            due: restartNewData,
            restart: dzisData,
            debt: null,
          })
            .then(() => console.log("restart succesful"))
            .then(() => setisSent(true));

          await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
            .then(() => console.log("archive"))
            .then(() => navigate("/userpanel"));
        }
      }
    }
  };

  //console.log("stopDateFromBase",stopDateFromBase)

  return (
    <div>
      {stopDateFromBase && (
        <div className="archive">
          <p>Treningi zatrzymane od: </p>
          <p>
            <DateFnsFormat element={stopDateFromBase} />
          </p>
        </div>
      )}
      {isStop && (
        <div className="archive">
          <p>Czy planujesz powrót w najbliższym terminie </p>
          <p>
            <DateFnsFormat element={dzisData} /> ?
          </p>
        </div>
      )}
      {debt && <p>Masz do spłaty zadłużenie wysokosci: {debt} treningów</p>}
      <br></br>
      {isStop && (
        <button onClick={sendToBase} className="btn">
          Potwierdzam powrót
        </button>
      )}
      {isSent && <p>wyslano</p>}
    </div>
  );
};
