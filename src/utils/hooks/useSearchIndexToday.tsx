// import { useEffect, useState } from "react";
// import { useFetchDates } from "./useFetchDates";

// export const useSearchIndexToday = (): number | null => {

//    console.log("useSearchIndexToday ODPALONY")

//     const [today, setToday] = useState<Date | null>(null);
//     const dataFromBase = useFetchDates();
//     const [todaysIndex, setTodaysIndex] =  useState<number | null>(null);
   

//     useEffect(()=>{

//       if(dataFromBase){
     
//         setToday(new Date())
//         //console.log("today",today);
//         //console.log("dataFromBase",dataFromBase);

//         if(today){

//         const todayYear = today?.getFullYear();
//         const todayMonth = today?.getMonth();
//         const todayDay = today?.getDate();
//         //console.log("todayDay",todayDay) 
//  //console.log("dataFromBase?.length",dataFromBase?.length)

//         for (let ind = 0; ind < dataFromBase?.length; ind++) {
//          //console.log("dataFromBase?.length",dataFromBase?.length)
//             const dat = dataFromBase[ind];
//             const datYear = dat?.toDate().getFullYear();
//             const datMonth = dat?.toDate().getMonth();
//             const datDay = dat?.toDate().getDate();

//             //console.log("datDay",datDay) 
//             const todayDay2 = todayDay+1;
//             const todayDay3 = todayDay2+1;
//             const todayDay4 = todayDay3+1;
//             //console.log("czy rowne",todayDay === datDay)


//                      if (
//                         todayYear === datYear &&
//                         todayMonth === datMonth &&
//                         todayDay === datDay
                        
//                      ) {
//                        // console.log("maa1", dat, ind);
//                         //console.log("test",todayDay+1);
                        
//                          setTodaysIndex(ind);
         
//                          break; // Przerwij pętlę po znalezieniu odpowiedniego indeksu
//                      } else if(
//                         todayYear === datYear &&
//                         todayMonth === datMonth &&
//                         todayDay2 === datDay
//                      ) {
//                        //console.log("maaaam2", dat, ind);
//                         //console.log("test",todayDay+1);
//                         //console.log("maa2", dat, ind);
//                          setTodaysIndex(ind);
         
//                          break;

//                      } else if(
//                         todayYear === datYear &&
//                         todayMonth === datMonth &&
//                         todayDay3 === datDay
//                      ) {
//                        // console.log("maa3", dat, ind);
//                         //console.log("test",todayDay+1);
                        
//                          setTodaysIndex(ind);
         
//                          break;

//                      } else if(
//                         todayYear === datYear &&
//                         todayMonth === datMonth &&
//                         todayDay4 === datDay
//                      ) {
//                         //console.log("maa4", dat, ind);
//                         //console.log("test",todayDay+1);
                        
//                          setTodaysIndex(ind);
         
//                          break;

//                      }


//                   }
//         }
//   //console.log("original",todaysIndex);
// }
//   //chyba brak 

//     },[dataFromBase])


 

//     return todaysIndex;

// }
