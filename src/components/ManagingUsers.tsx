// export interface ImanagingUsers {};  

// interface IuserChoice {
//   name: string,
//   surname: string,
//   due: Date,
//   dob: string,
//   id: string,
//   start: Date
// };  
 


// import { useEffect, useState } from "react"; 
// //import { useFetchUsers } from "../hooks/useFetchUsers"
// import { useFetchDates } from "../hooks/useFetchDates";
// import {useSearchDatesPlusN}  from "../hooks/useSearchDatesPlusN";
// import Select from 'react-select'
// import makeAnimated from 'react-select/animated';  
// import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
// import { db } from "../App.tsx";

// export const ManagingUsers : React.FunctionComponent<ImanagingUsers> =async (props) => {

//     const [closeMenu, setCloseMenu] = useState<boolean>(false);  
//     const[userChoice, setUserChoice] = useState< IuserChoice>([])
//     const [usersModForSelect, setUsersModForSelect] = useState([{}])
//     const [usersInfo, setUsersInfo ] =useState<IuserChoice[] | null>()
//     const [loadingUsers, setLoadingusers] =useState<boolean>(false)
//     const [loadingDB, setLoadingDB] =useState<boolean>(false)
//     const [lastPayChosenUser, setLastPayChosenUser]= useState<Date | null>(null)
//     const [newPayDate, setNewPayDate]= useState<Date | null>(null)

//     //const {usersInfo,loadingUsers, loadingDB} = useFetchUsers();
//     //fetch zrobic tutaj
  
//     const animatedComponents = makeAnimated();

// ////
// useEffect(()=>{

//   const getUsersData = ()=>{     
//     if (!db) {
//    console.error('Firebase Firestore is not ready yet');
//    setLoadingDB(true)       
//    } else { setLoadingDB(false)}              
//   const q =  query(collection(db, "usersData"), orderBy ("surname"));

// const temp: any =[]; 
//      const unsubscribe =  onSnapshot(q, (querySnapshot) => { 
//        //setLoadingusers(true) 
//        querySnapshot.forEach((doc) => {   
//           temp.push(doc.data()); 
          
//          // setLoadingusers(false)
//          //setUsersFromBase((prev) => [...prev,doc.data()])
//        });      
//       });
//       setUsersInfo (temp); 
//     return unsubscribe; 
//  }
// getUsersData()
// },[db])

// /*
//     /////
//     const temp1 =[{}]
//     useEffect(()=>{

//       console.log("tu managing users", usersModForSelect)  
//       console.log("loadingDB", loadingDB) 
  
           
//             if(usersInfo) 
           
//             usersInfo.forEach((el)=>{  
//         //console.log("ell",typeof(el.dob))
//         const expDate = new Date(el.dob)
//         console.log('expDate', expDate)
//         const today = new Date(); // Dzisiejsza data
                   
//         const diffTime = Math.abs(today - expDate); 
//         console.log("diffTime",diffTime)
//         const age = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

//           let nameSurnameAge =  el.name + " "+ el.surname +" "+ age; 
//           console.log(" nameSurnameAge",  nameSurnameAge)
//           temp1.push({ value: el.id, label: nameSurnameAge})  
//           //console.log("temp1",temp1)
         
//         })
//         setUsersModForSelect(temp1);

//         //z tego calego zrob osony usehook
//         // odnosnie nizej przycisk edituser powinien
//         //dopiero zapisywac do zmiennej jako userWybeny-id

//         //na zapisanie tej zmiennej ww usefeefect
//         //reakcja w postaci zczytanie i wyswietlenie jego daty platnosci
//         //przycisk pay
//         //przywoluje hooka na okrslone id
//         //otrzymuje nowy index
//         //raczej nowa funkcja albo nawet nowy usehook
//         //sortuje daty i przyporzaddkowuje do indeksu

//         //zacznij od zrobienia jakos tak zeby wybrana sartday
//         w selekcie write we wstepych info byla w takim formacie
//         jak te z date pickera
          
//     },[])

// */
    
//   const handleEditUser=async()=>{   
    
//     console.log("wybrany id",userChoice.value)
//     //const costam = "Y19J2pywqfd2YKN3zVVGlzYEWR82";
//     const theChoosenOneId = userChoice.value;


//       const docRef = doc(db, "usersData", theChoosenOneId);
//       const docSnap = await getDoc(docRef); 

//       {/*

//       if (docSnap.exists()) { 
//         console.log("Document data:", docSnap.data().due);
//         const lastpay = docSnap.data().due; 
//         setLastPayChosenUser(lastpay);
//         console.log("lastpay",lastpay);  
//       } else {
//         // docSnap.data() will be undefined in this case
//         console.log("No such document!");  
//       }
//     */}
//   }


//   //

// //const wantedIndexResult = useSearchDatesPlusN(8,userChoice.value)  

 
// const data = useFetchDates(); 

//   const handlePayment8trainings= async ()=>{

//  console.log("czytu sa dena",data)  


//     console.log('wantedIndexResult',wantedIndexResult)
//     //console.log('wantedIndexResult',wantedIndexResult)
//      data?.forEach((elem,index)=>{
//       console.log("wew data",elem)
//       if(index === wantedIndexResult){
//        // console.log("szukana data",elem.toDate())
//         setNewPayDate(elem);
//         //alert(`new date set${newPayDate.toDate().toString()}`)
//       }
//     })
//   }
// /*
// const updateDate =async ()=>{
//   const theChoosenOneId = userChoice.value;
//   const dueRef = doc(db, "usersData", theChoosenOneId);
// await updateDoc(dueRef, {   
//   due: newPayDate 
// });
// }
// */



  
 
//   console.log("szukana data",newPayDate)

 


//     return(<>

// {/*
//     managingUsers
//     {loadingUsers && <p>loading...</p>}

//     <Select
//       closeMenuOnSelect={closeMenu}  
//       components={animatedComponents} 
//       isClearable
//       options={usersModForSelect}
//       onChange={(choice) => {
//         setUserChoice(choice);    
//         }}   
//     />
//     <p>{userChoice.label}</p>

//     <button onClick={handleEditUser}>Edit</button>
// <br></br>
// <br></br>
//     Edycja wybranego usera:   
//     {userChoice.label}
//     <br></br>
//     Last payment: 
//     {lastPayChosenUser}
// <br></br>
//     <button onClick={handlePayment8trainings}>pay for 8 trenings</button> 
//    <p>{newPayDate?.toDate().toString()}</p> 
//     <button>Accept new date</button>



// */}

//     </>)
// }


// //usersInfo.forEach((elem)=>{console.log("ludz",elem)})
//     /*
//     to jest wuswietlanie zaleznie od pass
//     useEffect(()=>{       
    
//        console.log("usersInfoManaging",usersInfo)
//        if(usersInfo){
//         usersInfo?.map((userinfo: { passmembership: boolean; })=>{console.log(userinfo.passmembership)})
//         const passmembers = usersInfo.filter((userinfo: { passmembership: boolean; }) => userinfo.passmembership === true);
//         console.log('result', passmembers)
//         const entrymembers = usersInfo.filter((userinfo: { passmembership: boolean; }) => userinfo.passmembership === false);
//         console.log('entrymembers', entrymembers)

//        }
//       // usersInfo?.map((userinfo)=>{console.log(userinfo.passmembership)})
//        //const result = words.filter((word) => word.length > 6);
         
//     },[useFetchUsers])
// */
//     //zrob cis do pobierania 