import { useEffect, useState } from "react";
import { useFetchDates } from "./useFetchDates";
import { format } from "date-fns";
import pl from "date-fns/locale/pl";

export interface IdatesForSel {
    value: IdateObj
    label: string
}
export interface IdateObj{
    toMillis(): number | Date;
    seconds: number,
    nanoseconds: number
  }
  

export const useModDatesForSelect = () => {

    const [datesModForSelect,setDatesModForSelect] = useState<IdatesForSel[] | null>(null);


    const data = useFetchDates();

    useEffect(()=>{
       
        const temp: any[] = []; 
            data?.forEach((elem) => {
                const timestampA  = format(elem.toMillis(), "dd MMM yyyy", {
                    locale: pl,
                  });
                //const timestampA = elem.toDate().toString()
               // console.log("formattedDate",formattedDate)
                const pureVal = elem;
                temp.push({ value: pureVal, label: timestampA }) 
           
             })
             setDatesModForSelect(temp);   
          
       
    },[data])

   // console.log("datesModForSelect",datesModForSelect)

 //const data = useFetchDates();





 //console.log("")
  
    return datesModForSelect;
}