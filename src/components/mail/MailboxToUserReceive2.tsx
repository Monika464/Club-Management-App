
//to jest z idywidualnego konta wiec userid
//jsk w czytaniu z archiva

export interface IDateObj{
    toMillis(): string | number | Date;
    seconds: number,
    nanoseconds: number
  }
  export interface IMessage {
    
   created_at: IDateObj;
    message: string;
    fresh: boolean,
    userUid: string,
    id: string
  }

import { collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../App";
import { UserContext } from "../../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import notread from '../../assets/notread.png'
import read from '../../assets/read.png'
import { format } from "date-fns";

export const MailboxToUserReceive2: React.FunctionComponent = () => {

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [checkedMessages, setCheckedMessages] = useState<{ [id: string]: boolean }>({});
  const [readMessages, setReadMessages] = useState<{ [id: string]: boolean }>({});
  const [isReadMessages, setIsReadMessages] = useState<{ [id: string]: boolean }>({});

    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    
  const readingFromFire =async()=>{

    if(currentUser){
    
    const q = query(collection(db, "usersmails"), where("userUid", "==", currentUser.uid));
     const unsubscribe = onSnapshot(q, (querySnapshot) => { 
         const temp: IMessage[] = querySnapshot.docs.map((doc) => {
            const data = {...doc.data(),id: doc.id} as IMessage;;
           return data
          })
          setMessages(temp) 
         // console.log("temp",temp)
     })
     
     return () => unsubscribe();
    }
}
 
useEffect(()=>{

    if(currentUser){
    readingFromFire()
   // console.log('messages',messages)
    }
},[db,currentUser])

//read vs nort
const handleCheckboxChange = (id: string) => {
    setCheckedMessages((prevCheckedMessages) => ({
        ...prevCheckedMessages,
        [id]: !prevCheckedMessages[id],
      }));
  console.log("checked messages",checkedMessages)
    }


  const handleReadChange =(id: string)=>{
    setReadMessages((prevReadMessages) => ({
        ...prevReadMessages,
        [id]: !prevReadMessages[id],
      }));
      setIsReadMessages((prevIsReadMessages) => ({
        ...prevIsReadMessages,
        [id]: !prevIsReadMessages[id],
      }))
      navigate('/mailboxuser') 
}

const readMessagesIds = Object.keys(readMessages).filter((id) => readMessages[id]);
const filteredMessages = messages ? messages.filter((elem) => readMessagesIds.includes(elem.id)) : [];
//console.log("messages do zmiany statutu", filteredMessages)

const checkedMessagesIds = Object.keys(checkedMessages).filter((id) => checkedMessages[id]);
const filteredCheckedMessages = messages ? messages.filter((elem) => checkedMessagesIds.includes(elem.id)) : [];
//console.log("messages do usuniecia", filteredCheckedMessages)

 useEffect(()=>{
  if(filteredMessages){
    
    filteredMessages?.map((message)=>{
    //console.log("message-id", message.userUid)
    const messageRef = doc(db, "usersmails", message.id); 
    updateDoc(messageRef, {
              fresh: false
             })

            //  .then(() => {
            //   navigate('/userpanel', { replace: true });
            // }) 
      })
    }
 },[handleReadChange])

 const deletingMessage = async () => {
  if (filteredCheckedMessages) {
    const updatedMessages = messages.filter((message) => !filteredCheckedMessages.includes(message));

    try {
      await Promise.all(
        filteredCheckedMessages.map(async (message) => {
          //console.log("message-id", message.userUid);
          await deleteDoc(doc(db, "usersmails", message.id));
        })
      );

      setMessages(updatedMessages);

      // Optionally, you can navigate to another page after deletion
      // navigate('/userpanel', { replace: true });
    } catch (error) {
      console.error("Error deleting messages", error);
    }
  }
};

    return(<div>
         <p className="title">Wiadomości od trenera</p>
        <div className="checkboxFlex">
   
      {messages &&
        messages.map((elem) => {
          const labelStyle = {
            color: isReadMessages[elem.id] || !elem.fresh ? 'gray' : 'black',
          };

          return (

           
            <div key={elem.id} className="messageContainer">
             <label style={labelStyle}>
                <div className="checkbox">
                  <input
                    type="checkbox"
                    checked={checkedMessages[elem.id] || false}
                    onChange={() => {
                      handleCheckboxChange(elem.id);
                    }}
                  />
                </div>
                <p className="message">{elem.message}</p>
                <p className="maildate">{`${format(new Date(elem.created_at?.toMillis()), 'yyyy-MM-dd HH:mm')}`}</p>
                {/* <p className="comment-date">{`${elem.created_at?.toDate().toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}`}</p> */}
              </label>
              {elem.fresh === true ? (
                <>
                  {/* <div className="arrow-animation" onClick={() => handleReadChange(elem.id)}>
                    <div className="arrow"></div>
                  </div> */}
                  <img src={isReadMessages[elem.id] ? read : notread} 
                  onClick={() => handleReadChange(elem.id)} 
                  // style={{ width: '15px', height: '15px' }}         
                  className="readnotread"
                  />
                </>
              ) : (
                <img src={read} 
                // style={{ width: '15px', height: '15px' }}
                className="readnotread"
                />
              )}
            </div>
          );
        })}
    </div>
    <button onClick={deletingMessage} className="btnsmall">
      Usuń
    </button>
        
        
        
        
        
        
        
        
        
        
        
        
        
        </div>)
}

export default MailboxToUserReceive2
