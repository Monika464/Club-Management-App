// import Select from 'react-select'
// import { useModUsersForSelect } from '../hooks/useModUsersForSelect ';
// import { useEffect, useState } from 'react';
// import { useSearchDatesPlusN } from '../hooks/useSearchDatesPlusN';
// import { useSearchIndexCloseToday } from '../hooks/useSearchIndexCloseToday';
// import { useSearchDatesByIndex } from '../hooks/useSearchDatesByIndex';
// import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
// import { db } from '../App';
// import { useSearchIndexAnyDate } from '../hooks/useSearchIndexAnyDate';

// export interface US {
//   value: string | null
//   label: string | null
// }

// const StopMembershipAdmin: React.FunctionComponent =() => {


//     const [chosenUserId, setChosenUserId] = useState<string | null>(null)
//     const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(null)

//     const [isSent, setisSent] = useState<boolean>(false) ;
//     const [currentUserPausaDate, setCurrentUserPausaDate] = useState<Date | null>();
// const [dueDate, setDueDate] = useState<Date | null>()
// const [stopReported, setStopReported] = useState<boolean>(false)
// const [stopDate, setStopDate] = useState<Date | null>()
// const [finalDebt, setFinalDebt] = useState<number | null>(null) 
// const [name, setName] = useState<string | null>(null)
// const [surname, setSurname] = useState<string | null>(null)

// const paymentDateIndex  = useSearchDatesPlusN(0, chosenUserId);
// const dzisIndex = useSearchIndexCloseToday();
// const dzisData = useSearchDatesByIndex(dzisIndex);
// const [newUsersList, setNewUsersList] = useState<US[]>([])  

// const userModForSelect  =  useModUsersForSelect();  

  
// useEffect(() => {

//   console.log("czy mamy ",userModForSelect)   

//     const fetchData = async () => {  
//         const usersToAdd = [];

//         //jakby zrobic snaphot to moze by dzialalo

//         for (let i = 0; i < userModForSelect.length; i++) {
//             const userRef = doc(db, "usersData", userModForSelect[i].value);
//             const docSnap = await getDoc(userRef); 
            
//             if (docSnap.data()) {
//                 // Dodawanie użytkownika do listy w formie obiektu
//                 usersToAdd.push({ value: userModForSelect[i].value, label: userModForSelect[i].label });
//             }

//             setNewUsersList(usersToAdd); // Aktualizuj stan tablicy  
//         }

        
//     }; 

//     fetchData();

//     console.log('newUsersList',newUsersList)

// }, [db,dzisData,paymentDateIndex]);


// //console.log('paymentDateIndex',paymentDateIndex)

// useEffect(()=>{

//     const settingName = async ()=>{

//         if(chosenUserId){ 
//           const userRef = doc(db, "usersData",chosenUserId);
//           const docSnap = await getDoc(userRef);
  
//               if (docSnap.exists()) {
//                 setName(docSnap.data().name);
//                 setSurname(docSnap.data().surname);
//                }
//          }
  
//       }
//       settingName()  
//      },[dzisIndex,paymentDateIndex])

// //funkcja kalkulująca naleznosc

//     const getAddfromBase =async ()=>{

 
//       if(chosenUserId){

//            const userRef = doc(db, "usersData",chosenUserId);
//            const docSnap = await getDoc(userRef);
//                 if (docSnap.exists()) {

//                   //jesli mamy stop
//                     if(docSnap.data().stop){
//                     setStopReported(true)
//                      }
//                   //jesli mamy pauze
//                    if(docSnap.data().pause){
//                    setCurrentUserPausaDate(docSnap.data().pause);
//                     console.log("uzytkownik pauzujacy")
//                         if(docSnap.data().add){          
//                            console.log("uzytkownik majacy treningi do dodania")
//                            const pausaIndex = useSearchIndexAnyDate(currentUserPausaDate);
//                            const convertToStopInd = pausaIndex + docSnap.data().add;
//                            const dateSzukana = useSearchDatesByIndex(convertToStopInd)
//                            setStopDate(dateSzukana);
//                         }
//                         if(docSnap.data().debt){          
//                           console.log("uzytkownik zadluzony")
//                           setStopDate(dzisData);
//                           setFinalDebt(docSnap.data().debt)
//                        }
//                    } 
//                   //jesli mamy due
//                     if(docSnap.data().due){   
//                          if(paymentDateIndex && dzisIndex){
//                             //console.log("odpalonypaymentDateIndex")
//                             setStopDate(dzisData)
//                             if(dzisIndex > paymentDateIndex){
//                             setFinalDebt(dzisIndex - paymentDateIndex)
//                             }          
//                          }
//                      } 
       
//       } else {console.error("no database connection")}

//     }
//      }
    

//      const dataToActivityArchive = {
//         timestamp: serverTimestamp(),
//         stopData: stopDate,
//         userUid: chosenUserId,
//         kto: `${name} ${surname}`,          
//       } 

//       //funkcja zapisujaca w bazie

//      const sendStopToBase =async()=>{

//     const paymentDataRef = doc(db, "usersData", chosenUserId);
 
//        if(currentUserPausaDate){    
//         await updateDoc(paymentDataRef, {
//           pause: null,  
//           add: null,
//           stop: stopDate,  
//           restart: null ,
//           debt: finalDebt   
//         })
//         .then(()=>console.log("stop date update succesful"))
//         .then(()=>  setStopDate(null))
//         .then(()=>   setisSent(true))
       
         
//         const docRef = await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
//         .then(()=> console.log("archive"))
     
//          } 

    
//      if(!currentUserPausaDate && !stopReported){ 
//         await updateDoc(paymentDataRef, {
//            stop: stopDate,
//            due: null,
//            restart: null
//          })
//          .then(()=>console.log("debt modified. update succesful"))
//          .then(()=>  setStopDate(null))
//          .then(()=>   setisSent(true))

//          const docRef = await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
//          .then(()=> console.log("archive"))
//         }

//     if(finalDebt){
//        await updateDoc(paymentDataRef, {
//           debt: finalDebt
//         })
//         .then(()=>console.log("debt modified. update succesful"))
//         .then(()=>{setFinalDebt(null)})
//        }
     

//   }



// return(<>

// <Select
//       closeMenuOnSelect={true}  
//       options={newUsersList}
//       onChange={(choice) => {
//         setChosenUserId(choice.value);   
//         setChosenUserByIdLabel(choice.label);   
//         setStopReported(false);
//         setisSent(false);
//         setStopDate(null)
//         }}   
//     />
//     <p>{chosenUserByIdLabel}</p>

//     {!stopReported && <button onClick={getAddfromBase}>Skalkuluj date zakonczenia</button>}
 
//  {stopReported && <p>juz zastopowane</p>}
//  {stopDate && !stopReported && <p>Treningi zostana zakonczone: {stopDate?.toDate()?.toString()}</p>}
//  {finalDebt && !stopReported &&<p>istniejące zadłużenie: {finalDebt} treningów</p>}
//  {!stopReported  && <button onClick={sendStopToBase}>Potwierdż</button>}
//  {isSent &&<p>wyslano</p>}


// </>)
// }

// export default StopMembershipAdmin;