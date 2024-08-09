import Select from 'react-select'
import { useModUsersForSelect } from "../../hooks/useModUsersForSelect ";
import { useEffect, useState } from 'react';
import { useSearchIndexCloseToday } from '../../hooks/useSearchIndexCloseToday';
import { useSearchDatesByIndex } from '../../hooks/useSearchDatesByIndex';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../App';
//import { format } from 'date-fns';
// import { pl } from 'date-fns/locale';
import DateFnsFormat from '../DateFnsFormat';

export interface Itest{}

export interface IusersForSelect {
    value: string; 
    label: string; 
}
export interface IdateObj{
  seconds: number;
  nanoseconds: number;
}

export const BackAfterInjuryAdmin2 : React.FunctionComponent<Itest> =() => { 


  const [chosenUserId, setChosenUserId] = useState<string>('');
  const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(null);
  const [newUsersList, setNewUsersList] = useState<IusersForSelect[]>([]);
  const [treningsToAdd, setTreningsToAdd] = useState<number | null>(null) ;
  const [debtsToSubstract, setDebtsToSubstract] = useState<number | null>(null) ;
const [currentUserPausaDate, setCurrentUserPausaDate] = useState<IdateObj | null>()
//const [name, setName] = useState<string | null>(null)
//const [surname, setSurname] = useState<string | null>(null)
//const [debt, setDebt] = useState<number | null>(null)
//const [add, setAdd] = useState<number | null>(null)
//const [isPausa, setIsPausa] = useState<boolean>(false)
//const [backDateIndex, setBackDateIndex] = useState<number | null>(null);
const [newPaymentDateIndex, setNewPaymentDateIndex] = useState<number | null>(null);
const [newPaymentDate, setNewPaymentDate] = useState<IdateObj| null>();
const [isMulti, setIsMulti] = useState<boolean>(false);
const [isPass, setIsPass] = useState<boolean>(false);
const [isSent, setisSent] = useState<boolean>(false) ;
//const [todayDisplay, setTodayDisplay] = useState<Date | null>();
const [archiveName, setArchiveName] = useState<string | null>("")
//const [rendered, setRendered] = useState(false);
//const [chosen, setChosen] = useState(false);
   

const userModForSelect  =  useModUsersForSelect(); 
    const dzisIndex = useSearchIndexCloseToday();
    const dzisData = useSearchDatesByIndex(dzisIndex);
    
 //console.log('dzisData',dzisData?.toDate().toLocaleDateString())

    //modyfikowanie listy userów

    useEffect(() => { 
        const fetchData = async () => {
            const usersToAdd = [];

            for (let i = 0; i < userModForSelect.length; i++) {
                const userRef = doc(db, "usersData", userModForSelect[i].value);
                const docSnap = await getDoc(userRef);  
                
                if(docSnap.exists()){
                if (docSnap.data().pause) {
                    // Dodawanie użytkownika do listy w formie obiektu
                    usersToAdd.push({ value: userModForSelect[i].value, label: userModForSelect[i].label });
                }
                       
                setNewUsersList(usersToAdd); // Aktualizuj stan tablicy
              }
            }

            
        };

        fetchData();

        //console.log('newUsersList',newUsersList)
    }, [db,useModUsersForSelect,dzisData]);

    //kalkulowanie daty powrotu

  
    //const now = new Date()

    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //     setRendered(true);
    //   }, 1000); // 1000 milisekund = 1 sekunda
    
    //   return () => {
    //     clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
    //   };
    // }, []);




 

//useEffect(()=>{

  //setTodayDisplay(now)

  const getBasicInfo =async(chosenUserId: string)=>{
  

    if(chosenUserId){ 
      const userRef = doc(db, "usersData",chosenUserId);
      const docSnap = await getDoc(userRef);
  
          if (docSnap.exists()) {  
        
               if(docSnap.data().pause){
                //setIsPausa(true);
             
                 //setName(docSnap.data().name);
                 //setSurname(docSnap.data().surname);
                          
                 if(docSnap.data().optionMulti=== true){
                  setIsMulti(true)   
                 // console.log("czy tu cos jest", isMulti)  
                 }
                 if(docSnap.data().optionPass === true){
                  setIsPass(true)     
                 }

                 if(docSnap.data().add ){                 
                  setTreningsToAdd(docSnap.data().add) 
                  setCurrentUserPausaDate(docSnap.data().pause)  
                             } 
                         
                  if(docSnap.data().debt ){
                            //console.log("Document data:", docSnap.data().add);
                        setDebtsToSubstract(docSnap.data().debt) 
                         setCurrentUserPausaDate(docSnap.data().pause)         
                          } 
                }
  
              }
  
            }

  }
  //gentbasicInfo()
  
//},[chosen,chosenUserId])

const calcDatOfNewPay =  useSearchDatesByIndex(newPaymentDateIndex);


    useEffect(() => { 

    if( chosenUserId){
     // console.log("uruchomiony useeffect2")

      if(isMulti){
        setNewPaymentDate(null)
        //console.log("czy tu jest multi",isMulti)
      } 

      if(isPass){
       // console.log("czy uruchomiona pass")

        if(debtsToSubstract && dzisIndex){
          setNewPaymentDateIndex(dzisIndex - debtsToSubstract)
         // console.log("czy mamay substract")
        }
       // console.log("czy tu mamy trening to add",treningsToAdd)
        if(treningsToAdd && dzisIndex){
          setNewPaymentDateIndex(dzisIndex + treningsToAdd)
         }  
         //console.log("dzisIndex","treningsToAdd",dzisIndex,treningsToAdd)
        // console.log("newPaymentDateIndex",newPaymentDateIndex)
        setNewPaymentDate(calcDatOfNewPay )
       // console.log("calcDatOfNewPay",calcDatOfNewPay)
        }
        //console.log('newPaymentDate', newPaymentDate?.toDate() )

      }
      
  
  
  },[chosenUserId, currentUserPausaDate,getBasicInfo ])

 
  
 //console.log("czy jest multi czy pas?", isMulti,isPass)

  const pushToBaseNewDueDay =async ()=>{

    const dataToActivityArchive = {
      created_at: serverTimestamp(),
      returnData: dzisData,
      userUid: chosenUserId,
      kto: `${archiveName}`,          
      } 
 
    const userRef = doc(db, "usersData",chosenUserId);

    if(isMulti){
      await updateDoc(userRef, {
        due: null,
        pause: null
      })
      .then(()=>{console.log("powrot do treningów użytkownika multisport")})
      .then(()=>   setisSent(true))
     
      await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
     .then(()=> console.log("sent to archive"))

    } 


    if(isPass){
   
    await updateDoc(userRef, {
      due: newPaymentDate,
      add: null,
      debt: null,
      pause: null
    })  
    .then(()=>{console.log("powrot do treningów nowa płatnosc zapisana")})
    .then(()=>   setisSent(true))
  }

    await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
.then(()=> console.log("sent to archive"))


}
    //kopia do archive dorobic 
const  resetChoice =() =>{
  setisSent(false);
  setNewPaymentDate(null);
  setNewPaymentDateIndex(null)
  setIsMulti(false)
  setIsPass(false)
}

   return (<>

  
   <Select
      closeMenuOnSelect={true}  
      options={newUsersList}
      onChange={(choice) => {
        if(choice){
          getBasicInfo(choice.value);
          setChosenUserId(choice.value);   
          setChosenUserByIdLabel(choice.label); 
          setArchiveName(choice.label);
        }
          resetChoice();
        //setChosen(true) 
        //setIsPausa(false);   
        //setisSent(false);
        //setNewPaymentDate(null);
        //setNewPaymentDateIndex(null)
      
        }}   
    />
    <p>{chosenUserByIdLabel}</p>

    {/* {isPausa && <p>{newPaymentDate?.toDate()?.toString()}</p>} */}
    {/* {todayDisplay && <p>{todayDisplay?.getMonth()+1}-{todayDisplay?.getDate()}</p>} */}
    {/* { isMulti ? <p>{dzisData?.toDate().toLocaleDateString()}</p> : <p></p>}
    { isPass ? <p>{newPaymentDate?.toDate().toString()}</p> : <p></p>}   */}

{ isMulti && 
   <div className="archive">
     <p>Powrót</p>
   <p><DateFnsFormat element={dzisData}/></p>
   </div>}
   
   { isPass && 
   <div className="archive">
    <p>Powrót</p>
   <p><DateFnsFormat element={dzisData}/></p>
   </div>}

 <button onClick={pushToBaseNewDueDay} className='btn'>Zatwierdz powrot</button>
 {isSent &&<p>wyslano</p>}
    
   </>)


}