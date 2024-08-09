import { add, startOfDay } from "date-fns";
import { useFetchDates } from "./useFetchDates";
import { useEffect, useState } from "react";


export const useSearchIndexCloseToday = (): number=> {

    const dataFromBase = useFetchDates();

  // console.log("usehookwczytany")

    const [closeTodaysIndex, setCloseTodaysIndex] =  useState<number>(null!);

    
 useEffect(()=>{

    const result0 = startOfDay(new Date()); // Pobieramy dzisiejszą datę o godzinie 00:00
       //console.log("result0", result0)
    const result1 = add(result0, {
     days: 1,
    })

    const result2 = add(result0, {
     days: 2,
    })
    //console.log("result2", result2)
    const result3 = add(result0, {
    days: 3,
    })
    const result4 = add(result0, {
      days: 4,
      })
   const result5 = add(result0, {
         days: 5,
         })
   const result6 = add(result0, {
         days: 6,
          })



//////////////////////////

if(dataFromBase){

 // console.log("przykładdatabase", dataFromBase[17].toDate())
  //console.log("result0", result2.getTime())
  //console.log(dataFromBase[17].toDate().getTime() === result2.getTime())
  //console.log('dataFromBase?.length',dataFromBase?.length)
 

   for (let ind = 0; ind < dataFromBase?.length; ind++) {
      //console.log('dataFromBaseind',dataFromBase[ind].toDate().getTime())
     // console.log('result2',result2.getTime())
      
          if(result0.getTime() === dataFromBase[ind].toMillis()){
                  // console.log("jest wynik0")
                   setCloseTodaysIndex(ind)
                   break;
          } else if(result1.getTime() === dataFromBase[ind].toMillis()){
                 // console.log("jest wynik1")
                  setCloseTodaysIndex(ind)
                  break;
          } else if(result2.getTime() === dataFromBase[ind].toMillis()){
         // console.log("jest wynik2")
          setCloseTodaysIndex(ind)
                break;
           } else if(result3.getTime() === dataFromBase[ind].toMillis()){
             //  console.log("jest wynik3")
               setCloseTodaysIndex(ind)
                  break;
           }  else if(result4.getTime() === dataFromBase[ind].toMillis()){
              //console.log("jest wynik4")
              setCloseTodaysIndex(ind)
                 break;
          } else if(result5.getTime() === dataFromBase[ind].toMillis()){
           // console.log("jest wynik5")
            setCloseTodaysIndex(ind)
               break;
        } else if(result6.getTime() === dataFromBase[ind].toMillis()){
         //console.log("jest wynik5")
         setCloseTodaysIndex(ind)
            break;
     } 
          
          
          
         // else {console.log("nie ma wyniku")}
         


    }
}


 },[dataFromBase])
  

    return closeTodaysIndex;

}


