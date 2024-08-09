import Select from 'react-select'
import { useModUsersForSelect } from '../../hooks/useModUsersForSelect ';
import { useCallback, useEffect, useState } from 'react';
import { useSearchIndexCloseToday } from '../../hooks/useSearchIndexCloseToday';
import { useSearchDatesPlusN } from '../../hooks/useSearchDatesPlusN';
import { db } from '../../App';
import { doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';

export interface IDisplayUserDataAdmin{
}
export interface ITimestampObject {
  toMillis(): number | Date;    
  seconds: number;
  nanoseconds: number;     
} 

export const DisplayUserDataAdmin: React.FunctionComponent<IDisplayUserDataAdmin> =() => {
    
    const [chosenUserId, setChosenUserId] = useState<string | null>(null);
   // const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(null);
    const [rendered, setRendered] =   useState(false);

    const [debt, setDebt] = useState<number | null>(null); 
    const [add, setAdd] = useState<number | null>(null); 
  const [isMulti, setIsMulti] = useState<boolean | null>(false);
  const [isPass, setIsPass] = useState<boolean | null>(false);
  const [isPause, setIsPause] = useState<boolean>(false);
  const [isStop, setisStop] = useState<boolean>(false);
  const [due, setDue] = useState<ITimestampObject | null>(null);
  const [name, setName] = useState<string | null>("");
  const [surname, setSurname] = useState<string | null>("");
  
    const userModForSelect  =  useModUsersForSelect(); 

    const dzisIndex = useSearchIndexCloseToday();
    const paymentDateIndex  = useSearchDatesPlusN(0, chosenUserId);


    useEffect(() => {
        const timer = setTimeout(() => {
          setRendered(true);
        }, 1000); // 1000 milisekund = 1 sekunda
      
        return () => {
          clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
        };
      }, []);
     // useEffect(()=>{
        //const usersSelect = userModForSelect;
     // },[rendered,chosenUserId])

      //console.log("chosenUserByIdLabel",chosenUserByIdLabel);

///



const getUserDatafromBase = useCallback(async () => {
      
    // console.log('paymentDateIndex',paymentDateIndex, "dis index",dzisIndex )
       if(chosenUserId){  
             
         const userRef = doc(db, "usersData",chosenUserId);
         const docSnap = await getDoc(userRef)
         if (docSnap.exists()) {

                 //name
                 if(docSnap.data().name){
                    // console.log("czy tu jest debt",docSnap.data().debt)
                       setName(docSnap.data().name)
                   }

                        //surname
             if(docSnap.data().surname){
                // console.log("czy tu jest debt",docSnap.data().debt)
                   setSurname(docSnap.data().surname)
               }


                     //multi
             if(docSnap.data().optionMulti === true){
              // console.log("optionMulti",docSnap.data().optionMulti === true)
                 setIsMulti(true)
         // console.log("optionMulti",isMulti)
             }
              //pass
             if(docSnap.data().optionPass === true){
              // console.log("optionPass",docSnap.data().optionPass === true)
                 setIsPass(true)
             }
             //debt
             if(docSnap.data().debt){
              // console.log("czy tu jest debt",docSnap.data().debt)
                 setDebt(docSnap.data().debt)
             }
           
             //add
             if(docSnap.data().add){
                 setAdd(docSnap.data().add)
             }

             //due
             if(docSnap.data().due){
                 setDue(docSnap.data().due)
             }
             //pause
             if(docSnap.data().pause){
               setIsPause(true)
           }

             //stop
             if(docSnap.data().stop){
               setisStop(docSnap.data().stop)
             }
            
            }

         }
   

   }, [chosenUserId,db,rendered]);
   
   useEffect(()=>{
       getUserDatafromBase();
      // console.log( "name","multi",isMulti, isPause,"add",add)
       return reset;
  
     },[getUserDatafromBase,chosenUserId])

     const reset = useCallback(() => {
      // Stop, pause, multi, due
      setIsMulti(false);
      setIsPass(false);
      setDue(null);
      setDebt(null);
      setAdd(null);
      setIsPause(false);
      setisStop(false);
      setName(null);
      setSurname(null);
  }, []);

///

return (<div>
   <p className='title'> Informacje o użytkownikach</p>


   <Select
      closeMenuOnSelect={true}  
      options={userModForSelect}
      onChange={(choice) => {
        if(choice){
        setChosenUserId(choice.value);   
        //setChosenUserByIdLabel(choice.label);
      }
       // reset()
      }}
    />   
  

{/*uzytkownik multi */}
{isMulti && <>
   
   {debt && <div>
           <p> zadluzenie {debt} treningów</p>
    </div>}
   <div></div>
   </>}
   {/*uzytkownik pass*/}
   
   {isPass && <>
  
          {(isPause || isStop) && chosenUserId && <>
                {debt && <div>
                 <p> zadluzenie {debt} wejść</p>
                </div>}
            </>}
           {isPause && <>
             {add && <p>dodatkowo: {add} wejścia</p>}
              </>}
   </>}
     { (!isPause && !isStop && !isMulti && chosenUserId) && <div>
      {(paymentDateIndex < dzisIndex) &&  
     <p>zadłuzenie: {dzisIndex -paymentDateIndex} wejść</p> 
      }
     </div>}
     <br></br> 
   
     {chosenUserId && name && <div>{name} {surname}</div> }
   {/* {chosenUserId && due && <p>należna płatność {format(due.toDate(), 'dd.MM.yyyy')}</p>} */}
   {chosenUserId && due && <p>należna płatność {format(due.toMillis(), 'dd.MM.yyyy')}</p>}
   {chosenUserId && !isStop && !isPause && <div>status aktywny</div>}
   {chosenUserId && isStop && <p>członkostwo zatrzymane</p>}
   {chosenUserId && isPause && <p>zgłoszona kontuzja</p>}
   {chosenUserId && isPass &&  <p>uzytkownik karnetu</p>}
   {chosenUserId && isMulti && <p>uzytkownik multi/medicov</p>}
 




        
        </div>)
}

export default DisplayUserDataAdmin