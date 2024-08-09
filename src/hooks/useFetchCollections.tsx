import { collection,  onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../App.js";

export interface IDocument {

  assignedUsers: IforSel[] | null;
  category: string ;
 comments: IComment[] | null;
  created_at: IDateObj;
  details: string | null;
  eventdate: IDateObj;
  name: string;
  photo: string;
  visibility: string;
  id: string;

}
export interface IAssignedUser{
  dob:IDateObj;
  name: string;
  surname: string;
  id: string;
  avatar:  string
  }
export interface IProject{
  project: IDocument | null;
}

export interface IDateObj{
seconds: number;
nanoseconds: number;
toMillis(): string | number | any;
}

export interface IComment{
  content: string;
  created_at: IDateObj;
  displayName: string;
  photoURL: string;
  id: string; 
  uid: string;
}

export interface IforSel{
  value: IAssignedUser;
  label: string
}


// export interface IFetchDates {

//     db: Firestore,  
//     colName: string,
//     userInfo: string | null,
//     setUserInfo: React.Dispatch<SetStateAction<string | null>>

// };

//const chosenCollection = "usersData"
const useFetchCollectionData = (chosenCollection: string) => {  


    const [dataFromCollection, setDataFromCollection ] =useState<IDocument[] | null>(null)
    const [loadingData, setLoadingData] =useState<boolean>(false)
    const [loadingDB, setLoadingDB] =useState<boolean>(false)
    const [error, setError] = useState<string | null | any>('')

    
useEffect(()=>{ 

  const getSomeData = ()=>{  
    
    try {
      if (!db) {
        console.error('Firebase Firestore is not ready yet');
        setLoadingDB(true)    
       
     } else { 
      setLoadingDB(false)
    } 
    loadingDB ? console.log("loading DB") : console.log("DB ready")          
    // const q =  query(collection(db, "usersData"), orderBy ("surname"));
    const q =  query(collection(db, chosenCollection))

  
    const unsubscribe =  onSnapshot(q, (querySnapshot) => { 
 
     const temp: IDocument[] = []; 
      setLoadingData(true) 
                 querySnapshot.forEach((doc) => {   
                                //console.log("doc.data()",doc.data().id)
                 temp.push({...doc.data()as IDocument , id: doc.id}); })
 //console.log("temp", temp)
                                   setDataFromCollection (temp); 
        setLoadingData(false)
        //setUsersFromBase((prev) => [...prev,doc.data()])
        loadingData ? console.log("loading data") : console.log("data ready")   
      })
      return unsubscribe;

    } catch (error) {
      setError(error)
    }
  
        
    
    
    };
    
    getSomeData()



},[chosenCollection])

      
return {dataFromCollection, error}
        

}

export default useFetchCollectionData

 