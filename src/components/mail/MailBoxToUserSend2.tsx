// https://www.youtube.com/watch?v=FJDVKeh7RJI

export interface IMessage{
    created_at: DateObject,
    userUid: string,
    message: string,
    fresh: boolean
}

export interface DateObject {
    seconds: number,
    nanoseconds: number
}


  

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../App";
import { useModUsersForSelect } from "../../hooks/useModUsersForSelect ";
import Select from 'react-select'
import { useState } from "react";
import makeAnimated from 'react-select/animated'; 

export const MailboxToUserSend2 : React.FunctionComponent =() => {
    

    const usersModForSelect=  useModUsersForSelect(); 
    const usersModForSelectwithAll = [...usersModForSelect, { value: "all", label: "all" }];
    const animatedComponents = makeAnimated();
    const [messageSent, setMessageSent] = useState<boolean>(false)
    const[userChoice, setUserChoice] = useState<string[]>([])
    const [newmessage, setNewMessage] = useState('')
    const [isEditedmailToUsers, setIsEditedmailToUsers] = useState<boolean>(false)
    
    //const chosenUserById = "QQnLoM9alXNiJDcO5NYioj5YrE32";
   // const message = "cooo taam";

    const handleSubmitForm =(e: { preventDefault: () => void; })=>{
        e.preventDefault();

        userChoice.forEach((el)=>{
            if(el === "all"){
                addingToAll()
                console.log("czy all")
            } else {
                console.log("czy nie all")
                addingToBase()
               
            }
            
        })

    }
 

    const addingToAll =async()=>{ 

        usersModForSelect.map((el)=>{
            const messageToAll = {
                created_at: serverTimestamp(),
                userUid: el.value,
                message: newmessage,
                fresh: true
              } 
            //console.log("el",el.value)
            addDoc(collection(db, "usersmails"), messageToAll)
            .then(()=> console.log("message added"))    
            .then(()=> setMessageSent(true))    
        })
    }
   


    
    const addingToBase =async()=>{
        //zrob map userschoce
        userChoice.map((el: string)=>{
            const messageToAdd = {
                created_at: serverTimestamp(),
                userUid: el,
                message: newmessage,
                fresh: true
              } 
              addDoc(collection(db, "usersmails"), messageToAdd)
              .then(()=> console.log("message added"))  
              .then(()=> setMessageSent(true))    

        })
    }
  
    const handleEditMailToUsers =()=>{
        setIsEditedmailToUsers(!isEditedmailToUsers)
  }
 

   
    return (<div>

<button onClick={handleEditMailToUsers} className='btn'>
         {isEditedmailToUsers ? 'Zamknij' : 'Edytuj mailing do userów'}
          </button>
{isEditedmailToUsers &&   <div>       
{/* <button onClick={addingToBase}>send</button>
<button onClick={addingToAll}>all</button> */}


<form className="add-message" onSubmit={handleSubmitForm}>
  <label>
<span>Napisz Wiadomość</span>
<textarea
required
onChange={(e)=>setNewMessage(e.target.value)}
value={newmessage}
></textarea>
</label>

<label>

<Select
      /*closeMenuOnSelect={closeMenu}  */
      components={animatedComponents} 
      closeMenuOnSelect={false} 
      isMulti
      options={usersModForSelectwithAll}
      onChange={(newValue: any) => {
        const selectedValues = (newValue as any[]).map((option) => option.value);
        setUserChoice(selectedValues);
      }}
    //   onChange={(choice: any[]) => {     
    //  //const selectedValues = choice.map(option => option.value); 
    //  //console.log("selectedValues",selectedValues)
    //  const selectedValues = choice.map((option: { value: string }) => option.value)
    //  setUserChoice(selectedValues)   
    //   }}
    />


</label>


  <button className="btn">Send</button>

</form> 
</div>}



{messageSent && <p>wysłano</p>}

    </div>)
}

export default MailboxToUserSend2


