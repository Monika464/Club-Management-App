// import { useCallback, useContext, useEffect, useState } from "react";
// import { UserContext } from "../../context/UserContext";
// import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
// import { db } from "../../App";
// import notread from '../../assets/notread.png'
// import read from '../../assets/read.png'
// import { useNavigate } from "react-router-dom";
// import { useModUsersForSelect } from "../../hooks/useModUsersForSelect ";


// export interface IMailboxUser {}
// export interface IDateObj{
//   seconds: number,
//   nanoseconds: number
// }
// export interface IMessage {
  
//   created_at: Date;
//   message: string;
//   receivers: string[];
//   id: string;
//   fresh: boolean
// }

// export interface IPack {


// }
// //zmienie t tak zeby zapisywał jako przypadkowe id a w kązdej wiadomosci 
// //bedzie uiduzytkownika
// //przy zapisywaniu tworzy 

// export const MailboxToUserReceive: React.FunctionComponent<IMailboxUser> = (props) => {
//   const [messages, setMessages] = useState<IMessage[] | null>(null);
//   const [messagesN, setMessagesN] = useState<IMessage[] | null>(null);

//   const [checkedMessages, setCheckedMessages] = useState<{ [id: string]: boolean }>({});
//   const [readMessages, setReadMessages] = useState<{ [id: string]: boolean }>({});
//   const [isRead, setIsRead] = useState<boolean>(false)
//   const [isReadMessages, setIsReadMessages] = useState<{ [id: string]: boolean }>({});
//   const { currentUser } = useContext(UserContext);
//   const navigate = useNavigate();
//   const usersModForSelect=  useModUsersForSelect(); 
    
//   const gettingData =async ()=>{

//     const temp  = []


//     const usersMailboxCollection = collection(db, 'usersMailbox');
        

//       //  const q = query(usersMailboxCollection, where('uid', '==', id));
//       const q = query(usersMailboxCollection);
//        // Pobieranie danych z zapytania
//         const querySnapshot = await getDocs(q);
// console.log("co w querysnap",querySnapshot.docs)
//         querySnapshot.forEach((doc) => {
//           if (doc.exists()) {
//             const isIdEqual = doc.id === currentUser?.uid;
//             if(isIdEqual){
// //console.log("ten dokument taki sam, do",doc.data())
//   setMessagesN(doc.data())
//             }

            
          
//          }
//         })

//        // console.log('jest takie same:',"QQnLoM9alXNiJDcO5NYioj5YrE32"=== "QQnLoM9alXNiJDcO5NYioj5YrE32");         
//   }
//     // const unsub = onSnapshot(doc(db, "usersMailbox", id), (doc) => {
//     //     console.log("Current data: ", doc.data());
//     //     temp.push({...doc.data(),id: doc.id});
//     //     console.log("temp",temp)
//     // });
//     // return () => unsub();
    

// //const checkingMailbox =()=>{
//      // gettingData(currentUser?.uid ?? "")
// //}

// useEffect(()=>{
//   gettingData()
// },[db,currentUser])


//   // const getUserData = useCallback(async () => {
//   //   if (currentUser) {
//   //     const messageRef = collection(db, "adminmessages");
//   //     const messageQuery = query(messageRef, where("receivers", "array-contains", currentUser.uid));
//   //     const messageQuery2 = query(messageRef, where("receivers", "array-contains", "all"));

//   //     const querySnapshot = await getDocs(messageQuery);
//   //     const querySnapshot2 = await getDocs(messageQuery2);

//   //     const temp = [];

//   //     const unsub = querySnapshot.forEach((doc) => {
//   //       // doc.data() is never undefined for query doc snapshots
//   //      // console.log("czytanie messages", doc.id, " => ", doc.data());
//   //       temp.push({...doc.data(),id:doc.id} );
       
//   //     });

//   //     const unsub2 = querySnapshot2.forEach((doc) => {
//   //       // doc.data() is never undefined for query doc snapshots
//   //      // console.log("czytanie messages2", doc.id, " => ", doc.data());
//   //       temp.push({...doc.data(),id: doc.id});
       
//   //     });

//   //     setMessages(temp);

//   //     return { unsub, unsub2 };
//   //   }
//   // }, [db, currentUser]);

//   // useEffect(() => {
//   //   getUserData();

//   // }, [db, currentUser, getUserData]);
//   //console.log("messages2", messages);


//   const handleCheckboxChange = (id: string) => {
//     setCheckedMessages((prevCheckedMessages) => ({
//         ...prevCheckedMessages,
//         [id]: !prevCheckedMessages[id],
//       }));
//   }

//   //console.log('checkedMessages',checkedMessages)
//   //w przypadku jak jest true to pojdzie do usuniecia

// const handleReadChange =(id: string)=>{

//     setReadMessages((prevReadMessages) => ({
//         ...prevReadMessages,
//         [id]: !prevReadMessages[id],
//       }));

//       setIsReadMessages((prevIsReadMessages) => ({
//         ...prevIsReadMessages,
//         [id]: !prevIsReadMessages[id],
//       }))
//       navigate('/mailboxuser')

 
// }


//   const handleMarkAsRead = () => {
//     // Implement the logic to mark selected messages as read
//     // You can use checkedMessages state to determine which messages are selected
//     // Update your Firebase database or perform any other actions here
//   };

//   //console.log('checkedMessages',checkedMessages)
//   //console.log('readMessages',readMessages)
//   const readMessagesIds = Object.keys(readMessages).filter((id) => readMessages[id]);
//   const filteredMessages = messages ? messages.filter((elem) => readMessagesIds.includes(elem.id)) : [];
//   //console.log("messages do zmiany statutu", filteredMessages)

//   const checkedMessagesIds = Object.keys(checkedMessages).filter((id) => checkedMessages[id]);
//   const filteredCheckedMessages = messages ? messages.filter((elem) => checkedMessagesIds.includes(elem.id)) : [];
//   //console.log("messages do usuniecia", filteredCheckedMessages)

//    useEffect(()=>{
//     if(filteredMessages){
      
//       filteredMessages?.map((message)=>{
//       console.log("message-id", message.id)
//       const messageRef = doc(db, "adminmessages", message.id); 
//       updateDoc(messageRef, {
//                 fresh: false
//                })

//               //  .then(() => {
//               //   navigate('/userpanel', { replace: true });
//               // }) 
//         })
//       }
//    },[handleReadChange])

//    const deletingMessage = async () => {
//     if (filteredCheckedMessages) {
//       const updatedMessages = messages.filter((message) => !filteredCheckedMessages.includes(message));
  
//       try {
//         await Promise.all(
//           filteredCheckedMessages.map(async (message) => {
//             console.log("message-id", message.id);
//             await deleteDoc(doc(db, "adminmessages", message.id));
//           })
//         );
  
//         setMessages(updatedMessages);
  
//         // Optionally, you can navigate to another page after deletion
//         // navigate('/userpanel', { replace: true });
//       } catch (error) {
//         console.error("Error deleting messages", error);
//       }
//     }
//   };
  
//   ///

//   return(<div>
//     <div className="checkboxFlex">
//       {/* ... Pozostała część kodu ... */}
//       {messages &&
//         messages.map((elem) => {
//           const labelStyle = {
//             color: isReadMessages[elem.id] || !elem.fresh ? 'gray' : 'black',
//           };

//           return (
//             <div key={elem.id} className="messageContainer">
//               <label style={labelStyle}>
//                 <div className="checkbox">
//                   <input
//                     type="checkbox"
//                     checked={checkedMessages[elem.id] || false}
//                     onChange={() => {
//                       handleCheckboxChange(elem.id);
//                     }}
//                   />
//                 </div>
//                 {elem.message}
//                 <p className="comment-date">{`${elem.created_at?.toDate().toLocaleDateString('pl-PL', {
//                   year: 'numeric',
//                   month: 'numeric',
//                   day: 'numeric',
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 })}`}</p>
//               </label>
//               {elem.fresh === true ? (
//                 <>
//                   {/* <div className="arrow-animation" onClick={() => handleReadChange(elem.id)}>
//                     <div className="arrow"></div>
//                   </div> */}
//                   <img src={isReadMessages[elem.id] ? read : notread} 
//                   onClick={() => handleReadChange(elem.id)} 
//                   style={{ width: '17px', height: '17px' }}         
//                   />
//                 </>
//               ) : (
//                 <img src={read} style={{ width: '17px', height: '17px' }}/>
//               )}
//             </div>
//           );
//         })}
//     </div>
//     <button onClick={deletingMessage} className="btnsmall">
//       Usuń
//     </button>
//   </div>)
//   // return (
//   //   <div>
//   //     <div className="checkboxFlex">
//   //       User mailbox 
//   //       {messages &&
//   //         messages.map((elem) => {
//   //          // const labelStyle = isReadMessages[elem.id] ? { color: 'gray' } : {};
//   //          const labelStyle = {
//   //           color: isReadMessages[elem.id] || !elem.fresh ? 'gray' : 'black'
//   //         };

//   //           return (
//   //             <div key={elem.id} className="messageContainer">
//   //               <label style={labelStyle}>
//   //                 <div className="checkbox">
//   //                   <input
//   //                     type="checkbox"
//   //                     checked={checkedMessages[elem.id] || false}
//   //                     onChange={() => {
//   //                       handleCheckboxChange(elem.id);
//   //                     }}
//   //                   />
//   //                 </div>
//   //                 {elem.message}
//   //                 {/* {elem.created_at.toDate().toString()} */}
//   //                 <p className="comment-date">{`${elem.created_at?.toDate().toLocaleDateString('pl-PL',{
//   //                 year: 'numeric',
//   //                 month: 'numeric',
//   //                 day: 'numeric',
//   //                  hour: '2-digit',
//   //                  minute: '2-digit',
//   //                 })}`}</p>
//   //               </label>
//   //               {elem.fresh === true ? (
                  
//   //                 <img src={isReadMessages[elem.id] ? read : notread} onClick={() => handleReadChange(elem.id)} />
//   //               ) : (
//   //                 <img src={read} />
                 
//   //               )}
//   //             </div>
//   //           );
//   //         })}
//   //     </div>
//   //     <button onClick={deletingMessage} className="btn">usunac</button>
//   //   </div>
//   // );

// };

// export default MailboxToUserReceive;


