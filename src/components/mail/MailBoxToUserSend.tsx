
// export interface IMailboxUser{}

// export interface IobjectUser{
//     id: string 
// }

// import Select from 'react-select'
// import { useModUsersForSelect } from '../../hooks/useModUsersForSelect ';
// import makeAnimated from 'react-select/animated'; 
// import { useState } from 'react';
// import { db } from '../../App';
// import { WriteBatch, arrayUnion, doc, getDoc, onSnapshot, serverTimestamp, updateDoc, writeBatch} from 'firebase/firestore';

// export interface IModForSelectwithAll{
//   value: string;
//   label: string;
// }

// export interface ITimeObj {
//   seconds: number,
//   nanoseconds: number
// }

// export interface IMessages{
//   message: string,
//   created_at: ITimeObj,
//   fresh: boolean,
//   id: string
// }

// export interface Wiadomosc{
//     tresc: string,
//     data: Date,
//     nieczytane: boolean,
//     id: string
// }

// export const MailboxToUserSend : React.FunctionComponent<IMailboxUser> =() => {
//   const animatedComponents = makeAnimated();
//   const[userChoice, setUserChoice] = useState<string[]>([])
//   const [newmessage, setNewMessage] = useState('')
//   const [isEditedmailToUsers, setIsEditedmailToUsers] = useState<boolean>(false)

//  const usersModForSelect=  useModUsersForSelect(); 
// const [messageSent, setMessageSent] = useState<boolean>(false)
//   const [messagesArr, setMessagesArr] = useState<IMessages[]>([])
//     // const samevalue = usersModForSelect.map(
//     //   option => option.value
//     // )
   

//     //const usersModForSelectwithAll = [...usersModForSelect, { value: samevalue.toString(), label: "all" }];
//     const usersModForSelectwithAll = [...usersModForSelect, { value: "all", label: "all" }];

//      //userChoice.forEach((el)=>{
//       // console.log("el",el)
//      // })
//     //console.log("newmessage i user",newmessage,userChoice)

//     const messageDataToAdd = {
//       message: newmessage,
//       created_at: new Date(),
//       fresh: true,
      
//     };

//     const [wiadomosciTabela, setWiadomosciTabela] = useState<Wiadomosc[]>([]);

//     const utworzWiadomosc = (tresc: string, nieczytane: boolean, id: string): Wiadomosc => {
  
//       return { tresc: tresc, data: new Date(), nieczytane: true,id: id};
//     };



 
//  const updateMessageBox = async(id: string)=>{



//   const userRef = doc(db, "usersMailbox",id);
  
//     const unsub = onSnapshot(userRef, (doc) => {
//                 const temp =[]
//                       if(doc.data()){
//                       //console.log("Current data: ", doc.data());

//                       temp.push({...doc.data(),id: doc.id})
//                       setMessagesArr(temp)
//                      // console.log("co to messages arr",messagesArr)
//                       // setDocument({...doc.data(),id: doc.id});
//                       updateDoc(userRef, {
//                         messagesArr: [...messagesArr, messageDataToAdd]
//                        })
//                     } else {
//                         //setError("no such document exists")
//                     }
//                 });
               
//                 return () => unsub();
                
//                 //nastepnie
                
            
//  }
 
//  const sendingToAll =()=>{
//   usersModForSelect.forEach((useId) => {
//     updateMessageBox(useId.value)
//     })
//  }
 
 

  
//     // const sendingToAll = async () => {
         
//     //   usersModForSelect.forEach((el) => {

//     //     const userMailRef = doc(db, "usersMailbox", el.value);
    
//     //     updateDoc(userMailRef, {
//     //       //       message: newmessage,
//     //       //        created_at: serverTimestamp(),
//     //       //        fresh: true
//     //              })
    
      
    
//     //     .then(() => console.log("Admin messages added"))
//     //     .then(() => setMessageSent(true))
//     //     .catch((error) => console.error("Error adding admin messages", error));
//     // })

  
  
  
  
//     const handleSubmitForm =async (e: { preventDefault: () => void; })=>{
//             e.preventDefault();
            

//            //funkcja przega;adajaca userchoice
//            //i wysylajaca  do kazdego
//            //jak w 

//            try {
//             userChoice.forEach((el)=>{

//               if(el === "all"){
//                 sendingToAll();
           

//                  } else {
//                   //console.log("hello") 
//                   const userMailRef = doc(db,"usersMailbox",el);
//                // Dodaj sprawdzenie istnienia dokumentu przed próbą aktualizacji
//                    getDoc(userMailRef)
//                   .then((docSnapshot: { exists: () => any; }) => {
//                   if (docSnapshot.exists()) {
//                    return updateDoc(userMailRef, {
//                    message: newmessage,
//                    created_at: serverTimestamp(),
//                    fresh: true
//                   });
//             } else {
//               console.error("Dokument nie istnieje.");
//              }
//         })
//         .then(() => console.log("admin message added"))
//         .then(() => setMessageSent(true))
//         .catch((error) => console.error("Błąd: ", error));

//                 // const userMailRef = doc(db, "usersMailbox", el);
//                 //  updateDoc(userMailRef, {
//                 //  message: newmessage,
//                 //   receivers: userChoice,
//                 //   created_at: serverTimestamp(),
//                 //   fresh: true
//                 //  })
//                 // .then(()=> console.log("admin message added"))
//                 // .then(()=> setMessageSent(true))          
//                 }
//               })
            
//            } catch (error) {
//             console.log(error)
//            }

                      
               
//             //console.log("el",el)
           

//       //   const messageToAdd ={
//       //          message: newmessage,
//       //         receivers: userChoice,
//       //         created_at: serverTimestamp(),
//       //         fresh: true
//       //       } 

  
//       // const docRef = await addDoc(collection(db, "adminmessages"), messageToAdd)
//       // .then(()=> console.log("admin message added"))
//       //.then(()=> setMessageSent(true))
//         //.then(()=> navigate('/userpanel'))
       
// }
//  //if(messageToAdd){
//   //console.log("userChoice",userChoice)
//   //}
// //console.log("UserChoice",userChoice)
//         const handleEditMailToUsers =()=>{
//            setIsEditedmailToUsers(!isEditedmailToUsers)
//           //navigate('/userpanel')
//           }

// //funkcja ktora bedzie 

// return (<div>

// <button onClick={handleEditMailToUsers} className='btn'>
//          {isEditedmailToUsers ? 'Zamknij' : 'Edytuj mailing do userów'}
//           </button>

// {isEditedmailToUsers && 
// <form className="add-message" onSubmit={handleSubmitForm}>
//   <label>
// <span>Napisz Wiadomość</span>
// <textarea
// required
// onChange={(e)=>setNewMessage(e.target.value)}
// value={newmessage}
// ></textarea>
// </label>

// <label>

// <Select
//       /*closeMenuOnSelect={closeMenu}  */
//       components={animatedComponents} 
//       closeMenuOnSelect={false} 
//       isMulti
//       options={usersModForSelectwithAll}
//       onChange={(choice) => {     
//      const selectedValues = choice.map(option => option.value); 
//      //console.log("selectedValues",selectedValues)
//       setUserChoice(selectedValues)
      
//       }}
//     />


// </label>


//   <button className="btn">Send</button>

// </form> 

// }

// {messageSent && <p>wysłano</p>}





// </div>)

// }

// export default MailboxToUserSend;

// // function commitBatch(batch: WriteBatch) {
// //   throw new Error('Function not implemented.');
// // }
