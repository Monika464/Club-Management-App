import { useFetchDates } from "./useFetchDates";
import { db } from "../../App";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface ITimestampObject {
  toMillis(): string | number | Date;

  seconds: number;
  nanoseconds: number;
}

export interface UsersDueDates {
  timestampObj: {
    seconds: number;
    nanoseconds: number;
  };
  id: string;
}

export const useSearchDatesPlusN = (
  howMany: number,
  id: string | null | undefined
) => {
  const [userDueDate, setuserDueDate] = useState<ITimestampObject | null>(null);
  const [wantedIndex, setWantedIndex] = useState<number>(null!);
  const [isDb, setIsDb] = useState<boolean>(false);
  const dataFromBase = useFetchDates();

  //console.log("co odbiera searchplusn", howMany,id)
  //console.log("dataFromBase",dataFromBase)

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
    const getUserDueDate = async () => {
      if (id && db) {
        const userRef = doc(db, "usersData", id);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          // console.log("czy mamy docSnapUseSerachN",docSnap?.data().due )
          if (docSnap?.data().due) {
            setuserDueDate(docSnap?.data().due);
          }

          setIsDb(true);
        }
      }
    };
    getUserDueDate();

    //console.log("userDueDate",userDueDate?.toDate(),"id",id)
  }, [db, howMany, id, rendered]);

  useEffect(() => {
    //console.log('userDueDate',userDueDate);

    const baseCheck = async () => {
      //ale ten hook moze wystapic w miejscu bez duedata i mamy blad

      if (isDb && dataFromBase && userDueDate) {
        const paymentYear = new Date(userDueDate?.toMillis()).getFullYear();
        const paymentMonth = new Date(userDueDate?.toMillis()).getMonth();
        const paymentDay = new Date(userDueDate?.toMillis()).getDate();

        for (let ind = 0; ind < dataFromBase?.length; ind++) {
          const dat = dataFromBase[ind];
          const datYear = new Date(dat?.toMillis()).getFullYear();
          const datMonth = new Date(dat?.toMillis()).getMonth();
          const datDay = new Date(dat?.toMillis()).getDate();

          if (
            paymentYear.toString() === datYear.toString() &&
            paymentMonth.toString() === datMonth.toString() &&
            paymentDay.toString() === datDay.toString()
          ) {
            if (howMany) {
              //console.log("howMany",howMany)
              setWantedIndex(ind + howMany);
            } else {
              setWantedIndex(ind);
            }
            break;
          } else {
            console.log("nothing inside");
          }
        }
      } else {
        console.log("...loading");
      }
    };
    baseCheck();
  }, [userDueDate]);

  return wantedIndex;
};
