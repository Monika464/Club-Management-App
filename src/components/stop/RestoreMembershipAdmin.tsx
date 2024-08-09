import Select from 'react-select'
import { useModUsersForSelect } from '../../hooks/useModUsersForSelect ';
import { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../App';
import { useSearchIndexCloseToday } from '../../hooks/useSearchIndexCloseToday';
import { useSearchDatesByIndex } from '../../hooks/useSearchDatesByIndex';
import DateFnsFormat from '../DateFnsFormat';

export interface US {
    value: string
    label: string
}

export const RestoreMembershipAdmin: React.FunctionComponent =() => {

    const [chosenUserId, setChosenUserId] = useState<string>('')
    const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(null)

    const userModForSelect  =  useModUsersForSelect(); 
    //zmodyfikuj zeby tylko zatrzymani
    const [newUsersList, setNewUsersList] = useState<US[]>([])
    const [name, setName] = useState<string | null>(null)
    const [surname, setSurname] = useState<string | null>(null)
    const [debt, setDebt] = useState<number | null>(null)
    const [isStop, setIsStop] = useState<boolean>(false)
    const [restartDateIndex, setRestartDateIndex] = useState<number | null>(null);
    const [stopDateFromBase, setStopDateFromBase] = useState<Date | null>()
    const dzisIndex = useSearchIndexCloseToday();
    const dzisData = useSearchDatesByIndex(dzisIndex);  


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

 // console.log("czy mamy restore",userModForSelect)   

    const fetchData = async () => {  
        const usersToAdd = [];

        //modyfikowanie listy 

        for (let i = 0; i < userModForSelect.length; i++) {
            const userRef = doc(db, "usersData", userModForSelect[i].value);
            const docSnap = await getDoc(userRef); 
             
            if (docSnap.exists()) {
               // console.log("say yes", )
                // Dodawanie użytkownika do listy w formie obiektu
                //usersToAdd.push({ value: userModForSelect[i].value, label: userModForSelect[i].label });
                    if((docSnap.data().stop) && (docSnap.data().id === userModForSelect[i].value)){
                        //console.log("say yes")
                    usersToAdd.push({ value: userModForSelect[i].value, label: userModForSelect[i].label });
                    } 
                  
           
            }

            setNewUsersList(usersToAdd); // Aktualizuj stan tablicy  
        }

        
    }; 

    fetchData();

   // console.log('newUsersListRestore',newUsersList)

}, [db,dzisData,dzisIndex,rendered]);

//lista userow zmodyfikowana tak zeby  mial stop


    // useEffect(() => { 
    //     const fetchData = async () => {
    //         const usersToAdd = [];

    //         for (let i = 0; i < userModForSelect.length; i++) {
    //             const userRef = doc(db, "usersData", userModForSelect[i].value);
    //             const docSnap = await getDoc(userRef);  
                
    //             if (docSnap.data().stop) {
    //                 // Dodawanie użytkownika do listy w formie obiektu
    //                 usersToAdd.push({ value: userModForSelect[i].value, label: userModForSelect[i].label });
    //             }

    //             setNewUsersList(usersToAdd); // Aktualizuj stan tablicy
    //         }

            
    //     };

    //     fetchData();

    //     //console.log('newUsersList',newUsersList)
    // }, [db,useModUsersForSelect,dzisData]);
    // ////



    //AKCJE PO WYBORZE USERA 
          const handleSetUserInfo = async ()=>{

            if(chosenUserId){ 
              const userRef = doc(db, "usersData",chosenUserId);
              const docSnap = await getDoc(userRef);

                  if (docSnap.exists()) {

                    setName(docSnap.data().name);
                    setSurname(docSnap.data().surname);
                      
                    if(docSnap.data().stop){
                        setIsStop(true);
                        setStopDateFromBase(docSnap.data().stop)
                       }

                      if(docSnap.data().debt){
                        setDebt(docSnap.data().debt)
                        }
                   } 
                   }
            }   
      

     
     // console.log('name',name,'dzisData',dzisData?.toDate(),'debt',debt) 





useEffect(()=>{
const calculateRestart =()=>{

  if(dzisIndex || debt){
    if(debt){
      setRestartDateIndex(dzisIndex - debt);
    } else {
      setRestartDateIndex(dzisIndex);
    }
    
   }
}
calculateRestart();

},[handleSetUserInfo])

const restartNewData = useSearchDatesByIndex(restartDateIndex);

//console.log('restartNewData',restartNewData?.toDate())


const dataToActivityArchive = {
created_at: serverTimestamp(),
restartData: dzisData,
userUid: chosenUserId,
kto: `${name} ${surname}`,          
} 

const sendToBase =async()=>{

const paymentDataRef = doc(db, "usersData", chosenUserId);

if(restartNewData){    
await updateDoc(paymentDataRef, {  
stop: null, 
due: restartNewData,    
restart:  dzisData,
debt: null
})
.then(()=>console.log("restart succesful"))

     
await addDoc(collection(db, "activitiArchive"), dataToActivityArchive)
.then(()=> console.log("archive"))

} 
}


    ////

 


 


return(<>


<Select
      closeMenuOnSelect={true}  
      options={newUsersList}
      onChange={(choice) => {
        if(choice){
          setChosenUserId(choice.value);   
          setChosenUserByIdLabel(choice.label); 
        }
        setIsStop(false);
        setDebt(null);
     
        }}   
    />
    <p>{chosenUserByIdLabel}</p>

    <button onClick={handleSetUserInfo} className='btn'>wylicz date powrotu</button>  
    {/* {stopDateFromBase} */}
 
    {stopDateFromBase && <div className="archive">    
         <p>Treningi zatrzymane od:  </p>
        <p><DateFnsFormat element={stopDateFromBase}/></p>
        </div>
     }
 {/* {isStop && <p>Planowany powrót {dzisData?.toDate()?.toString()}</p>} */}
 {isStop && 
   <div className="archive">
      <p>Czy planuje powrót w najbliższym terminie </p>
     <p><DateFnsFormat element={dzisData}/> ?</p>
     </div>}
{debt && <p>Masz do spłaty zadłużenie wysokosci: {debt} treningów</p>}
    <button onClick={sendToBase} className='btn'>Potwierdzasz powrót</button>   
</>)
}