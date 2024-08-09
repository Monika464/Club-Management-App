import { useContext, useEffect, useState } from "react";
import { UserContext } from '../../context/UserContext';
import { useSearchDatesByIndex } from "../../hooks/useSearchDatesByIndex";
import { useSearchDatesPlusN } from "../../hooks/useSearchDatesPlusN";
import { useSearchIndexCloseToday } from "../../hooks/useSearchIndexCloseToday";
import { db } from "../../App";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import DateFnsFormat from "../DateFnsFormat";

export interface IdateObj{
  seconds: number;
  nanoseconds: number;
}

export const ReportInjuryUser2: React.FunctionComponent =() => {

  const { currentUser} = useContext(UserContext); 

  const paymentDateIndex  = useSearchDatesPlusN(0, currentUser?.uid);
  //console.log('paymentDateIndex',paymentDateIndex) 
  const navigate = useNavigate();

const dzisIndex = useSearchIndexCloseToday();
const dzisData = useSearchDatesByIndex(dzisIndex);
const [name, setName] = useState<string | null>(null)
const [surname, setSurname] = useState<string | null>(null);
const [stopReported, setStopReported] = useState<boolean>(false)
const [pausaReported, setPausaReported] = useState<boolean>(false)
const [pausaDate, setPausaDate] = useState<IdateObj | null>();
const [pausaDebt, setPausaDebt] = useState<number | null>(null) 
const [pausaAdd, setPausaAdd] = useState<number | null>(null) 
const [isSent, setisSent] = useState<boolean>(false) ;
const [injuryDescription, setInjuryDescripton] = useState<string>('');
//const [injuryIsEdited, setInjuryIsEdited] = useState<boolean>(false);
const [isMulti, setIsMulti] = useState<boolean>(false)
const [isPass, setIsPass] = useState<boolean>(false)
const [debt, setDebt] = useState<number | null>(null)
//const [rendered, setRendered] = useState(false);





   //ustawienie imienia i nazwiska

   const settingName = async ()=>{

    if(currentUser){ 
      const userRef = doc(db, "usersData",currentUser?.uid);
      const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setName(docSnap.data().name);
            setSurname(docSnap.data().surname);

              //jesli mamy stop
              if(docSnap.data().stop){
                setStopReported(true)
                 }
                 // jesli mamy pause
              if(docSnap.data().pause){
                  setPausaReported(true)
              }
                // jesli mamy dlug
              if(docSnap.data().debt){
                setDebt(docSnap.data().debt)
              }
              // jesli mamy multi
              if(docSnap.data().optionMulti === true){
                setIsMulti(true)
              }
               // jesli mamy pass
               if(docSnap.data().optionPass === true){
                setIsPass(true)
              }

             

           } 
     }

    }

useEffect(()=>{
     settingName();
  
          if(isMulti){
             setPausaDate(dzisData)
             }

         if(isPass){
           if(paymentDateIndex !== null && dzisIndex){                       
           setPausaDate(dzisData)
            //console.log("odpalonypaymentDateIndex",pausaDate?.toDate())
             if(paymentDateIndex >= dzisIndex ){
               setPausaAdd(paymentDateIndex - dzisIndex)
                }
              if(dzisIndex > paymentDateIndex){
              setPausaDebt(dzisIndex - paymentDateIndex)
             }          
            }
         }



},[dzisIndex,paymentDateIndex,settingName,isMulti,isPass])
  

    
    
 

  // console.log("dzisindex",dzisIndex)
// useEffect(()=>{
//   if(isMulti){
//     setPausaDate(dzisData)

//   }

// },[isMulti,settingName])
  
const dataToActivityArchive = {
  created_at: serverTimestamp(),
  pausaData: pausaDate,
  userUid: currentUser?.uid,
  kto: `${name} ${surname}`, 
  reason:  injuryDescription        
} 

//funkcja zapisujaca w bazie

const sendStopToBase =async()=>{

if(currentUser){

        const paymentDataRef = doc(db, "usersData", currentUser.uid);

      if(isMulti){
        await updateDoc(paymentDataRef, {  
          pause: pausaDate,
          debt: debt,
          add: null
        })
        .then(()=>console.log("debt modified. update succesful"))
        .then(()=>setisSent(true))
        .then(()=> alert("przerwa w treningach zapisana"))
         .then(()=> navigate('/userpanel'))
      
        await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
           // .then(()=> alert("przerwa w treningach zapisana"))
        //  .then(()=> navigate('/userpanel'))
  
      } 

        if(isPass){
              
          if(!pausaReported && !stopReported){
            await updateDoc(paymentDataRef, {
               pause: pausaDate,
               due: null,
               add: pausaAdd,
               debt: pausaDebt
             })
            .then(()=>console.log("debt modified. update succesful"))
             .then(()=>  setPausaDate(null))
            .then(()=>   setisSent(true))
            .then(()=>   setPausaAdd(null))  
            .then(()=> alert("przerwa w treningach zapisana"))
            .then(()=> navigate('/userpanel'))
          
        }
         

          await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
        //  .then(()=> console.log("archive tu"))
        //   .then(()=> navigate('/injuryuser'))
          }


       }

   }

         const handleDescriptInj =(event: { target: { value: any; }; })=>{
        const { value } = event.target
        setInjuryDescripton(value);
       }





return (
<>

{/*<button onClick ={handleEditInjury} style={{color: "red"}}>injury managing</button>*/}


{/*<button onClick={getAddfromBase}>Wylicz pauze </button>*/}




  {/* {pausaDate && !pausaReported && !stopReported && <p>Treningi zostana zawieszone: {pausaDate?.toDate()?.toString()}</p>} */}
  {pausaDate && !pausaReported && !stopReported && 
  <div className="archive">
  <p>Treningi zostana zawieszone: </p>
     <p><DateFnsFormat element={pausaDate}/></p>
     </div>}
  {pausaDebt &&!pausaReported && !stopReported && <p>istniejące zadłużenie: {pausaDebt} treningów.</p>}
  {pausaAdd && !pausaReported && !stopReported && <p>pozostało opłaconych: {pausaAdd} treningów</p>}
  {pausaDate && !pausaReported && !stopReported && <div>
                 Uzupelnij formularz wspisując powód zawieszenia
                 <br></br><br></br>
                   {/* <input */}
                   <textarea
                    //  type='text'
                     name='text'
                     value={injuryDescription}
                     onChange={handleDescriptInj}
                     placeholder="Co się stało?"
                     required
                   />
                 <button onClick={sendStopToBase} className="btn">Wyślij </button>
                {isSent &&<p>wyslano</p>} 
  </div>}
  
  {/* <button onClick={handlePrzenies}>przenies</button>  */}

    </>)
}