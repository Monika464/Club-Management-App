// import { useEffect, useState } from "react"  
// import { db } from "../App"
// import { useContext } from 'react'
// import { UserContext } from '../context/UserContext'; 
// import { doc, getDoc, setDoc } from "firebase/firestore";
// //import { ChooseStartDate } from "./ChooseStartDate";  
// import { useModDatesForSelect } from "../hooks/useModDatesForSelect";

// /*choose*/
// //import {useFetchDates} from '../hooks/useFetchDates';
// import Select from 'react-select'
// //import makeAnimated from 'react-select/animated'; 

// export interface IwritingUsers { 

//  // userChoice2: string;
// };    

// export interface PassMultiOptions {
//   readonly value: string;
//   readonly label: string;

// }

// //export const WriteUsersInfo : React.FunctionComponent<IwritingUsers> =({userChoice2: userChoice2}) => {
//   export const WriteUsersInfo : React.FunctionComponent<IwritingUsers> =() => {

//   const { currentUser} = useContext(UserContext);
//   //const data =  useFetchDates();

//   const datesModForSelect = useModDatesForSelect()

//     const [isName, setIsName] = useState(false);
//     const [isSurname, setIsSurname] = useState(false);
//     const [isDob, setIsDob] = useState(false);
//     //const [isDue, setIsDue] = useState(false);
//     const [name, setName] = useState<string | null>(null);
//     const [surname, setSurname] = useState<string | null >(null);
//     const [dob, setDob] = useState<Date | null >(null);
//     const [isPass, setIsPass] = useState<Boolean>(false);
//     const [isMulti, setIsMulti] = useState<Boolean>(false);
//     const [passMultiChoice, setPassMultiChoice] = useState<string>('');
//     const [passMultiSet, setPassMultiSet] = useState<Boolean>(false);

//     //choose
//     const [isStart, setIsStart] = useState<Boolean>(false);
//     const[userChoice, setUserChoice] = useState('');
//    // const [datesModForSelect, setDatesModForSelect] = useState<Date[] | null>([])


//    const passMultiOptions: readonly PassMultiOptions[] = [
//     { value: 'pass', label: 'pass'},
//     { value: 'multi', label: 'multi'}
//    ]

 
//     const handleSetName = (event: { target: { value: any; }; })=>{
//       setName(event.target.value); 
//     }

//     const handleSetSurname = (event: { target: { value: any; }; })=>{
//       setSurname(event.target.value);
//     }

//     const handleSetDob = (event: { target: { value: any; }; })=>{
//       setDob(event.target.value);
//     }

//     useEffect(()=>{
//       if(passMultiChoice === 'pass'){
//         //console.log("say pas")
//         setIsPass(true);
//         setPassMultiSet(true)
//        } else {
//         //console.log("say multi");
//         setIsMulti(true);
//         setPassMultiSet(true)
//        }

//     },[passMultiChoice])

 

//       const WriteUserInfo = async() =>{ 
  	    
//         if (!db) {
//     		  console.error('Firebase Firestore is not initialized yet');
//    		   return;
//     		}

//         if(currentUser){
// 	      const docRef = doc(db, "usersData", currentUser.uid);

//         await setDoc(docRef, {
//           name: name,
//           surname: surname,
//           dob: dob,
//           id: currentUser?.uid, 
//           start: userChoice,
//           due: userChoice,
//           optionPass: isPass,
//           optionMulti: isMulti
//           });
  
//           setIsName(true);
//           setIsSurname(true);
//           setIsDob(true);
//           setIsStart(true);

//       }

    
//          console.log("Info about user  created");    
//      }
      
   
    

//     useEffect(() => {
//       const checkFields = async () => { 

//             if (!db) {
//         console.error('Firebase Firestore is not initialized yet');
//         return;
//       }
      
//      try {

//       if(currentUser){
//         const docRef =  doc(db, "usersData", currentUser.uid);
//        const docSnap = await getDoc( docRef );
   
//            if (docSnap.exists()) { 
//                console.log("Document data:", docSnap.data().name);
//                setIsName(docSnap.data().name !== undefined); 
//                setIsSurname(docSnap.data().surname !== undefined);
//                setIsDob(docSnap.data().dob !== undefined);
//                setIsStart(docSnap.data().start !== undefined);
//                //setIsMulti(docSnap.data().optionMulti !== false);
//                //setIsPass(docSnap.data().optionPass !== undefined);
  

//           } else {
//            // docSnap.data() will be undefined in this case
//             console.log("No such document!");
//           }
//         }
//     } catch (error) {  
//       console.error('Error fetching user data:', error);
//     }
//   };

//   checkFields(); 
// }, [currentUser,WriteUserInfo]);   

// //console.log( 'passMultiChoice', passMultiChoice)


//     return ( 
//      <div> 

//      HEJ HEJ
        
//        	  {!isName && !isSurname && !isDob && !isStart &&
//          	  <p>Update profile</p>}
           
//              <div id="fields">

//            { !isName &&
//            <><input onChange={handleSetName} type="text" placeholder="name" />
//            <button className={"btn"} onClick={WriteUserInfo}>update profile</button>
//            </>
//            }
//            {!isSurname &&
//            <><input onChange={handleSetSurname} type="text" placeholder="surname" />
//            <button className={"btn"} onClick={WriteUserInfo}>update profile</button>
//            </>
//            }
//           { !isDob &&
//            <><input onChange={handleSetDob} type="date" placeholder="dob" />
//            <button className={"btn"} onClick={WriteUserInfo}>update profile</button>
//            </>
//            }

//             </div>    

  
//        { !isStart && <div>    

        
//           <p>Select date of start trainings</p>  
  
//          <Select
//       closeMenuOnSelect={true} 
//       /*components={animatedComponents}  */
//       options={datesModForSelect}
//       onChange={(choice) => {     
//       if (choice && 'value' in choice) {
//           const selectedValue = choice.value;
//           setUserChoice(selectedValue);
//           console.log("choice.value",choice.value)
//         } else {
//           setUserChoice(''); 
//         }
//       }}
//        />
//      {/*<p>{userChoice}</p>*/}
//      {/*<button className={"btn"} onClick={handleChoose}>send</button>*/}
//      <button className={"btn"} onClick={WriteUserInfo } >update profile</button>
//      </div> }

//    {passMultiSet !== false && <div>
//     <Select
//     defaultValue={passMultiOptions[0]}
//     options={passMultiOptions}
//     onChange={(choice ) => { 
//       if(choice){
//       setPassMultiChoice(choice.value)
//       }
//     }}
//      />
//           <button className={"btn"} onClick={WriteUserInfo } >update profile</button>

//    </div>}
 
   
   
  

// </div>   )
// }
