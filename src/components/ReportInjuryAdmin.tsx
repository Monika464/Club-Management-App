// import { useState } from "react";
// import { useModDatesForSelect } from "../hooks/useModDatesForSelect";
// import { useModUsersForSelect } from "../hooks/useModUsersForSelect ";
// import Select from 'react-select'
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../App";
// import { useSearchDatesPlusN } from "../hooks/useSearchDatesPlusN";
// import { useSearchIndexAnyDate } from "../hooks/useSearchIndexAnyDate";

// export interface Itest{}
// export const ReportInjury : React.FunctionComponent<Itest> =() => { 


//   const [chosenUserId, setChosenUserId] = useState<string | null>(null)
//   const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(null)
//   const [chosenDate, setChosenDate] = useState<Date | null>(null) 
//     const datesModForSelect = useModDatesForSelect(); 
//     const userModForSelect  =  useModUsersForSelect(); 


//     //console.log("jaka jest chosenDate", chosenDate)

//     //const paymentDateIndex  = useSearchDatesPlusN(0, chosenUserId)
//     const paymentDateIndex  = useSearchDatesPlusN(0, chosenUserId)
//     const indexOfDate = useSearchIndexAnyDate(chosenDate)
//     //console.log("index-daty-naleznosci", paymentDateIndex)
//     //console.log("index-daty-kontuzji", indexOfDate)

//     if (indexOfDate &&paymentDateIndex){
//     if(indexOfDate >= paymentDateIndex){
//       //console.log("uczestnik dłuzyny nie dodajemy treningow")
//     } else {
//       //console.log("treningi do zapisu",paymentDateIndex -indexOfDate )
//     }
//     }
   
//     const zapiszWBazieTreningi =async()=>{
//       if(paymentDateIndex && indexOfDate){
//       const updatePauseRef = chosenUserId ? doc(db, "usersData", chosenUserId): null;
//       await updateDoc(updatePauseRef, {
//       add: paymentDateIndex -indexOfDate
//       })
//       .then(()=>console.log("kontuzja zapisane"));
//     }
//     }
  
  
// const updateFun =async()=>{
//   const updatePauseRef = chosenUserId ? doc(db, "usersData", chosenUserId): null;;
//   await updateDoc(updatePauseRef, {
//   pause: chosenDate
//   })
//   .then(()=>console.log("profile updated"));
// }
// //updateFun() 

// //console.log("paymentDateIndexTest", paymentDateIndex)






//   return(<>
  
//   <Select
//       closeMenuOnSelect={true}  
//       options={userModForSelect}
//       onChange={(choice) => {
//         setChosenUserId(choice.value);   
//         setChosenUserByIdLabel(choice.label);    
//         }}   
//     />
//     <p>{chosenUserByIdLabel}</p>

//     <Select
//       closeMenuOnSelect={true} 
//       options={datesModForSelect}
//       onChange={(choice) => {   
        
//       if (choice) {
//           const selectedValue = choice ? choice.value : null;
//           setChosenDate(selectedValue);
//         } else {
//           setChosenDate(null); // Opcjonalnie, jeśli chcesz zresetować wybór
//         }
//       }}
//        />

//        <button onClick={updateFun}>Zaktualizuj daty pause w bazie</button>
//        <button onClick={zapiszWBazieTreningi}>zapisz pozostale treningi </button>
// </>)
// }