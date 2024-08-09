// import React from "react";
// import{ useEffect, useState } from "react";
// import { db } from "../App"
// import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";

// export interface IDatesFirebaseProps {
//     collectionName: string;     
//      column1Name: string; 
//     column2Name: string;   
//       limitNum: number;

// };

// //zrob nowy authcontext z currentuser https://codingpr.com/react-firebase-auth-tutorial/

// const ReadDatesFirebase: React.FunctionComponent<IDatesFirebaseProps> =(props) => {

//     const collectionName='trainingDates';     
//     const column1Name='created_at';
//     const column2Name='datesSet';   
//      const limitNum = 12; 
     
   

//   const  getDatesFromBase: (collectionName: any, column1Name: any, column2Name: any, limitNum: any) => JSX.Element = (collectionName,column1Name,column2Name,limitNum) => {

 
   
//    const [dataFromBase, setDataFromBase] = useState<Date[]>();   
//    const [loading, setLoading] = useState<boolean>(false) 
        
//             const getData = async()=>{    
      
//                         if (db) {
   
//                          const q =  query(collection(db, collectionName),orderBy(column1Name,"desc"),  orderBy(column2Name),limit(limitNum)) 
   
//                              const unsub = onSnapshot(q, (querySnapshot) => {

//                                   let tempContainer: any[] = [];
//                                      querySnapshot.forEach((doc) => {
//                                     tempContainer.push({ ...doc.data(), id: doc.id });
//                                     //console.log("nasz nowy doc",doc.data()) 
//                                      });

//                              tempContainer.sort((a, b) => {
//                                 const monthA = a.datesSet[0]?.toDate().getMonth();
//                                 const monthB = b.datesSet[0]?.toDate().getMonth();

//                                     if (monthA < monthB) {
//                                         return -1;
//                                      } else if (monthA > monthB) {
//                                         return 1;
//                                      } else {
//                                         return 0;
//                                      }
//                              });

//                              setDataFromBase(tempContainer);
//                              })                             	
//                              return() => unsub() 
     
//                             }
      
//                         }
    
    
     
   
     
//        useEffect(()=>{
//        getData();
//           // dataFromBase?.forEach((el,index)=>{console.log("a tu tu",el.datesSet[0].toDate(),"ind",index)})
//       },[db])
//     }

//     return(<>a</>)

// }