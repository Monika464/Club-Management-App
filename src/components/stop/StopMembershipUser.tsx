import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../App";
import { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext';
import { useSearchIndexCloseToday } from "../../hooks/useSearchIndexCloseToday";
import { useSearchDatesPlusN } from "../../hooks/useSearchDatesPlusN";
import { useSearchDatesByIndex } from "../../hooks/useSearchDatesByIndex";
//import { useSearchIndexAnyDate } from "../../hooks/useSearchIndexAnyDate";
import { useNavigate } from "react-router-dom";
import DateFnsFormat from "../DateFnsFormat";
import { compareAsc, isToday } from "date-fns";
//const { compareAsc, parse, isToday } = require('date-fns');

export interface IdateObj{
  seconds: number;
  nanoseconds: number;
  toMillis(): number | Date; 
}


const StopMembershipUser: React.FunctionComponent =() => {
   
    const { currentUser} = useContext(UserContext); 
    const [isSent, setisSent] = useState<boolean>(false) ;
    //const [treningsDebt, setTreningsDebt] = useState<number | null>(null) ;
const [currentUserPausaDate, setCurrentUserPausaDate] = useState<IdateObj | null>();
const [dueDate, setDueDate] = useState<IdateObj | null>()
const [stopReported, setStopReported] = useState<boolean>(false)
const [stopDate, setStopDate] = useState<IdateObj | null>()
//const [stopDateIndex, setStopDateIndex] = useState<number | null>(null) 
const [finalDebt, setFinalDebt] = useState<number | null>(null) 
const [name, setName] = useState<string | null>(null)
const [surname, setSurname] = useState<string | null>(null)
const [isMulti, setIsMulti] = useState<boolean>(false)
const [isPass, setIsPass] = useState<boolean>(false)
const [rendered, setRendered] = useState(false);
//const [dataDue, setDataDue] = useState<IdateObj | null>()

const paymentDateIndex  = useSearchDatesPlusN(0, currentUser?.uid);
const dzisIndex = useSearchIndexCloseToday();
const dzisData = useSearchDatesByIndex(dzisIndex);
const navigate = useNavigate();
//const dateSzukana = useSearchDatesByIndex(modIndFin) 

//console.log("paymentDateIndex", paymentDateIndex, surname)
//ustawienie podstawowych danych

 // console.log("stop date from base", stopDateFromBase);
useEffect(() => {
  const timer = setTimeout(() => {
    setRendered(true);
  }, 1000); // 1000 milisekund = 1 sekunda

  return () => {
    clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
  };
}, []);

const settingName = useCallback( async ()=>{

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
         
                  //jesli mamy multi
                if(docSnap.data().optionMulti === true){  
                      setIsMulti(true);
                      setStopDate(dzisData);
                     //jezeli jest debt w multi
                      if(docSnap.data().debt){
                    // console.log("uzytkownik zadluzony")        
                      setFinalDebt(docSnap.data().debt)
                      }
                    //jezeli mamy pauze w multi
                      if(docSnap.data().pause){
                      setCurrentUserPausaDate(docSnap.data().pause);
                      // console.log("uzytkownik pauzujacy")
                     }
                   }

              if(docSnap.data().optionPass === true){  
                 setIsPass(docSnap.data().optionPass);

                        //jesli mamy pauze
                        if(docSnap.data().pause){
                          setCurrentUserPausaDate(docSnap.data().pause);
                          //console.log("currentUserPausaDate",currentUserPausaDate)
                          setStopDate(dzisData);
            
                         if(docSnap.data().debt){          
                         setStopDate(dzisData);
                         setFinalDebt(docSnap.data().debt)
                         }
                      } 

                      //jesli mamy due
                     if(docSnap.data().due){  
                       setDueDate(docSnap.data().due);  
                       }
   
              if((paymentDateIndex !== null) && dzisIndex){
                 setStopDate(dzisData)
                    if(dzisIndex > paymentDateIndex){
                      setFinalDebt(dzisIndex - paymentDateIndex)
                    }  
              }


                   //temu sie przyjrzec czemy nie liczy
                //  if(dzisIndex < paymentDateIndex){
                //   const temp = paymentDateIndex - dzisIndex
                //   const newDI = dzisIndex + temp;
                //   console.log("newDI",newDI)
                //   setModIndFin(newDI)
                //   console.log("modIndFin",modIndFin)
                //   setStopDate(dateSzukana) 
                //  }   
                      
               
               
             
          
          }
     } else {

    console.log("brak polaczenia z baza")
   }

  

if(dueDate){
  // Sprawdź, czy jest dzisiaj
      if (isToday(dueDate.toMillis())) {
        // console.log("To jest dzisiaj!");
        } else {
      // Porównaj daty
    const comparisonResult = compareAsc(dueDate.toMillis(), new Date());
       if (comparisonResult === 1) {
     //console.log("To będzie później");
  } else if (comparisonResult === -1) {
    //console.log("To było wcześniej");
  } 
}
}
          
   }
   },[currentUser,db,dzisData,rendered])
 
  //console.log("modDatFin1",modDatFin) 
          
useEffect(()=>{
    
      settingName()  
     // setModDatFin(dateSzukana);
      // console.log('dateSzukana',dateSzukana?.toDate())
      // console.log('modDatFin2',modDatFin)
      // console.log('modIndFin',modIndFin)
    // console.log("uzytkownik pauzujacy")
   
 },[currentUser,dzisIndex,settingName,rendered])

 //console.log("czy jest stopdate",stopDate)

     const dataToActivityArchive = {
      created_at: serverTimestamp(),
        stopData: stopDate,
        userUid: currentUser?.uid,
        kto: `${name} ${surname}`,          
      } 

      //funkcja zapisujaca w bazie
//console.log("z funkcji zapisującej w bazie",'stopDate',stopDate,'finalDebt',finalDebt,'name',name)
     const sendStopToBase =async()=>{
if(currentUser) {
    const paymentDataRef = doc(db, "usersData", currentUser.uid);
    
    if(currentUserPausaDate){    
      await updateDoc(paymentDataRef, {
        pause: null,  
        add: null,
        stop: stopDate,  
        restart: null,
        debt: finalDebt     
      })
      .then(()=>console.log("stop date update succesful"))
      .then(()=>  setStopDate(null))
      .then(()=>   setisSent(true))
      .then(()=> alert("rezygnacja zapisana"))
      .then(()=> navigate('/userpanel'))
    } 

    if(isMulti){
      await updateDoc(paymentDataRef, {
        pause: null,  
        add: null,
        stop: stopDate,  
        restart: null,
        debt: finalDebt     
      })
      .then(()=>console.log("stop date for multiuser update succesful"))
      .then(()=>  setStopDate(null))
      .then(()=>   setisSent(true))
      .then(()=>   setFinalDebt(null))
      .then(()=> alert("rezygnacja zapisana"))
      .then(()=> navigate('/userpanel'))
    }
   // console.log("czy tu jest isPass",isPass)   false
    if(isPass){
      if(finalDebt){
          await updateDoc(paymentDataRef, {
             pause: null,  
             add: null,
             stop: stopDate,  
             restart: null,
             debt: finalDebt,
             due: null  
          })
          .then(()=>console.log("stop date for passuser update succesful"))
          .then(()=>  setStopDate(null))
          .then(()=>   setisSent(true))
          .then(()=>   setFinalDebt(null))
          .then(()=> alert("rezygnacja zapisana"))
          .then(()=> navigate('/userpanel'))

      }
     
        //  if(modDatFin){
        //     await updateDoc(paymentDataRef, {
        //      pause: null,  
        //      add: null,
        //      stop: modDatFin,  
        //      restart: null,
        //      debt: null,
        //      due: null  
        //    })
        //     .then(()=>console.log("stop date for passuser update succesful"))
        //     .then(()=>  setStopDate(null))
        //     .then(()=>   setisSent(true))
        //     .then(()=>   setFinalDebt(null))

        //     }


    }




         await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
        // .then(()=> console.log("archive"))  
        // .then(()=> navigate('/membershipuser'))

  }
}
  
// console.log("porownanie na user",compareAsc(stopDate?.toDate(), new Date()) === 1)
// console.log("poro ile na user",compareAsc(stopDate?.toDate(), new Date()))
// console.log("jaka stopdte",stopDateFromBase?.toDate() )

// const cot = dzisIndex >= paymentDateIndex
// console.log("dzis indeks wiekszy lub rowny od platnosci jest nalaznosc",cot)
// const acot = dzisIndex < paymentDateIndex
// console.log("dzis dzis indeks mniejszy od platnosci, jest nadpłata ",acot)
// const xacot = (dzisIndex >= paymentDateIndex) || !dueDate 
// console.log("zaleglosc albo nie ma due date ",xacot)
// //ktore prewdziwe
// console.log("rownanie", dzisIndex >= paymentDateIndex)
// console.log("brak due", !dueDate)

// console.log("brak due inaczej", paymentDateIndex === (null || undefined))

return (<div>

  {/* <button onClick={getAddfromBase}>Skalkuluj date zakonczenia</button> */}
 
  {/* {stopReported && <p>uczestnictwo w klubie będzie zatrzymane od {stopDateFromBase?.toDate().toString()}</p>} */}
  {/* {!stopReported && <p>uczestnictwo w klubie będzie zatrzymane od 
    {stopDateFromBase?.toDate().toString()}</p>} */}
   {/* {stopReported && <p>juz zastopowane</p>} */}

{/* {stopDateFromBase && <div className="archive">    
         <p>Treningi zatrzymane od:  </p>
        <p><DateFnsFormat element={stopDateFromBase}/></p>
        </div>
} */}
          
    



  {currentUserPausaDate && <p>Pauzujacy użytkownik rezygnuje dzis z członkostwa</p>}
    {!stopReported && ((dzisIndex >= paymentDateIndex) || paymentDateIndex === (null || undefined) ) &&
     <div className="archive">    
     <p>Czy na pewno chcesz zakończyć uczestnictwo w treningach? Treningi zostana zakonczone:  </p>
        <p><DateFnsFormat element={dzisData}/></p>
        </div>}
     {(dzisIndex < paymentDateIndex) && !stopReported && dueDate &&
       <div className="archive">    
       <p>Czy na pewno chcesz zakończyć uczestnictwo w treningach? Treningi zostana zakonczone:  </p>
         <p><DateFnsFormat element={dueDate}/></p>
            </div>} 
        
        
     
  {!stopReported && finalDebt &&<p>istniejące zadłużenie: {finalDebt} treningów</p>}
  <br></br>
  {!stopReported && <button onClick={sendStopToBase} className="btn">Potwierdż</button>}
  {isSent &&<p>wyslano</p>}

    
    </div>) 
}

export default StopMembershipUser;