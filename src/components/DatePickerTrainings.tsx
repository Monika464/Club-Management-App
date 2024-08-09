
 
  import React from 'react';
import {  useEffect, useState } from "react";
//import { db } from "../App";
import DatePicker from "react-datepicker"; 
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select'
import makeAnimated from 'react-select/animated'; 
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../App';


export interface PossibleTrainingDate {
  value: Date;
  label: string;
}

// export interface ISelectedDates{
//   selecteddDates: Date[]
// }


export const DatePickerTrainings: React.FunctionComponent=() => {
  //export const DatePickerTrainings: React.FunctionComponent<PossibleTrainingDate[] > =() => {

  const animatedComponents = makeAnimated();

  const [selectedDates, setSelectedDates] = useState<PossibleTrainingDate[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());   
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dayRange, setDayRange] = useState<Date[]>([]);
   const[userChoice, setUserChoice] = useState<Date[]>([])

   //console.log("sel",selectedDates,"rezta",startDate,endDate,dayRange)
   //console.log("userChoice tablica Date",userChoice)

  const getDatesBetween = (startDate: Date, endDate: Date) => { 
    const datess: Date[] = [];
     // Strip hours minutes seconds etc.
 let currentDate = new Date(
     startDate.getFullYear(),
     startDate.getMonth(),
     startDate.getDate()
 );

     while (currentDate <= endDate) {  
              datess.push(currentDate); 

         currentDate = new Date(
         currentDate.getFullYear(),
         currentDate.getMonth(),
         currentDate.getDate() + 1, 
      ); }

 return datess; 
};


const onChange = async (dates: [Date, Date]) => {       
  const [start, end] = dates;  
  setStartDate(start);
  setEndDate(end);
  setDayRange(getDatesBetween(start,end).filter(el=>el.getDay() === 1 || el.getDay() === 4 )) 


};

useEffect(() => {
  if (dayRange) {
    const newDates = dayRange.map((day) => ({
      value: day,
      label: day.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
    }));
    setSelectedDates((prevSelectedDates) => [...prevSelectedDates, ...newDates]);
  }
}, [dayRange]);

// useEffect(()=>{
// if(dayRange){
//   dayRange.map((day)=>{
//  //console.log("u",day)

//      let possibleTrainingDate: PossibleTrainingDate ={    
//     value: day,
//     label: day.toLocaleDateString('default', { month: 'short', day: 'numeric' }) 
//      } 
//      setSelectedDates((prevSelectedDates: SetStateAction<null[] | null>) => [...prevSelectedDates, possibleTrainingDate])    
  
//  })
// }

//  },[dayRange])   
 
 //wrzuc tutaj zawartosc komponentu SenddatesTobase

 const resetState = () => {
  setUserChoice([]);
  setSelectedDates([]);
  setStartDate(new Date());
  setEndDate(null);
 
};

 const sendToFirebase =async() =>{
 // console.log("wyswietl co chcesz wysłac",userChoice) 
 // setStartDate(new Date()); // Resetuj startDate do wartości domyślnej
  //setEndDate(null); // Resetuj endDate do wartości domyślnej

//console.log(userChoice,"userchoceprops")
 
 //const docRef = await addDoc(collection(db, "trainingDays"), {
        await addDoc(collection(db, "trainingDays"), {
                      datesSet: userChoice?.map((dat)=> new Date(dat)),
                       created_at: serverTimestamp()  
                         })

                         .then(()=>{                       
                          console.log("succsess!! Data sent")
                         resetState();
                          //setIsReset(true);
                      })
                         .catch((err)=>{console.error(err)}) 
            
          
 }




  return ( 
<>

<DatePicker
      selected={startDate}      
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      selectsRange
      inline
      isClearable
/>

<Select
  
      components={animatedComponents} 
      closeMenuOnSelect={false} 
      isMulti
      options={selectedDates}
      onChange={(choice) => {     
    
   const selectedValues:Date[] = choice?.map((option: any) => (option.value));
   setUserChoice(selectedValues)
      }}
    />

{/*
<SendDatesToBase  
    userChoice={userChoice}  
    setUserChoice={setUserChoice} 
    setStartDate={setStartDate}
    setEndDate={setEndDate}
    setSelectedDates={setSelectedDates} 
    setCloseMenu={setCloseMenu} 
    />
    */}
  <button className={"btn"} onClick={sendToFirebase}  >Zapisz w bazie</button>

</>


  )
}






