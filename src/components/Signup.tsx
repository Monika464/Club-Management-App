
import React, { ChangeEvent, FormEvent, useState } from 'react';
import './Login.css';
import { 
  createUserWithEmailAndPassword, 
  getAuth,
   signOut
  } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
//import { useContext } from 'react'
//import { UserContext } from '../context/UserContext';


export interface IApplicationProps {};
//interface URL {}


const SignupPage: React.FunctionComponent<IApplicationProps> =() => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [authing, setAuthing] = useState(false);
    //const [displayName, setDisplayName] = useState< string | null>('')
   // const [thumbnail, setThumbnail] = useState<File | null | string | any>(null)
    //const [imageUpload, setImageUpload] = useState(null);
    //const [thumbnailError, setThumbnailError] = useState<string | null>(null)
    //const [pictureURL, setPictureURL] = useState<string | null>(null)
    //const { currentUser} = useContext(UserContext); 

    const defaultFormFields = {
      email: '',
      password: '',
    }

    const [formFields, setFormFields] = useState(defaultFormFields)
    const { email, password } = formFields

    //https://firebase.google.com/docs/storage/web/upload-files
  

    // const uploadFile = async () => {
    //   const uploadPath = `thumbnails/${currentUser.uid}/thumnail.name`
    //   if (thumbnail === null) {
    //     console.log("Please select an image");
    //     return;
    //   }
    //   const imageRef = storageRef(storage, uploadPath);
    //    await uploadBytes(imageRef, thumbnail)
    //     .then((snapshot) => {
    //       getDownloadURL(snapshot.ref)
    //         .then((url) => {
    //           setPictureURL(url);
    //         })
    //         .catch((error) => {
    //           console.log(error.message);
    //         });
    //     })
    //     .catch((error) => {
    //       console.log(error.message);
    //     });
    // };



//    const handleDisplayName =(event: ChangeEvent<HTMLInputElement>)=>{
//  let displayName = event.target.value;

//  setDisplayName(displayName)
//  console.log('displayName', displayName)
//    }

const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target
  
  setFormFields({...formFields, [name]: value })
  //console.log("formFields",formFields);
  //console.log("displayName",displayName);
 // console.log("thumbnail-gora",thumbnail);
}

const logout=()=> {
  navigate('/login');
    return signOut(auth);
    }
    
const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()   
  
    // Send the email and password to firebase
    await createUserWithEmailAndPassword(auth, email, password)
    .then((response) =>{
      navigate('/');
      console.log("data created", response);
        //console.log(response.user.uid);
       // response.user.uid === "2kyaZZ40UMc1nLaIexUoFKyfVtJ3" ? navigate('/signup'): navigate('/')
  })
  .then(() =>{alert("New user Created!! Now login as a new user")})
  .then(() =>{logout()})
  
  .catch(error =>{
      console.log(error);
      setAuthing(false);
     
   })

   //uploadFile();
   //console.log('pictureURL',pictureURL)

  //  updateProfile(currentUser, {
  //   displayName: displayName, 
  //   photoURL: pictureURL
  // }).then((response) => {
  //   //console.log("response",response);
  //   console.log("Profile updated!");
  // }).catch((error) => {
  //   console.log(error);
  //   });

};

// const handleFileChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
//   setThumbnail(null)
//   let selected = e.target.files[0]  
//   console.log("selected1", selected) 

//   if (!selected) {
//     setThumbnailError('Please select a file')
//     return
//   }
//   if (!selected.type.includes('image')) {
//     setThumbnailError('Selected file must be an image')
//     return
//   }
//   if (selected.size > 100000) {
//     setThumbnailError('Image file size must be less than 100kb')
//     return
//   }
//   console.log("selected2", selected)  
//   setThumbnailError(null)
//   setThumbnail(selected)
//   //console.log("thumbnailFin", thumbnail)
//   //console.log('thumbnail updated')
//   //console.log('thumbnailError', thumbnailError)
// }
//console.log("thumbnail2", thumbnail)

    return (  
      

     <div id="main" className="login-form"> 
        <div className='title'>Stwórz nowego usera</div>
        <br/>
      
         <div id="fields">
         </div>
         
         
         <form onSubmit={handleSubmit}>
    
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
    
              <input
             
                type='password'
                name='password'
                value={password}
                onChange={handleChange}
                placeholder="Password"
                required
              />

{/* <input
          required
          type="text" 
          onChange={handleDisplayName} 
          value={displayName}
          placeholder="Name"
        /> */}


 
{/* <input
  // label="Image"
  placeholder="Choose image"
  accept="image/png,image/jpeg"
  type="file"
  onChange={(e) => {
    handleFileChange(e)
    //console.log(e.target.files[0])
   // setThumbnail(e.target.files[0]);
  }}
/> */}
           
              {/*<input id='recaptcha' type="submit" />*/}
              <br/>
          <button className="btn" disabled={authing} >Załóż konto </button>
          </form>
       
   
            {/* <p>Google</p>
            <button onClick={signInWithGoogle} disabled={authing}>signInWithGoogle</button>
        */}
</div> 
    )
}

export default SignupPage;







