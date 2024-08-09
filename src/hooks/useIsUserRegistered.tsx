import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../App";

export interface IsUserRegistered {}

export const useRegisteringUsers  = ():boolean => { 

    const [isUserRegistered, setIsUserRegistered] = useState<boolean>(false);
    
    const { currentUser} = useContext(UserContext); 
    if(currentUser){
    const checkingRegister =async() =>{      
        
                    const userRef = doc(db, "usersData",currentUser.uid);
                    const docSnap = await getDoc(userRef);
                       if (docSnap.exists()) {
                        if(docSnap.data()?.name){
                           return  setIsUserRegistered(true)
                        }
                      
                       }

                    }
        checkingRegister()
       }



    

    
    
return isUserRegistered
}