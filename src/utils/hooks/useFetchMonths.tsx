// import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { db } from "../App";

// export const useFetchMonths = (): Date[] | null => {

//     const [data, setData] =useState<Date[] | null>(null)
 

//     const daysCollectionRef = collection(db, "trainingDays");

//     const q = query(daysCollectionRef , orderBy("created_at"), limit(3));

   
//     useEffect(()=>{

//         const gettingDatesSets =async ()=>{
            
//             const querySnapshot = await getDocs(q);
//             querySnapshot.forEach((doc) => {
//               // doc.data() is never undefined for query doc snapshots
//              // console.log(doc.id, " => ", doc.data());
//              // console.log("doc.data()",doc.data().created_at.toDate())
              
              

//                   //(doc.data)?.map((el)=>{console.log("el",el)})
//             });

//         }

//         gettingDatesSets()

       
// /*
//         const unsub =  onSnapshot(
//             daysCollection, 
//             (snapshot: { docs: { data: () => any; }[]; })=>{
//                              if(snapshot){
   
//                                 snapshot.docs.map((doc)=> {
//                                 console.log("uu", doc.data().datesSet,"doc")  
//                                 })
//                              }

//                              }

//     )

//     */
//     },[daysCollectionRef]) 
   


//     return data
// }