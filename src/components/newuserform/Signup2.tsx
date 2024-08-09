export interface IApplicationProps {};
import { FormEvent, useContext, useState } from 'react';
import { useMultistepForm } from '../../hooks/useMultiStepForm';
import './Signup2.css'
import { StartAndOptionForm } from './StartEndOptionsForm';
import { UserForm } from './UserForm';
//import { useSingnInToBase } from '../hooks/useSigninToBase';
import {SigninSendingTest}  from './SigninSendingTest';
import SetAvatar from './SetAvatar';
import { UserContext } from '../../utils/auth/UserContext';
import { updateProfile } from 'firebase/auth';

export interface IdateObj{
  toMillis(): number | Date;
  seconds: number,
  nanoseconds: number
}



const Signup2: React.FunctionComponent<IApplicationProps> =() => { 

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [dob, setDob] = useState<Date>(new Date());
    const [option, setOption] = useState<string|null>("");
    //const [startDay, setStartDay] = useState<IdateObj | null>(null);
    const [startDay, setStartDay] = useState<IdateObj | null>(null);
    //const [email, setEmail] = useState<string|null>("");
   // const [password, setPassword] = useState<string|null>("");

    //// zrob props do set avatar
    const [thumbnail, setThumbnail] = useState<File | null >(null);
    const [thumbnailError, setThumbnailError] = useState<string>('');
    const [pictureURL, setPictureURL] = useState<string>('');
    const { currentUser} = useContext(UserContext); 
    //console.log("typ thumbnail",thumbnail)
    //console.log("pictureURLSign",pictureURL)

    //const [authing, setAuthing] = useState(false);
   //// const auth = getAuth();
//const navigate = useNavigate();

  //const displayStartDay = startDay?.toDate() 
   //console.log(format(sssartDay, 'dd.MM.yyyy'))
   //if(displayStartDay){
  // console.log(format(displayStartDay, 'PPP', {locale: pl}))
  //}

  const updatingProfile  = async()=>{

    if(currentUser){  
  
           await updateProfile(currentUser, {
                 photoURL: pictureURL 
             })
             .then(() => {
             console.log("Profile updated!");
             })
             //.then(() => {
              // navigate('/userpanel', { replace: true });
             //}) 
             .catch((error) => {
             console.log(error);
             });
       }
      }


  

    const {steps,currentStepIndex,step,isFirstStep,isLastStep,back, next} = useMultistepForm([
        <UserForm 
        setName={setName}   
        name={name} 
        setSurname={setSurname} 
        surname={surname}
        dob={dob}
        setDob={setDob}
        />,
        <StartAndOptionForm
        option={option}
        setOption={setOption}
        startDay ={startDay}
        setStartDay = {setStartDay}
        />,
        // <AccountForm
        // email ={email}
        // setEmail={setEmail}
        // password={password}
        // setPassword={setPassword}
        // />,
        <SetAvatar
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        thumbnailError ={thumbnailError}
        setThumbnailError = {setThumbnailError}
        pictureURL ={pictureURL}
        setPictureURL={setPictureURL}
        updatingProfile={updatingProfile}
        />
]);



  
<SigninSendingTest 
name={name} 
surname={surname}
dob={dob}
option={option}
startDay ={startDay}
//email ={email}
//password={password}
// pictureURL ={pictureURL}
/>

//const handleCreateUser =(e)=>{
 // createUserWithEmailAndPassword(auth, email, password)
  //.then((response) =>{console.log('response',response)})
//}






//console.log("name,surname",name, surname, dob, option, startDay?.toDate(),email, password)

function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isLastStep) return next()
    alert("Successful  Creation")
  }

    return (<div >

        <div className="signupForm">
            <form onSubmit={onSubmit}>
               <div className={"pageNum"}>
                 {currentStepIndex + 1}/{steps?.length}
               </div>
               {step}                 
               
            
            <div className='pageContent'>
                {!isFirstStep && 
                <button type="button" onClick={back}>
                    Back
                </button>}
              {/*<button type="button" onClick={next}>{isLastStep? "Finish": "Next"}</button>*/}
              {!isLastStep && <button type="button" onClick={next}>Next</button>}
        
            </div>
            </form>
            {/* {isLastStep && <button onClick={handleCreateUser}>Create User</button>} */}
            <div><span className='decript'>imię: </span><span> {name} </span><span className='decript'>nazwisko: </span> <span>{surname} </span><br></br><span className='decript'>ur.</span><span>{dob.toDateString()}</span></div>
            {/* {startDay && <div><span className='decript'>start: </span> <span>{startDay?.toDate().toDateString()} </span></div>} */}
            {startDay && <div><span className='decript'>start: </span> <span>{ new Date(startDay?.toMillis()).toDateString()} </span></div>}
            {option && <div><span className='decript'>typ: </span> <span>{option}</span></div>}
       
            {/* {isLastStep && <SigninSendingTest name={null} surname={null} dob={undefined} startDay={undefined} option={''} email={email} password={password}/>} */}
            {/* {isLastStep && <SigninSendingTest name={name} surname={surname} dob={dob} startDay={startDay} option={option} email={email} password={password}/>} */}
               {isLastStep && <SigninSendingTest name={name} surname={surname} dob={dob} startDay={startDay} option={option} />} 
        </div>
    
         

    </div>)
}

export default Signup2;

