// import { collection, doc, onSnapshot, query } from "firebase/firestore";
// import { db } from "../App";
// import { SetStateAction, useEffect, useState } from "react";

// export interface Idoc {}

// const useFetchRealTimeCall = (chosenCollection: string) => { 
    
//     const [document, setDocument] = useState<Idoc | null>(null)
//     const [error, setError] = useState(null)

// useEffect(()=>{

//     const q = query(collection(db, chosenCollection));
// const unsubscribe = onSnapshot(q, (querySnapshot) => {
//   const yourData  = [];
//   querySnapshot.forEach((doc) => {
//    // yourData.push(doc.data().name);
//    console.log("tutaj mamy dane", doc.data())
//   });
//   setDocument(yourData)
//  // console.log("Current cities in CA: ", document.join(", "));
// });
// unsubscribe()
  
// },[db,chosenCollection])


//     return {chosenCollection}
// }

// export default useFetchRealTimeCall