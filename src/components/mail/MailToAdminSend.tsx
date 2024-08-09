import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { db } from "../../App";

export interface IMailToAdminSend{}

export const MailToAdminSend : React.FunctionComponent<IMailToAdminSend> =() => {
    const [newmessage, setNewMessage] = useState('')
    const [name, setName] = useState<string | null>(null);
    const [surname, setSurname] = useState<string | null>(null);
    const { currentUser} = useContext(UserContext);
    const [messageSent, setMessageSent] = useState<boolean>(false)

    useEffect(()=>{
        const settingName = async ()=>{

            if(currentUser){ 
              const userRef = doc(db, "usersData",currentUser?.uid);
              const docSnap = await getDoc(userRef);
      
                  if (docSnap.exists()) {
                    setName(docSnap.data().name);
                    setSurname(docSnap.data().surname);
                  }
             }
      
          }
          settingName()  
       
    },[currentUser,db])

    const handleSubmitForm =async (e: { preventDefault: () => void; })=>{
        
      e.preventDefault();
       // console.log("tu tu tu",newmessage,userChoice)

       if(currentUser){
              const messageToAdd ={
                             message: newmessage,
                             created_at: serverTimestamp(),
                             fresh: true,
                            name: name,
                           surname: surname,
                          userid: currentUser.uid
                         }

               if(messageToAdd){

                 await addDoc(collection(db, "usersmessages"), messageToAdd)
                  .then(()=> console.log("user message added"))
                   .then(()=> setMessageSent(true))
                  //.then(()=> navigate('/userpanel'))
                 } 

      }
 
}








return(<div>
    <form className="add-message" onSubmit={handleSubmitForm}>
  <label>
<span>Napisz Wiadomość</span>
<textarea
required
onChange={(e)=>setNewMessage(e.target.value)}
value={newmessage}
></textarea>
</label>

<button className="btn">Send</button>
</form>
{messageSent && <p>wysłano</p>}
    </div>)
}

export default MailToAdminSend;