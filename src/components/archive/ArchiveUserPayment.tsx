import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { db } from "../../App";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import DateFnsFormat from "../DateFnsFormat";

export interface IArchiveUserPayment{}
export interface ItimestampArr{
created_at: Date
kto: string
trenings: number
userUid: string
}
export interface IPaymentItem{
  id: string,
  time: Date,
  kto: string,
  trenings: number  
}


const ArchiveUserPayment : React.FunctionComponent<IArchiveUserPayment> =() => {
    const { currentUser} = useContext(UserContext); 
    const [paymentsArr, setPaymentsArr] = useState< IPaymentItem[]>([]);


    const getArchivePayfromBase = useCallback(async() => {

        const getfromBase =async()=>{  

            if(currentUser){
                  
 
            const q = query(collection(db, "paymentArchive"), where("userUid", "==", currentUser.uid));
            
            const unsubscribe = onSnapshot(q, (querySnapshot) => { 
                //console.log("querySnapshot",querySnapshot.docs)  
                const temp = querySnapshot.docs.map((doc) => {
                
              // console.log("payArch", doc.id, " => ", doc.data());
             
                if(doc.data()){
                  return {
                    id: doc.id,
                    time: doc.data().created_at,
                    kto: doc.data().kto,
                    trenings: doc.data().trenings   
                  } as IPaymentItem;
                } return null;            
                })
                .filter((item) => item !== null) as IPaymentItem[]; 
                setPaymentsArr([...temp])
               
             });
    
      
        return () => unsubscribe();
      }
    
    }
    getfromBase();
    },[db,currentUser])
    
    useEffect(()=>{
     
        getArchivePayfromBase();

      },[db,currentUser, getArchivePayfromBase])
      
      useEffect(()=>{

      //console.log("paymentsArr",paymentsArr )

            },[getArchivePayfromBase, paymentsArr])

    return(<div>

        <p className="title">Historia płatności</p>
   <ol>    
        {paymentsArr &&
     paymentsArr.map((elem)=>(
  
        <li key={elem.id} >
        {/* płatność dnia: {elem.time.toDate().toString()} */}
        <div className="archive">
        <p>płatność dnia: </p>
       <p><DateFnsFormat element={elem.time}/></p> 
        <p>za: {elem.trenings} treningów</p>
        </div>
         </li> 
          
     ))}
      </ol>   
   
        
        </div>)
}

export default ArchiveUserPayment
