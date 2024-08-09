import { createContext, useEffect, useState, ReactNode } from "react";
import { NextOrObserver, User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../App";

interface Props {
  children?: ReactNode
}

export const UserContext = createContext({
  // "User" comes from firebase auth-public.d.ts
  currentUser: {} as User | null ,
  setCurrentUser: (_user:User) => {},

});

export const UserContextProvider = ({ children }: Props) => {

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const userStateListener = (callback:NextOrObserver<User>) => {
    return onAuthStateChanged(auth, callback)
  }

  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        setCurrentUser(user)
      }
    });
    return unsubscribe
  }, [setCurrentUser]);

  const value = {
    currentUser, 
    setCurrentUser,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
  

//https://www.youtube.com/watch?v=nTQ-PfUqDvM&t=744s