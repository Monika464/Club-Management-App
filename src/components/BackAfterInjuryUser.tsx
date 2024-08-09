// import { useSearchDatesPlusN } from "../hooks/useSearchDatesPlusN"

// export interface Itest{}

// import { useContext, useEffect, useState } from 'react'
// import { UserContext } from '../context/UserContext';
// import { useSearchIndexCloseToday } from "../hooks/useSearchIndexCloseToday";
// import { useSearchDatesByIndex } from "../hooks/useSearchDatesByIndex";
// import { db } from "../App";
// import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

// //UWAGA DOROB TU TAK ZEBY UWZGLEWDNIALO ZADLUZENIE I W PRZYPADKU ZADLUZENIA
// //POWROT DZIS - ZADLUZENIE

// export const BackAfterInjuryUser : React.FunctionComponent<Itest> =(props) => { 

//   const [treningsToAdd, setTreningsToAdd] = useState<number | null>(null) ;
//   const [debtsToSubstract, setDebtsToSubstract] = useState<number | null>(null) ;
// const [currentUserPausaDate, setCurrentUserPausaDate] = useState<Date | null>()
// //const [debtAfterBackFromPausa, setDebtAfterBackFromPausa] = useState<number | null>(null);
// const [newPaymentDateIndex, setNewPaymentDateIndex] = useState<number | null>(null);
// const [newPaymentDate, setNewPaymentDate] = useState<Date | null>();
// const [name, setName] = useState<string | null>(null)
// const [surname, setSurname] = useState<string | null>(null)
// const [isMulti, setIsMulti] = useState<boolean>(false);
// const [isPass, setIsPass] = useState<boolean>(false);
// const [isSent, setisSent] = useState<boolean>(false) ;
//    // const indexDatyPowrotu = useSearchIndexAnyDate(chosenDateReturn)
// //index daty najblizzej z dziadij
// const { currentUser} = useContext(UserContext); 
// const dzisIndex = useSearchIndexCloseToday();
// const dzisData = useSearchDatesByIndex(dzisIndex);



// //useEffect(()=>{

//   //console.log('helloo' )


  
    


//       const getAddfromBase =async ()=>{

//         if(currentUser){

//           const userRef = doc(db, "usersData",currentUser.uid);
//           const docSnap = await getDoc(userRef);
    
//              if (docSnap.exists()) {

//                  setName(docSnap.data().name);
//                  setSurname(docSnap.data().surname);

//               console.log("uruchomiony getAddfromBase")

//                    if(docSnap.data().add ){
//                  // console.log("Document data:", docSnap.data().pause);
//                   setTreningsToAdd(docSnap.data().add) 
//                   setCurrentUserPausaDate(docSnap.data().pause)  
                
//                    } 
//                   // console.log("currentUserPausaDate",currentUserPausaDate);     
//                    if(docSnap.data().debt ){
//                     //console.log("Document data:", docSnap.data().add);
//                     setDebtsToSubstract(docSnap.data().debt) 
//                     setCurrentUserPausaDate(docSnap.data().pause)         
//                      } 

//                      if(docSnap.data().optionMulti == true ){
//                       setIsMulti(true)
//                      }
//                      if(docSnap.data().optionPass == true ){
//                       setIsPass(true)
//                      }

//               } else{
//                  // docSnap.data() will be undefined in this case
//                  console.log("No database connection!");
//                }       
//               }
    
//     //getAddfromBase();
   
//   }

// //},[dzisIndex])

// const calcDatOfNewPay =  useSearchDatesByIndex(newPaymentDateIndex)

// useEffect(()=>{

//   if( currentUser){

//     if(isMulti){
//       setNewPaymentDate(dzisData)
//     } 

//     if(isPass){
    
//       if(debtsToSubstract && dzisIndex){
//         setNewPaymentDateIndex(dzisIndex - debtsToSubstract)
//       }
//       if(treningsToAdd && dzisIndex){
//         setNewPaymentDateIndex(dzisIndex + treningsToAdd)
//        }  
     
//       setNewPaymentDate(calcDatOfNewPay )
//       }
//     }


//     //console.log('newPaymentDate', newPaymentDate?.toDate() )




// },[getAddfromBase,currentUserPausaDate])

// //useEffect(()=>{
// //console.log('newPaymentDateIndex', newPaymentDateIndex )


// //},[newPaymentDateIndex])
// const dataToActivityArchive = {
//   timestamp: serverTimestamp(),
//   restartData: dzisData,
//   userUid: currentUser?.uid,
//   kto: `${name} ${surname}`,          
//   } 

// const pushToBaseNewDueDay =async ()=>{
//   const userRef = doc(db, "usersData",currentUser.uid);
  
//   if(isMulti){
//     await updateDoc(userRef, {
//       due: null,
//       add: null,
//       debt: debtsToSubstract,
//       pause: null
//     })
//     .then(()=>{console.log("powrot do treningów uzytkownik multi")})
//     .then(()=>{setisSent(true)})
//   }
  
//   if(isPass){
//           await updateDoc(userRef, {
//           due: newPaymentDate,
//           add: null,
//           debt: null,
//           pause: null
//            })
//           .then(()=>{console.log("powrot do treningów nowa płatnosc zapisana")})
//           .then(()=>{setisSent(true)})
  
//     //kopia do archive 
//     const docRef = await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
//   .then(()=> console.log("archive"))
//   } 

//   }
 
  




// //zabezpiecz zeby nie dalo się dwa razy kliknac wracam co wtedy kasuje wszystko
// //zrob issent i jest !issent (wlacz tez jak jest pausa zaznaczona) wtedy nie ma przycisku


// return(<>
// <br></br><br></br> 
// {currentUserPausaDate &&
// <button onClick={getAddfromBase}>wylicz date powrotu</button>}
// {newPaymentDate && <p>data powrotu: {newPaymentDate?.toDate()?.toString()}</p>}
// {currentUserPausaDate &&
//  <button onClick={pushToBaseNewDueDay}>Zatwierdz powrot</button>

// }
// {isSent && <p>wyslano</p>}
// </>)
// }