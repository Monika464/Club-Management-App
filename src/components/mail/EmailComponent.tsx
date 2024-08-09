import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../App";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/auth/UserContext";
import mail from '../../assets/mail.png'
import mailblurred from '../../assets/mailblurred.png'
//import { useNavigate } from "react-router-dom";
//import { isModuleNamespaceObject } from "util/types";

export interface IDateObj{
  seconds: number,
  nanoseconds: number
}
export interface IMessage {
    
  created_at: IDateObj;
  message: string;
  fresh: boolean;
  userUid: string;
  id: string;
}
export interface IId {
  id: string
  fresh: boolean  
}

export interface IEmailprops {
  
    collectionName: string;
    currentId: string | undefined;
    onClick: () => any;
    onmouseover: () => any;
    isMO: boolean;
}

export interface IFreshMessage {
   id: string;
   fresh: boolean  
}



export const EmailComponent: React.FunctionComponent<IEmailprops> = (props) => {
    const { currentUser} = useContext(UserContext); 
    const [freshMessagestoTrainer, setFreshMessagestoTrainer] = useState<IFreshMessage[] | null>(null);
    const [freshMessagestoUser, setFreshMessagestoUser] = useState<IFreshMessage[] | null>(null);
const [isShaking, setIsShaking] = useState<boolean>(false)
    //const navigate = useNavigate();
    
    // pierwszy czyli wiadomósci do trenera

   // console.log("jaki etu props", props)

    if(props.collectionName ===  "usersmessages"){
    

            const getDataToTrainer = useCallback(async () => {   
                const messageRef = collection(db, props.collectionName);    
                const querySnapshot = await getDocs(messageRef );
              //console.log("props.collectionName", props.collectionName)
  
                const temp: IFreshMessage[] = [];
                const unsub = querySnapshot.forEach((doc) => {    
                // console.log("obiekt", doc.data().fresh, doc.id,doc.data().userid)
         
                    if(doc.data()){

                  const obiekt = {
                     id: doc.id,
                     fresh: doc.data().fresh,
                     }
                 temp.push(obiekt)   
               };
               setFreshMessagestoTrainer(temp)   
              })  
            return  unsub; 
      
         },[db, props])  

        useEffect(() => {
            getDataToTrainer();
        }, [db, getDataToTrainer, props.currentId]);

       // console.log('messagetoTrain',freshMessagestoTrainer)

        const checkAndLogTrain = useCallback(() => {
            if (freshMessagestoTrainer) {
                 freshMessagestoTrainer.map((fressMes)=>{
                 if ( fressMes.fresh === true) {
                   // console.log("trzesiemy trenera");
                    setIsShaking(true)
                 return;
                } 
                }) 
         }
        }, [freshMessagestoTrainer, props.currentId]);

         useEffect(() => {
            checkAndLogTrain();
         }, [checkAndLogTrain,freshMessagestoTrainer]);

  }
//drugi czyli wiadomóści do userów

if(props.collectionName === "usersmails"){


 
  
  const readingFromFire = useCallback(async () => {   
        if(currentUser){
          const q = query(collection(db, "usersmails"), where("userUid", "==", currentUser.uid));
              const unsubscribe = onSnapshot(q, (querySnapshot) => { 
                   const temp: IId[] = querySnapshot.docs.map((doc) => {
                         // const data = {...doc.data(),id: doc.id,created_at: { seconds: 0, nanoseconds: 0 }, message: '', fresh: false, userUid: '' };
                         const data = {...doc.data(),id: doc.id,fresh: doc.data().fresh};
                         return data
                   })
               

                   //console.log("temp",temp)
               setFreshMessagestoUser(temp)        
                       })
    
     return () => unsubscribe();
      }

}, [db, currentUser, props]);

//  const getDataToUser = useCallback(async () => {   

//     if (currentUser) {
//         console.log("currentId",props.currentId ) 
//         const messageRef = collection(db, props.collectionName);    
//         const querySnapshot = await getDocs(messageRef);
//         console.log("querySnapshot", querySnapshot)
 
//             const temp = [];
//              const unsub = querySnapshot.forEach((doc) => {    
//                     if(doc.data()){
//                       console.log("tutaj",doc.data())
                      
//                     //     const obiekt = {
//                     //     id: doc.id,
//                     //     fresh: doc.data().fresh,
//                     //     }
//                     //  temp.push(obiekt)   
//                      };
//             setFreshMessagestoUser(temp)
//             })
    
//             return  unsub; 
//     }      
//  },[db, currentUser,props])  

 useEffect(() => {
  readingFromFire();
   //console.log('freshMessagestoUser',freshMessagestoUser)

 }, [db, currentUser, props]);
 // console.log('wiadUsera',freshMessagestoUser)

  const checkAndLogUser = useCallback(() => {
      if (freshMessagestoUser) {
          freshMessagestoUser.forEach((fressMes)=>{
            if ( fressMes.fresh === true) {
              // console.log("trzesiemy trenera");
               setIsShaking(true)
            return;
           } 
            //console.log("fressMes",fressMes)
          // if (fressMes.receivers.includes(props.currentId) || fressMes.receivers.includes("all")){
          //   if (fressMes.fresh) {
          //     setIsShaking(true)
          //      // console.log("trzesiemy usera");
          //       return;
          //   }        
          //  }
         }) 
    }
  }, [freshMessagestoUser, props.currentId]);

  useEffect(() => {
    checkAndLogUser();
  }, [checkAndLogUser,freshMessagestoUser]);

}


//console.log("z email komponentu isMO",props.isMO)



    return(<div>



          {/* <div className="mailIcon2"> */}
          {isShaking ? <img src={props.isMO ? mailblurred : mail} onClick={props.onClick} className="mailIcon2" onMouseOver={props.onmouseover} />
          : <img  src={props.isMO ? mailblurred : mail} onClick={props.onClick} className="mailIcon1" onMouseOver={props.onmouseover} 
          />}
          <div
 
/>
          {/* </div> */}
    </div>)
}

export default EmailComponent;