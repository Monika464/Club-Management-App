





/*
 export const useFirebaseFunctions =  ()=>{  
 
    const {firebaseConfig} = useFirebaseConfig();
    const [auth, setAuth] = useState(null);
    const [db, setDb] = useState(null);
    const [currentTimestamp, setCurrentTimestamp] = useState(null);
//let currentTimestamp = null;
    
    useEffect(()=>{
    
    try {
    	 const initializeFirebase = async () => {
    	  const app = await initializeApp(firebaseConfig);
 	 const db2 = await getFirestore(app);
 	// await setDb(getFirestore(app))
  	const storage = await getStorage(app);
  	const googleProvider = new GoogleAuthProvider(); 
  	const auth = await getAuth();
    	setAuth(auth);
    	setDb(db2);
   	 }
   	initializeFirebase(); 
   	
     } catch (error){console.log("error",error)}	
      
    },[db,firebaseConfig])
 
// exportujemy sigup
 const  signup = async (email, password) => { 
 
      try {
          await createUserWithEmailAndPassword(auth, email, password); 
           } catch (err) {
           console.error(err)
            } 
}


const login = async(email, password) =>{

 
      try {
          await signInWithEmailAndPassword(auth, email, password);
           } catch (err) {
           console.error(err)
            } 
  };

 const  signInWithGoogle = async()=>{
   const googleProvider = new GoogleAuthProvider();

 // const auth = await getAuth(); 
        try {
          await signInWithPopup(auth,googleProvider);
           } catch (err) { 
           console.error(err)
            } 
  };

//function useAuthentication() {
 // const [ currentUser, setCurrentUser ] = useState(); 
 
  //const auth = await getAuth();
   // const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
   // return unsub;
  

  //return currentUser;
  // }
  
  //potrzebuje zeby sie uaktyalnial tylko jak wczytany
  //jak uaktywniona funkcja showTime
  

const showTime = async () =>{
const current_timestamp = await Timestamp.fromDate(new Date());
const aktualnyCzas = new Timestamp( current_timestamp.seconds,  0 )
//console.log("nowy ",aktualnyCzas);
//setCurrentTimestamp(aktualnyCzas);
return setCurrentTimestamp(aktualnyCzas);
}

  useEffect(()=>{
  showTime();
  
  },[db])

const logout= async ()=> {
//const auth = await getAuth();
return await signOut(auth);
}

//const current_timestamp = Timestamp.fromDate(new Date())

return{logout,signInWithGoogle,login,signup,auth,db, showTime,currentTimestamp}  

}

*/



