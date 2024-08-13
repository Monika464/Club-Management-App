import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../../App";
import { useSearchIndexCloseToday } from "../../../utils/hooks/useSearchIndexCloseToday";
import { useSearchDatesByIndex } from "../../../utils/hooks/useSearchDatesByIndex";
//import startOfDay from "date-fns/startOfDay";

export interface IUsersWithDebt {}
export interface ItimestampArr1 {}

interface Deptor {
  id: string;
  who: string;
}

export const UsersWithDebt: React.FunctionComponent<IUsersWithDebt> = () => {
  // const [isDebt, setIsDebt] = useState<boolean>(false);
  const [deptorsList, setDeptorsList] = useState<Deptor[]>([]);

  const najblizszyindexwbaziedat = useSearchIndexCloseToday();
  const najblizszadatawbazie = useSearchDatesByIndex(najblizszyindexwbaziedat);
  //const today = startOfDay(new Date()); // Początek dzisiejszego dnia
  // const timestampToday = today.getTime();
  //console.log("today", today)

  // const fetchData = async () => {
  //   const usersRef = collection(db, "usersData");
  //   const q = query(usersRef, where("due", "!=", null));

  //   try {
  //     const querySnapshot = await getDocs(q);
  //    // console.log("a tu co",querySnapshot.docs )
  //     querySnapshot.forEach((doc) => {
  //       console.log("jakie due",doc.data().due.toMillis(), "jakie dzis",timestampToday)
  //       if(doc.data().due.toMillis() < timestampToday){
  //         console.log("say naleznosc nie zapłacona",doc.data().name)
  //       } else {
  //         console.log("należność zapłacona",doc.data().name)
  //       }
  //           if((doc.data().due).toMillis() < timestampToday){
  //                console.log("on zalega",doc.id, " => ", doc.data().name);
  //             }
  //           })

  //   } catch (error) {
  //     console.error("Błąd podczas pobierania danych:", error);
  //   }
  // };

  // fetchData();

  const sendingQuery = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usersData"));

      const deptors: Deptor[] = [];

      querySnapshot.forEach((doc) => {
        const who = `${doc.data().name} ${doc.data().surname}`;
        // console.log("who",who)

        if (doc.data().debt) {
          //console.log("kto zadłuzony",doc.data().debt,doc.data().name, doc.id)
          //setIsDebt(true);
          deptors.push({ id: doc.id, who });
        }
        //console.log("najbliższa data w bazie",najblizszadatawbazie.toDate())
        //console.log("data due",doc.data().due?.toDate())

        if (
          doc.data().due &&
          najblizszadatawbazie &&
          najblizszadatawbazie.toMillis() > doc.data().due.toMillis()
        ) {
          //setIsDebt(true);
          deptors.push({ id: doc.id, who });
          //console.log("jest tak");
        } else {
          // console.log("jest inaczej");
        }
        //console.log("deptors", deptors);
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
      <p className="title"> Zadłużeni użytkownicy</p>
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

// import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
// import { useCallback, useEffect, useState } from "react";
// import { db } from "../../App";
// import { useSearchIndexCloseToday } from "../../hooks/useSearchIndexCloseToday";
// import { useSearchDatesPlusN } from "../../hooks/useSearchDatesPlusN";
// import { useSearchDatesByIndex } from "../../hooks/useSearchDatesByIndex";

// export interface IUsersWithDebt{
// }
//  export interface ItimestampArr1{}

// export const UsersWithDebt : React.FunctionComponent<IUsersWithDebt> =(props) => {
//   const [debtsArr1, setDebtsArr1] = useState< ItimestampArr1 | null>(null);
//   const [isDebt, setIsDebt] = useState<boolean>(false)
//   const [deptorsList, setDeptorsList] = useState<string[] | null>(false)

//   const najblizszyindexwbaziedat = useSearchIndexCloseToday();
// const najblizszadatawbazie = useSearchDatesByIndex(najblizszyindexwbaziedat)
//   console.log('najblizszadatawbazie',najblizszadatawbazie)

// const sendingQuery =  useCallback(async() => {

//     const querySnapshot = await getDocs(collection(db, "usersData"));
//     querySnapshot.forEach((doc) => {
//       // doc.data() is never undefined for query doc snapshots
//       console.log(doc.id, " => ", doc.data());

//       const who = `${doc.data().name} ${doc.data().surname}`

//       if(doc.data().debt){
//         setIsDebt(true)
//         setDeptorsList([...deptorsList, id:doc.id, who: who])
//       }

//       if(doc.data().due){
//         console.log('doc.data().due',doc.data().due)
//         //console.log('zestawienie')
//         if(najblizszadatawbazie < doc.data().due){
//           console.log('bez dlugu')
//         } else {
//           setIsDebt(true)
//           setDeptorsList([...deptorsList, id:doc.id, who: who])
//         }

//       }

//     });
//    },[db])

//    useEffect(()=>{
//     sendingQuery()

//     console.log('deptorsList',deptorsList)
//    },[sendingQuery,db])

// //   const getUserDatafromBase = useCallback(async() => {

// //      const q1 = query(collection(db, "userData", "debt"));
// //      //const q1 = query(collection(db, "userData"));

// //        const unsubscribe = onSnapshot(q1, (querySnapshot) => {

// //         console.log('querySnapshot.docs',querySnapshot.docs)

// //            const temp1 = querySnapshot.docs.map((doc) => {
// //           console.log("debt", doc.id, " => ", doc.data());

// //                                                        if(doc.data().debt){
// //                                                          return {
// //                                                                id: doc.id,
// //                                                                debt: doc.data().debt,
// //                                                                };
// //                                                        }
// //                         })
// //            setDebtsArr1([...temp1])
// //           })
// //           return () => unsubscribe();
// //         },[db]);

// //         useEffect(()=>{
// //           getUserDatafromBase();
// // console.log("debtsArr1",debtsArr1)
// //         },[  getUserDatafromBase,db])

//     return(<div>
//         UsersWithDebt

//         </div>)
// }
