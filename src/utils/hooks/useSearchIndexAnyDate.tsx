import { useEffect, useState } from "react";
import { useFetchDates } from "./useFetchDates";

export interface IDateObject {
    toMillis(): number;
    seconds: number;
    nanoseconds: number;
}

export const useSearchIndexAnyDate = (jakasData: IDateObject | null | undefined) => { 

const [dateIndex,setDateIndex] = useState<number | null>(null);

//if(jakasData){console.log("czy jakasData jest",jakasData?.toDate().getTime()) }


    const data = useFetchDates(); 

    useEffect(()=>{
       
        //const temp: any[] = []; 
            data?.forEach((elem, index) => {
               // console.log("co to za elem",elem?.toDate().getTime(), index);
                //if(jakasData?.toDate().getTime() === elem.toDate().getTime()){
                    if(jakasData?.toMillis() === elem.toMillis()){
               // console.log("mamy rowna date",elem?.toDate().getTime(), index);
                setDateIndex(index) 
            }
            
             })
            
         //  console.log("czy data jest w zrodle datesIndex",dateIndex)
       
    },[data,jakasData])

return dateIndex 
}