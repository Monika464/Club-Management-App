
import { useContext, useState } from 'react'
//import { UserContext } from '../context/UserContext';
//import Temple from './../assets/temple.svg'
//import Avatar from './../assets/avatar.png'
import { getAuth, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
//import { getStorage } from "firebase/storage";
//import { v4 as uuidv4 } from 'uuid';
import { auth} from '../App';
import SetAvatar from './newuserform/SetAvatar';
import ChoosingAvatar from './ChoosingAvatar';
import { UserContext } from '../utils/auth/UserContext';
import { useNavigate } from 'react-router-dom';


export interface IUserProfile {};   

export const UserProfile : React.FunctionComponent<IUserProfile > =() => {

  const [name, setName] = useState<string | null>('');
  const [thumbnail, setThumbnail] = useState<File | null | string | any>(null);
  const [thumbnailError, setThumbnailError] = useState<string>('');
  const [pictureURL, setPictureURL] = useState<string>('');
    const [isEdited, setIsEdited] = useState<boolean>(false);
    const [email, setEmail] = useState("");
    const [showEmail, setShowEmail] = useState<boolean>(false);
   
    const { currentUser} = useContext(UserContext);
 
    const navigate = useNavigate();

const handleName = () =>{  
  const auth = getAuth();
  const user = auth.currentUser;

  if(user){
    updateProfile(user, {displayName: name})
      .then(() => {
        console.log("Your name was updated")
       })
       .then(() => {
        navigate('/userpanel', { replace: true });
       }) 
       .catch((error) => {    
        console.error(error)
       });

      }
  }


    const updatingEmail = async ()=>{
      const auth = getAuth();
      const user = auth.currentUser;

      if(user){
        await updateEmail(user, email).then(() => {
        alert("Email updated!")
        }).catch((error) => {
        alert("musisz się wylogowac i zalogowac ponownie")
        console.error(error)
        });
       }
      }
   

    

    const [password, setPassword] = useState("");

    const updatingPassword =()=>{
      const auth = getAuth();
      const user = auth.currentUser;
      const newPassword = password;
      
      if(user){
      updatePassword(user, newPassword).then(() => {
       alert("Password update successful")
      }).catch((error) => {
        alert("musisz się wylogowac i zalogowac ponownie")
        console.error(error)
        // ...
      });
    }
    
    }

   //console.log('isEdited',isEdited)
    const handleEdit =()=>{
      setIsEdited(!isEdited)
      setShowEmail(false)
      //navigate('/userpanel')
    }

    const updatingProfile  = async()=>{

      if(currentUser && pictureURL){  
    
             await updateProfile(currentUser, {
                   photoURL: pictureURL 
               })
               .then(() => {
               console.log("Profile updated!");
               })
               .then(() => {
                navigate('/userpanel', { replace: true });
               }) 
               .catch((error) => {
               console.log(error);
               });
         }
        }

const showingEmail =()=>{
  setShowEmail(true)
}
        //to musisz dac zrobic mowy formularz
        //nowa trone dla zapomnianego hasla

        //console.log("current user", currentUser?.email )
      // const handleSendPass =() =>{
      //   if(currentUser){
      //   resetPassForEmail(currentUser.email)
      // }
      // }
      


    return(<>


      <ul>
         <li className="logo">
          <div className="title">Cześć {auth.currentUser?.displayName}</div> 
          <img 
          src={auth.currentUser?.photoURL ?? ''} 
          style= {{width: 80 }} 
          alt="awatar" />
         </li>

         <button onClick={handleEdit} className='btnsmall'>
         {isEdited ? 'Zamknij' : 'Edytuj profil'}
          </button>
  
     </ul>
     <br></br>
      
      {isEdited && 
    <ul>  
<li>
  Wgraj własny avatar 
     <SetAvatar
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        thumbnailError ={thumbnailError}
        setThumbnailError = {setThumbnailError}
        pictureURL ={pictureURL}
        setPictureURL={setPictureURL}
        updatingProfile={updatingProfile}
        />
        <p>{thumbnailError}</p>
        <br></br>
      Albo wybierz jeden z dostępnych
        <ChoosingAvatar/>
     <br></br><br></br>

  </li>





       <li>
          
          <p>Zmień imię</p>
            <input
            type="text"
    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value)  
         }
        }  
   />
    </li>
<button onClick ={handleName}>Uaktualnij</button>
<br></br>
   

     {/* nowy */}
     <br></br>



   <li>
   <p>Zmień email</p>
   <input 
      type="email"  
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
      }} 
       />
<button onClick={updatingEmail}>Uaktualnij</button>
<button className='btnmikro' onClick={showingEmail}>Pokaz aktualny</button>
{showEmail && currentUser && <p>{(currentUser.email)?.toString()}</p>}
   </li>
   <li>
   <br></br>
   <p>Zmień hasło</p>
   <input 
      type="password"  
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
      }}  
       />

<button onClick={updatingPassword}>Uaktualnij</button>

{/* <button onClick={handleSendPass}>wyslij nowe hasło</button> */}
   </li>
   </ul>
  
 
  }



    <br></br>
    
    </>
    )
}
