import { useEffect, useState } from "react";
import { useFetchDates } from "./useFetchDates";

// export interface ITimestampObject {
//   value: IdateObj | null;
//   //value(value: any): unknown;
//     toMillis(): string | number | Date;
//     seconds: number;
//         nanoseconds: number;     
// } 
export interface IdateObj {
  [x: string]: any;
    seconds: number;
        nanoseconds: number;   
        toMillis():  number | Date;   
}


export const useSearchDatesByIndex= (givenIndex: number | null ) => {  
    
    const [newDate, setNewDate] = useState<IdateObj>(null!)

    const data =  useFetchDates();
    //console.log("czy data", data)
    //to nie data tylko obiket)

    useEffect(()=>{

        if((data.length !==0) && givenIndex ){
                    if(givenIndex > (data?.length -1)){
                        alert("bład brak dat")
                        }   
                data?.forEach((elem, index) => {
//console.log("co to elem", elem)
                   if(givenIndex === index){  
                    setNewDate(elem)               
                    return newDate            
                    }   
                 });

            //console.log("hejFromUseSerachDates",newDate?.toDate() )       
             
          
        }          
    
},[data,givenIndex])

   

    return (newDate)

}