import { useCallback, useContext, useEffect, useState } from "react"
import { UserContext } from "../../context/UserContext";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../App";
import notread from '../../assets/notread.png'
import read from '../../assets/read.png'
import './email.css'
import { format } from "date-fns";
export interface IMailToAdminReceive {}

export interface IMessage {
 
    created_at: ITimeObj;
    message: string;
    userid: string;
    fresh: boolean;
    name: string;
    surname: string;
   id: string;
  }

  export interface ITimeObj {
    toMillis(): string | number | Date;
    seconds: number,
    nanoseconds: number
  }


export const MailToAdminReceive: React.FunctionComponent<IMailToAdminReceive> = () => {
    
    const { currentUser } = useContext(UserContext);
    const [messages, setMessages] = useState<IMessage[] | null>(null);
    const [checkedMessages, setCheckedMessages] = useState<{ [id: string]: boolean }>({});
    const [readMessages, setReadMessages] = useState<{ [id: string]: boolean }>({});
    const [isReadMessages, setIsReadMessages] = useState<{ [id: string]: boolean }>({});

    const getUserData = useCallback(async () => { 
        if (currentUser) {
            const messageRef = collection(db, "usersmessages");
            const querySnapshot = await getDocs(messageRef );
            //console.log("messageRef", messageRef)

            const temp: IMessage[] = [];

            const unsub = querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
             // console.log("czytanie messages", doc.id, " => ", doc.data());
              temp.push({...doc.data(),id:doc.id} as IMessage );
             // console.log("...doc.data(),id:doc.id", doc.data(),doc.id)
              
            });

            setMessages(temp)
            return  unsub;
        }      
    },[db, currentUser])

    useEffect(() => {
        getUserData();
        //console.log('messages',messages)
    
      }, [db, currentUser, getUserData]);


      const handleCheckboxChange = (id: string) => {
        setCheckedMessages((prevCheckedMessages) => ({
            ...prevCheckedMessages,
            [id]: !prevCheckedMessages[id],
          }));
      }
    
      //console.log('checkedMessages',checkedMessages)
      //w przypadku jak jest true to pojdzie do usuniecia
    
    const handleReadChange =(id: string)=>{
        setReadMessages((prevReadMessages) => ({
            ...prevReadMessages,
            [id]: !prevReadMessages[id],
          }));
    
          setIsReadMessages((prevIsReadMessages) => ({
            ...prevIsReadMessages,
            [id]: !prevIsReadMessages[id],
          }))
    }

///
const readMessagesIds = Object.keys(readMessages).filter((id) => readMessages[id]);
  const filteredMessages = messages ? messages.filter((elem) => readMessagesIds.includes(elem.id)) : [];
  //console.log("messages do zmiany statutu", filteredMessages)

  const checkedMessagesIds = Object.keys(checkedMessages).filter((id) => checkedMessages[id]);
  const filteredCheckedMessages = messages ? messages.filter((elem) => checkedMessagesIds.includes(elem.id)) : [];
  //console.log("messages do usuniecia", filteredCheckedMessages)

   useEffect(()=>{
    if(filteredMessages){
      
      filteredMessages?.map((message)=>{
      console.log("message-id", message.id)
      const messageRef = doc(db, "usersmessages", message.id); 
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

    if (filteredCheckedMessages && messages) {
      const updatedMessages = messages.filter((message) => !filteredCheckedMessages.includes(message));
  
      try {
        await Promise.all(
          filteredCheckedMessages.map(async (message) => {
            console.log("message-id", message.id);
            await deleteDoc(doc(db, "usersmessages", message.id));
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
  ///


return(<div>
    <div>
      <div className="checkboxFlex">
       <p className="title">Skrzynka trenera </p> 
        {messages &&
          messages.map((elem) => {
           // const labelStyle = isReadMessages[elem.id] ? { color: 'gray' } : {};
           const labelStyle = {
            color: isReadMessages[elem.id] || !elem.fresh ? 'gray' : 'black'
          };

            return (
              <div key={elem.id} className="messageContainer">
                <label style={labelStyle}>
                <p className="maildate">{`${format(new Date(elem.created_at?.toMillis()), 'yyyy-MM-dd HH:mm')}`}</p>
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
                 
                  {/* {elem.created_at.toDate().toString()} */}
                  {/* <p className="comment-date">{`${elem.created_at?.toDate().toLocaleDateString('pl-PL',{
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
             })}`}</p> */}
                     <div className="comment-author mail">
                  <p className="od">wiadomośc od: {elem.name}{elem.surname}</p>
                  </div>
                  <br></br>
                </label>
                {elem.fresh === true ? (
                  <img src={isReadMessages[elem.id] ? read : notread} 
                  onClick={() => handleReadChange(elem.id)} 
    
                  className="readnotread"
                  />
                ) : (
                  <img src={read} 
                 
                  className="readnotread"
                  />
                )}
              </div>
            );
          })}
      </div>
      <button onClick={deletingMessage} className="btnsmall">usuń</button>
    </div>

    </div>)
}