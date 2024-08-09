// import { useFetchDates } from "../hooks/useFetchDates";
// import { db } from "../App"
// import Select from 'react-select'
// import { useEffect, useState } from "react";
// import { WriteUsersInfo } from "./WriteUsersInfo";

// export interface ISelectDatProps {};


// export const SelectDatePicker: React.FunctionComponent<ISelectDatProps> =(props) => {

//     const[userChoice2, setUserChoice2] = useState({});
//     const [datesModForSelect, setDatesModForSelect] = useState<Date[] | null>([])

//     const data =  useFetchDates();

//     useEffect(()=>{

//         if(db && data){
//             const temp: any[] = []; 
//         data.forEach((elem, index) => {
//             //console.log("co to za elem",elem)
//             console.log("czy to prawda",elem instanceof Date)
//            const timestampA = elem.toDate().toString()
//            temp.push({ value: timestampA, label: timestampA }) 
//            setDatesModForSelect(temp);
//          //console.log("timestamp",timestampA);   
//           }) 
    
//         } else {console.log("db still loading")}
//   //console.log("userChoiceWewnatrzSelectDatePick",userChoice2) 
// },[data,db])
  
//   return (     
    
//     <>
    
//   <Select
//     closeMenuOnSelect={true}  
//     /*components={animatedComponents}  */
//     options={datesModForSelect}
//     onChange={(choice) => {     
//     if (choice) {
//         const selectedValue = choice.value;
//         setUserChoice2(selectedValue);
//       } else {
//         setUserChoice2(null); // Opcjonalnie, jeśli chcesz zresetować wybór
//       }
//     }}
//   />
//   <WriteUsersInfo value={userChoice2}/> 
//   </>
//   )
  
// }