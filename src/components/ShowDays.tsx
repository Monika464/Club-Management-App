import { useEffect, useState } from "react";
import { IDateObject, useFetchDates } from "../hooks/useFetchDates";
import { pl } from "date-fns/locale";
import { format } from "date-fns";
import Trisc from '../assets/triskelion.png'


export interface IShowdaysProps {};


export const ShowDays: React.FunctionComponent<IShowdaysProps> =() => {

  const data =  useFetchDates();
  //console.log("data co tu mamy", data)
  
  const [duplicates,setDuplicates] = useState<IDateObject[] | null>()

  const [isShowAllDays, setIsShowAllDays] = useState(false);
// const manageShowAllDaysButton =()=>{
//   setIsShowAllDays(!isShowAllDays)
//}
const manageShowAllDaysButton =()=>{
  setIsShowAllDays(!isShowAllDays)
  //navigate('/userpanel')
} 
  
    const dateMap: { [key: string]: IDateObject[] } = {};
// Grupowanie dat według miesięcy
data?.forEach((elem) => {
        // const monthYearKey = ` ${elem.toDate().getMonth()}-${elem.toDate().getFullYear()}`;
         //const monthYearKey = `${elem.seconds}-${elem.nanoseconds}`; // Modyfikacja klucza
         const monthYearKey =  `${(new Date(elem.toMillis())).getMonth()}-${(new Date(elem.toMillis()) ).getFullYear()}`
         if (!dateMap[monthYearKey]) {
        dateMap[monthYearKey] = [];
          }
       dateMap[monthYearKey].push(elem);
       //console.log("milielems",(new Date(elem.toMillis()) ).getMonth())
    });



useEffect(()=>{
  const duplicates: IDateObject[] = [];

  data?.forEach((elem, indexA) => {

    // const timestampA = elem.toDate().getTime();
    const timestampA = elem.toMillis();
     //console.log('elem',elem)
     // Porównaj aktualny element z pozostałymi
     for (let i = indexA + 1; i < data.length; i++) {

       const timestampB = data[i].toMillis();
       
       if ((timestampA === timestampB) ) {
         duplicates.push(elem);
       }
     }
   });

setDuplicates(duplicates);

//console.log("cow duplicates",duplicates)
},[data])
    
     
    return(

        <>


      {isShowAllDays && <div>
<div className="datelist">

{Object.keys(dateMap).map((monthYearKey) => (
  <div key={monthYearKey}>

<h5>
  {/* Display the month and year as the section header */}
  <img src={Trisc} alt="Trisc" style={{ marginRight: '5px', marginLeft: '5px' ,height: '15px'}} />
  {format(dateMap[monthYearKey][0].toMillis(), "MMM yyyy", {
    locale: pl,
  })}
  {/* <img src={Trisc} alt="Trisc" style={{ marginLeft: '5px' }} /> */}
</h5>

   
    {dateMap[monthYearKey].map((elem, index) => (
      <p key={index}>
        {/* Display the day of the month and short weekday */}
        {`${format(elem.toMillis(), "d", {
          locale: pl,
        })} ${format(elem.toMillis(), "EEE", { locale: pl })}`}
      </p>
    ))}
  </div>
))}



{/* Iteruj po grupach dat i wyświetl daty w sekcjach */}
{/* {Object.keys(dateMap).map((monthYearKey) => (
          <div key={monthYearKey}>
             <h5>        
              {"|" +" " +new Date(dateMap[monthYearKey][0].toDate()).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })+" "+"|"}    
             </h5>

            {dateMap[monthYearKey].map((elem, index) => (
              <p key={index}>
                {`${elem.toDate().getDate()} ${elem.toDate().toLocaleDateString('default', {
                  weekday: 'short',
                })}`}
              </p>
            ))}
          </div>
        ))} */}



</div>
</div>}


<button onClick={manageShowAllDaysButton} className="btnsmall">
         {isShowAllDays? 'Zamknij' : 'Wyświetl daty'}
          </button>
    

    {duplicates &&  duplicates.map((dup, index )=><p key={index} style={{color: 'red'}}>Duplikat: {format(dup?.toMillis(), 'PPP', {locale: pl})}</p>)}
    
    </>)
}
