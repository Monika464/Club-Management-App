import Select from 'react-select'
import { useModUsersForSelect } from '../../hooks/useModUsersForSelect ';
import { useEffect, useState } from 'react';
import { useSearchDatesPlusN } from '../../hooks/useSearchDatesPlusN';
import { useSearchIndexCloseToday } from '../../hooks/useSearchIndexCloseToday';
import { useSearchDatesByIndex } from '../../hooks/useSearchDatesByIndex';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../App';
//import { useSearchIndexAnyDate } from '../../hooks/useSearchIndexAnyDate';
import DateFnsFormat from '../DateFnsFormat';
import { compareAsc} from 'date-fns';

export interface US {
  value: string; 
  label: string; 
}

export interface IusersForSelect {
  value: string; 
  label: string; 
}

export interface IdateObj{
  seconds: number;
  nanoseconds: number;
  toMillis(): number | Date; 
}

const StopMembershipAdmin2: React.FunctionComponent =() => {


    const [chosenUserId, setChosenUserId] = useState<string>('')
    const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(null)

    const [isSent, setisSent] = useState<boolean>(false) ;
    const [currentUserPausaDate, setCurrentUserPausaDate] = useState<Date | null>();
const [dueDate, setDueDate] = useState<IdateObj | null>(null)
const [stopReported, setStopReported] = useState<boolean>(false)
const [stopDate, setStopDate] = useState<IdateObj | null>()
const [finalDebt, setFinalDebt] = useState<number | null>(null) 
const [name, setName] = useState<string | null>(null)
const [surname, setSurname] = useState<string | null>(null)
const [isMulti, setIsMulti] = useState<boolean>(false)
const [isPass, setIsPass] = useState<boolean>(false)
const [isMoved, setIsMoved] = useState<boolean>(false)
const paymentDateIndex  = useSearchDatesPlusN(0, chosenUserId);
const dzisIndex = useSearchIndexCloseToday();
const dzisData = useSearchDatesByIndex(dzisIndex);
const [newUsersList, setNewUsersList] = useState<US[]>([])  
//const [modIndFin, setModIndFin] = useState<number | null>(null) 
//const [modDatFin, setModDatFin] = useState<Date | null>(null) 
//const [dataDue, setDataDue] = useState<Date | null>()
//const [stopDateFromBase, setStopDateFromBase] = useState<Date | null>()

const userModForSelect  =  useModUsersForSelect();  

//console.log("userModForSelect",userModForSelect)

const [rendered, setRendered] = useState(false);

useEffect(() => {
    const timer = setTimeout(() => {
      setRendered(true);
    }, 1000); // 1000 milisekund = 1 sekunda
  
    return () => {
      clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
    };
  }, []);
  
useEffect(() => {

 // console.log("czy mamy ",userModForSelect)   

    const fetchData = async () => {  
        const usersToAdd = [];

        //modyfikowanie listy 

        for (let i = 0; i < userModForSelect.length; i++) {
            const userRef = doc(db, "usersData", userModForSelect[i].value);
            
            const docSnap = await getDoc(userRef); 
             
            if (docSnap.exists()) {
 
                // Dodawanie użytkownika do listy w formie obiektu
                //usersToAdd.push({ value: userModForSelect[i].value, label: userModForSelect[i].label });
                    if((docSnap.data().optionMulti === true) && (!docSnap.data().stop)&& (docSnap.data().id === userModForSelect[i].value)){
                    
                    usersToAdd.push({ value: userModForSelect[i].value, label: userModForSelect[i].label });
                    } 
                    if( (docSnap.data().id  === userModForSelect[i].value)
                    && (docSnap.data().due || docSnap.data().pause)
                    ){
                       
                        usersToAdd.push({ value: userModForSelect[i].value, label: userModForSelect[i].label });
                     }
           
            }

            setNewUsersList(usersToAdd); // Aktualizuj stan tablicy  
        }

        
    }; 

    fetchData();

    //console.log('newUsersList222',newUsersList)

}, [db,dzisData,paymentDateIndex,dzisIndex,rendered]);


//AKCJE PO WYBORZE USERA


useEffect(()=>{

  const settingName = async ()=>{

        if(chosenUserId){ 
          const userRef = doc(db, "usersData",chosenUserId);
          const docSnap = await getDoc(userRef);
  
              if (docSnap.exists()) {
                //console.log("tutaj snap",docSnap.data())
                setName(docSnap.data().name);
                setSurname(docSnap.data().surname)        
                }

         }
  
      }
      settingName() 

 },[chosenUserId,db,dzisData,paymentDateIndex,dzisIndex,rendered])

  

//funkcja kalkulująca naleznosc

  const getAddfromBase =async ()=>{

        if(chosenUserId){ 
            const userRef = doc(db, "usersData",chosenUserId);
            const docSnap = await getDoc(userRef);
    
                if (docSnap.exists()) { 
                  
                  //ustaw ze wczytuje
                  setIsMoved(true)
                      //jesli mamy stop
                      if(docSnap.data().stop){
                      setStopReported(true)
                      //setStopDateFromBase(docSnap.data().stop)
                    
                      }

                       //jesli mamy multi
                      if(docSnap.data().optionMulti === true){  
                       // console.log("uzytkownik z multi")
                           setIsMulti(true);
                          setStopDate(dzisData);
                         // console.log("isMulti",isMulti);
                          //console.log("StopDate",stopDate);
                            
                        
                            //jezeli jest debt w multi
                              if(docSnap.data().debt){
                              setFinalDebt(docSnap.data().debt)
                              }   
                              
                              //jezeli mamy pauze w multi
                            if(docSnap.data().pause){
                            setCurrentUserPausaDate(docSnap.data().pause);
                            // console.log("uzytkownik pauzujacy")
                            } 

                           
                          }
                       
                      //jesli mamy pass
                       if(docSnap.data().optionPass === true){  
                          setIsPass(docSnap.data().optionPass);

                                  //jesli mamy pauze
                                if(docSnap.data().pause){
                                 //console.log("uzytkownik pauzujacy")
                                 setStopDate(dzisData);
                                 setCurrentUserPausaDate(docSnap.data().pause);


                                 //jesli zadluzenie w pauzie
                              if(docSnap.data().debt){          
                               //console.log("uzytkownik zadluzony")
                              setStopDate(dzisData);
                               setFinalDebt(docSnap.data().debt)  
                              }
                          } 
                            //jesli mamy due 
                           if(docSnap.data().due){ 
                            setDueDate(docSnap.data().due)

                      if((paymentDateIndex !== null) && dzisIndex){
                             

                              if(dzisIndex > paymentDateIndex){
                                setFinalDebt(dzisIndex - paymentDateIndex)
                                setStopDate(dzisData)
                              }  
                              if(dzisIndex < paymentDateIndex){
                                setStopDate(dueDate)

                              }
                              // const temp = paymentDateIndex - dzisIndex
                              // const newDI = dzisIndex + temp;
                              //  setModIndFin(newDI)
                              // }  
                       }

                      }  

                     }
        
    } else {
      console.log("brak polaczenia z baza")
    }
}
  }

//console.log("stopDateFromBase",stopDateFromBase, stopReported)
  
// useEffect(()=>{
//   if (isToday(dueDate)) {
//     console.log("To jest dzisiaj!");
//   } else {
//     // Porównaj daty
//     const comparisonResult = compareAsc(dueDate?.toDate(), new Date());
//     console.log("comparisonResult",comparisonResult)
//     if (comparisonResult === 1) {
//       console.log("To będzie później");
//     } else if (comparisonResult === -1) {
//       console.log("To było wcześniej");
//     } 
//       else {
//       console.log("To jest dokładnie teraz!");
//     }
//   }


//   //console.log("porownujemy", compareAsc(new Date(2024, 0, 6), new Date()))
  
// },[getAddfromBase])

  
  
  const dataToActivityArchive = {
       created_at: serverTimestamp(),
        stopData: stopDate,
        userUid: chosenUserId,
        kto: `${name} ${surname}`,          
      } 


      //console.log("dueDate jest w przyszlosci",compareAsc(dueDate?.toMillis(), new Date()) === 1)

    //MODYFIKOWANIE ZAPISU DANEGO USERA W BAZIE
      //funkcja zapisujaca w bazie

     const sendStopToBase =async()=>{

    const paymentDataRef = doc(db, "usersData", chosenUserId);
 
       if(currentUserPausaDate){    
        await updateDoc(paymentDataRef, {
          pause: null,  
          add: null,
          stop: stopDate,  
          restart: null ,
          debt: finalDebt   
        })
        .then(()=>console.log("stop date update succesful"))
        .then(()=>  setStopDate(null))
        .then(()=>   setisSent(true))
       
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
    
          }
         if(dueDate){
             if(compareAsc(dueDate.toMillis(), new Date()) === 1){
                await updateDoc(paymentDataRef, {
                 pause: null,  
                 add: null,
                 stop: dueDate,  
                 restart: null,
                 debt: null,
                 due: null  
               })
                .then(()=>console.log("stop date for passa user update succesful"))
                .then(()=>  setStopDate(null))
                .then(()=>   setisSent(true))
                .then(()=>   setFinalDebt(null))
    
                }
              }
    
        }

    
             await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
            .then(()=> console.log("archive"))  


       }   


    //  if(!currentUserPausaDate && !stopReported){ 
    //     await updateDoc(paymentDataRef, {
    //        stop: stopDate,
    //        due: null,
    //        restart: null
    //      })
    //      .then(()=>console.log("debt modified. update succesful"))
    //      .then(()=>  setStopDate(null))
    //      .then(()=>   setisSent(true))

    //      const docRef = await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
    //      .then(()=> console.log("archive"))
    //     }

    //    if(finalDebt){
    //       await updateDoc(paymentDataRef, {
    //       debt: finalDebt
    //     })
    //     .then(()=>console.log("debt modified. update succesful"))
    //     .then(()=>{setFinalDebt(null)})
    //    }
     

 


  //const dateSzukana = useSearchDatesByIndex(modIndFin)  
  //console.log("stopdatee", stopDate?.toDate())
  //console.log("duedate", dueDate?.toDate())

return(<>

<Select
      closeMenuOnSelect={true}  
      options={newUsersList}
      onChange={(choice) => {
        if(choice){
        setChosenUserId(choice.value);   
        setChosenUserByIdLabel(choice.label);  
        } 
        setStopReported(false);
        setisSent(false);
        setStopDate(null);
        setName(null);
        setSurname(null);
        setFinalDebt(null);
        setCurrentUserPausaDate(null);
        setIsMoved(false)
        setDueDate(null)
        }}   
    />
    <p>{chosenUserByIdLabel}</p>

    {<button onClick={getAddfromBase} className='btn'>Skalkuluj date zakonczenia</button>}
 
 
   


 {currentUserPausaDate && <p>Pauzujacy użytkownik rezygnuje dzis z członkostwa</p>}
 {/* {!stopReported && isMoved &&
     <div className="archive">    
     <p>Czy na pewno chcesz zakończyć uczestnictwo w treningach? Treningi zostana zakonczone:  </p>
        <p><DateFnsFormat element={dzisData}/></p>
     </div>}
     {(dzisIndex < paymentDateIndex) && !stopReported && stopDate && isMoved &&
       <div className="archive">    
       <p>Czy na pewno chcesz zakończyć uczestnictwo w treningach? Treningi zostana zakonczone:  </p>
         <p><DateFnsFormat element={dueDate}/></p>
            </div>}  */}

 {dueDate && <>
      { compareAsc(dueDate?.toMillis(), new Date()) === 1 ? <div className="archive">    
                                                            <p>Czy na pewno chcesz zakończyć uczestnictwo w treningach? Treningi zostana zakonczone:  </p>
                                                            <p><DateFnsFormat element={dueDate}/></p>
                                                          </div>
                                                       : isMoved ? <div className="archive">    
                                                           <p>Czy na pewno chcesz zakończyć uczestnictwo w treningach? Treningi zostana zakonczone:  </p>
                                                           <p><DateFnsFormat element={dzisData}/></p>
                                                         </div>  :  <p></p>
       }
</>}

{isMulti && <div>  <p>Czy na pewno chcesz zakończyć uczestnictwo w treningach? Treningi zostana zakonczone:  </p>
                                                            <p><DateFnsFormat element={stopDate}/></p>
                                                            </div>}
 

 {/* {stopDate &&  <p>Treningi zostana zakonczone: {stopDate?.toDate()?.toString()}</p>} */}
  {finalDebt && <p>istniejące zadłużenie: {finalDebt} treningów</p>}
 {!stopReported  && <button onClick={sendStopToBase} className='btn'>Potwierdż</button>}
 {isSent &&<p>wyslano</p>}


</>)
}

export default StopMembershipAdmin2;