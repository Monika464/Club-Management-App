import { Firestore, collection, onSnapshot, query } from "firebase/firestore";
import { SetStateAction, useEffect, useState } from "react";
import { db } from "../../App.js";

export interface IFetchDates {
  db: Firestore;
  colName: string;
  userInfo: string | null;
  setUserInfo: React.Dispatch<SetStateAction<string | null>>;
}

export interface Iuser {
  surname: string;
  name: string;
  add: number | null;
  debt: number | null;
  dob: ITimeObj;
  due: ITimeObj | null;
  pause: ITimeObj | null;
  stop: ITimeObj | null;
  start: ITimeObj;
  restart: ITimeObj | null;
  optionMulti: false;
  optionPass: false;
  avatar: string | null;
  id: string;
}

export interface ITimeObj {
  toMillis(): number | string;
  seconds: number;
  nanoseconds: number;
}

export const useFetchUsers = (): Iuser[] => {
  const [usersInfo, setUsersInfo] = useState<Iuser[]>(null!);
  //const [loadingUsers, setLoadingusers] =useState<boolean>(false)
  // const [loadingDB, setLoadingDB] =useState<boolean>(false)

  useEffect(() => {
    const getUsersData = () => {
      if (!db) {
        console.error("Firebase Firestore is not ready yet");
        //setLoadingDB(true)
      } else {
        //setLoadingDB(false)}
        // const q =  query(collection(db, "usersData"), orderBy ("surname"));
        const q = query(collection(db, "usersData"));
        const temp: Iuser[] = [];
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          //setLoadingusers(true)
          querySnapshot.forEach((doc) => {
            //cities.push(doc.data().name);
            temp.push(doc.data() as Iuser);
            // console.log("docdate",doc.data())

            // setLoadingusers(false)
            //setUsersFromBase((prev) => [...prev,doc.data()])
          });
        });
        //console.log("temp", temp)
        setUsersInfo(temp);
        //setLoadingDB(false);
        return unsubscribe;
      }
    };
    getUsersData();
    //console.log('usersInfo', usersInfo);
  }, [db]);

  return usersInfo;
};

//export const useUserForUpdate =()=>{

// const docRef = doc(db, 'usersaData', 'Y19J2pywqfd2YKN3zVVGlzYEWR82');

// Update the timestamp field with the value from the server
/*
  const updatingUser = async()=>{

    const updateTimestamp = await updateDoc(washingtonRef, {
      capital: true
    });
  
    const updateTimestamp = await updateDoc(docRef, {
        timestamp: serverTimestamp()
    });
*/

//}
