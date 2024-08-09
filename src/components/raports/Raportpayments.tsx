// import { collection, onSnapshot, query} from "firebase/firestore";
// import { useCallback, useEffect, useState } from "react";
// import { db } from "../../App";


// export interface IRaportpayments {}
// export interface paymentArr {
//     id: string,
//     time: Date,
//     kto: string,
//     trenings: number,
//     amount: number   
// }

// const Raportpayments: React.FunctionComponent<IRaportpayments> =(props) => {


// const [paymentsArr, setPaymentArr] = useState<paymentArr | null>(null)


//     const getArchiveDatafromBase = useCallback(async() => {

//         const getfromBase =async()=>{        
          
//             //wczesniej trzeba by pobrac wszystkie
            
     
      
//           const q = query(collection(db, "paymentArchive"));
          
//           const unsubscribe = onSnapshot(q, (querySnapshot) => { 
//             const temp = querySnapshot.docs.map((doc) => {
              
//               console.log("tuuu", doc.id, " => ", doc.data());
           
//               if(doc.data().userUid){
//                 return {
//                     id:doc.id,
//                   uid: doc.data().userUid,
//                   time: doc.data().created_at,
//                   kto: doc.data().kto,
//                   trenings: doc.data().trenings,
//                   amount: doc.data().amount
//                 };
//               }            
//               });
//              // console.log("temp1",temp1)
//               setPaymentArr([...temp])
             
//            });
  
    
//       return () => unsubscribe();
//     }
  
  

//   getfromBase();


// }, [db]); 


// useEffect(()=>{

//     getArchiveDatafromBase()
    
// },[getArchiveDatafromBase])


// useEffect(()=>{
// console.log("paymentsArr",paymentsArr)

// },[paymentsArr])






//     return(<div>Raportpayments</div>)

// }

// export default Raportpayments