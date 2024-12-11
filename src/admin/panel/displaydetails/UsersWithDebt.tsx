import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../App";
import { useSearchIndexCloseToday } from "../../../utils/hooks/useSearchIndexCloseToday";
import { useSearchDatesByIndex } from "../../../utils/hooks/useSearchDatesByIndex";
//import startOfDay from "date-fns/startOfDay";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./userswithdebt-translations";

export interface IUsersWithDebt {}
export interface ItimestampArr1 {}

interface Deptor {
  id: string;
  who: string;
}

export const UsersWithDebt: React.FunctionComponent<IUsersWithDebt> = () => {
  // const [isDebt, setIsDebt] = useState<boolean>(false);
  const [deptorsList, setDeptorsList] = useState<Deptor[]>([]);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const najblizszyindexwbaziedat = useSearchIndexCloseToday();
  const najblizszadatawbazie = useSearchDatesByIndex(najblizszyindexwbaziedat);

  const sendingQuery = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usersData"));

      const deptors: Deptor[] = [];

      querySnapshot.forEach((doc) => {
        const who = `${doc.data().name} ${doc.data().surname}`;

        if (doc.data().debt) {
          deptors.push({ id: doc.id, who });
        }

        if (
          doc.data().due &&
          najblizszadatawbazie &&
          najblizszadatawbazie.toMillis() > doc.data().due.toMillis()
        ) {
          //setIsDebt(true);
          deptors.push({ id: doc.id, who });
        } else {
        }
      });

      setDeptorsList(deptors);
    } catch (error) {
      console.error("Error querying Firestore:", error);
    }
  }, [db, najblizszadatawbazie]);

  useEffect(() => {
    sendingQuery();
  }, [sendingQuery]);

  return (
    <div>
      <p className="title"> {t.debtors}</p>
      {/* Render your debtors list here */}
      {deptorsList.map((deptor) => (
        <div key={deptor.id}>
          {/* <p>ID: {deptor.id}</p> */}
          <p>{deptor.who}</p>
        </div>
      ))}
    </div>
  );
};
