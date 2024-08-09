
import { useEffect, useState } from "react";
import { useModUsersForSelect } from "../hooks/useModUsersForSelect ";
import { useSearchIndexCloseToday } from "../hooks/useSearchIndexCloseToday";
import { useSearchDatesByIndex } from "../hooks/useSearchDatesByIndex";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../App";
import Select from 'react-select'
import DateFnsFormat from "./DateFnsFormat";

//data do zatwierdzenia cofke sie o sume tych debt wzgledem daty wybranej rozpoczecia
export interface US {
    value: string 
    label: string 
}

export interface IDateObject{
  seconds: number;
  nanoseconds: number;
}

const SwitchMultiToPass: React.FunctionComponent =() => {

    const [newUsersList, setNewUsersList] = useState<US[] >([]);
    const [chosenUserId, setChosenUserId] = useState<string | null>(null)
    // const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
const [surname, setSurname] = useState<string | null>(null);
//console.log("newUserList",newUsersList)
//const [stopReported, setStopReported] = useState<boolean>(false)
//const [pausaReported, setPausaReported] = useState<boolean>(false)
const [multiReported, setMultiReported] = useState<boolean>(false);
const [hasDebt, setHasDebt] = useState<number | null>(null);
const [newPaymentDateIndex, setNewPaymentDateIndex] = useState<number | null>(null);
const [isSent, setIsSent] = useState<boolean>(false);
const [isCalculating, setIsCalculating] = useState<boolean>(false);
const [newPaymentDate, setNewPaymentDate] = useState<IDateObject | null>(null);

    const userModForSelect  =  useModUsersForSelect(); 
    const dzisIndex = useSearchIndexCloseToday();
    const dzisData = useSearchDatesByIndex(dzisIndex);
    
    //modyfikowanie listy userów

    useEffect(() => { 
        const fetchData = async () => {
            const usersToAdd = [];

            for (let i = 0; i < userModForSelect.length; i++) {
                const userRef = doc(db, "usersData", userModForSelect[i].value);
                const docSnap = await getDoc(userRef);  
                
                if (docSnap.exists() && docSnap.data()?.optionMulti) {
                    // Dodawanie użytkownika do listy w formie obiektu
                    usersToAdd.push({ value: userModForSelect[i].value, label: userModForSelect[i].label });
                }

                setNewUsersList(usersToAdd); 
            }

            
        };

        fetchData();

        //console.log('newUsersList',newUsersList)
    }, [db,useModUsersForSelect,dzisData]);

    const getAddfromBase =async ()=>{
 
      setIsCalculating(true); 
        if(chosenUserId){
    
             const userRef = doc(db, "usersData",chosenUserId);
             const docSnap = await getDoc(userRef);
                  if (docSnap.exists()) {

                    setName(docSnap.data().name)
                    setSurname(docSnap.data().surname)
    
                    //jesli mamy stop
                     // if(docSnap.data().stop){
                      //setStopReported(true)
                      // }
                      // if(docSnap.data().pause){
                       // setPausaReported(true)
                       //}
    
                       if(docSnap.data().optionMulti){
                        setMultiReported(true)
                      }
                  
                
                    //jesli mamy due optionMulti
                      if(docSnap.data().optionMulti){   
                             // console.log("multi user") 
                            if(docSnap.data().debt){
                            setHasDebt(docSnap.data().debt)
                           }
                        }   
         
        } else {console.error("no database connection")}
    
      }
    
      }


    

          const calcDatOfNewPay =  useSearchDatesByIndex(newPaymentDateIndex)
    
          //const calcDatOfNewPay = newPaymentDateIndex !== null ? useSearchDatesByIndex(newPaymentDateIndex) : null;

            useEffect(()=>{
    
            if( chosenUserId){
  
             if(!hasDebt && dzisIndex !== null){
             setNewPaymentDateIndex(dzisIndex)
           }
              
           if(hasDebt && dzisIndex !== null){
            setNewPaymentDateIndex(dzisIndex - hasDebt)
                }

          if(calcDatOfNewPay !== null && chosenUserId){
            setNewPaymentDate(calcDatOfNewPay);
           }       
         
           }
             },[chosenUserId,multiReported,calcDatOfNewPay]) 

            

    //console.log("newPaymentDate",newPaymentDate);

    const dataToActivityArchive = {
      timestamp: serverTimestamp(),
      optionismulti: false,
      userUid: chosenUserId,
      kto: `${name} ${surname}`,          
    } 
    
  
    const handleSwitchToPass =async ()=>{

        const paymentDataRef = doc(db, "usersData", chosenUserId!);
     
        
          await updateDoc(paymentDataRef, {
           optionMulti: false,
           optionPass: true,
           debt: hasDebt,
           due: calcDatOfNewPay
          })
          .then(()=>console.log("now pass user"))
          //.then(()=>  setStopDate(null))
          .then(()=>   setIsSent(true))
         
           
          await addDoc(collection(db, "optionsArchive"), dataToActivityArchive)
          .then(()=> console.log("archive"))
       
           
  
        //zczytywanie danych isera
      
  
  
  
      }


    return(<div>
  
        <Select
      closeMenuOnSelect={true}  
      options={newUsersList}
      onChange={(choice) => {
        if(choice && choice.value){
        setChosenUserId(choice.value);   
      }
        //setChosenUserByIdLabel(choice.label); 
        //setIsPausa(false);  
        setNewPaymentDate(null);
        setIsCalculating(false); 
        }}   
    />
    {/*<p>{chosenUserByIdLabel}</p>*/}
    <button onClick={getAddfromBase} className="btn">skalkuluj sytuacje usera </button>  
   <br></br>
   
    {newPaymentDate && isCalculating && 
   <div className="archive">
      <p>nalezność od</p>
     <p><DateFnsFormat element={newPaymentDate}/></p>
     </div>}

    <button onClick={handleSwitchToPass} className="btn">przelacz usera na pass</button>  
      {isSent && <p>uzytkownik teraz pass</p>}

        </div>)
}

export default SwitchMultiToPass 