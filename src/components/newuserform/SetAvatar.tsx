export interface ISetAvatar {
  thumbnail: File | null;
  setThumbnail: React.Dispatch<File | null>
  thumbnailError: string 
  setThumbnailError: React.Dispatch<string>
  pictureURL: string 
  setPictureURL: React.Dispatch<React.SetStateAction<string>>
  // uploadFile: any
  updatingProfile: () => Promise<void>;
};


import { useCallback, useEffect} from "react"
//import { db } from "../../App.tsx";
import { db, storage } from '../../App.tsx';
import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage";
import { useContext } from 'react'
import { UserContext } from '../../utils/auth/UserContext.tsx';
//import { updateProfile } from "firebase/auth";
import { doc, getDoc,  updateDoc } from "firebase/firestore";
//import { useNavigate } from "react-router-dom";
//import { doc, updateDoc } from "firebase/firestore";


const SetAvatar = (props: ISetAvatar) => {

    //const [thumbnail, setThumbnail] = useState<File | null | string | any>(null)
    //const [thumbnailError, setThumbnailError] = useState<string | null>(null)

    const thumbnail = props.thumbnail;
    const setThumbnail = props.setThumbnail;
    const thumbnailError = props.thumbnailError;
    const setThumbnailError = props.setThumbnailError;
    const pictureURL = props.pictureURL;
    const setPictureURL = props.setPictureURL;
    const updatingProfile = props.updatingProfile;

    const { currentUser} = useContext(UserContext); 
    //const navigate = useNavigate();

         const handleFileChange =  (e: React.ChangeEvent<HTMLInputElement>) => {

         if(e.target.files){     
                  let selected = e.target.files[0]
                    // console.log("selected1", selected)
                 if (!selected) {
                    setThumbnailError('Please select a file')
                    alert('Please select a file')
                  return
                    }
                if (!selected.type.includes('image')) {
                setThumbnailError('Selected file must be an image')
                alert('Selected file must be an image')
                return
                }
                  if (selected.size > 100000) {
                setThumbnailError('Image file size must be less than 100kb')
                alert('Image file size must be less than 100kb. e.g. 170px : 170px res. 70 px/in')
                  return
                }
    //console.log("selected2", selected)  
              setThumbnailError('')
              setThumbnail(selected)
         
            }  
         
            }  
                
                
            const uploadFile = useCallback(async() => {

              if(currentUser && thumbnail){
               const uploadPath = `thumbnails/${currentUser.uid}/${thumbnail.name}`
              //  if (thumbnail === null) {
              //    console.log("Please select an image");
              //    return;
              //  }    
                      const imageRef = storageRef(storage, uploadPath);
           
                       await uploadBytes(imageRef, thumbnail)
                        .then((snapshot) => {
                         getDownloadURL(snapshot.ref)
                         .then((url) => {
                           setPictureURL(url);
                        })
                        .catch((error) => {
                           console.log(error.message);
                         });
                           })
                     
           
               }   
              }, [thumbnail]);         


      

     // console.log('PictureURL',pictureURL ); 

useEffect(()=>{
  uploadFile()
},[thumbnail,uploadFile])

// const updatingProfile  = useCallback(async()=>{

//   if(currentUser && pictureURL){  

//          await updateProfile(currentUser, {
//                photoURL: pictureURL 
//            })
//            .then(() => {
//            console.log("Profile updated!");
//            })
//            //.then(() => {
//             // navigate('/userpanel', { replace: true });
//            //}) 
//            .catch((error) => {
//            console.log(error);
//            });
//      }

// },[pictureURL])

const updateAvatarBase = useCallback(async () => {
  //console.log("jaki tu ", pictureURL === '');
  if (currentUser && (pictureURL !== '')) {
    const userRef = doc(db, "usersData", currentUser.uid);

    const docSnapshot = await getDoc(userRef);
     if (docSnapshot.exists()) {
      await updateDoc(userRef, {
               avatar: pictureURL
             })
               .then(()=> {console.log("new avatar set in base")})
          //       .then(() => {
          //   navigate('/userpanel', { replace: true });
          //  })
        } else {
          console.log("dokument czeka na rejestrację")
        }
     }
    

  },[pictureURL])
//       // Jeśli dokument istnieje, zaktualizuj go
//       await updateDoc(userRef, {
//         avatar: pictureURL,
//       })
//         .then(() => {
//           console.log("Existing avatar updated in the base");
//         })
//         .catch((error) => {
//           console.error("Error updating avatar:", error);
//         });
//     } else {
//       // Jeśli dokument nie istnieje, utwórz go
//       await setDoc(userRef, {
//         avatar: pictureURL,
//       })
//         .then(() => {
//           console.log("New avatar set in the base");
//         })
//         .catch((error) => {
//           console.error("Error setting avatar:", error);
//         });
//     }
//   }
// }, [pictureURL, currentUser]);


// const updateAvatarBase = useCallback(async()=>{

// console.log("funkcja sie wykonuje",currentUser?.uid )
//   if(currentUser){  
//      const userRef = doc(db, "usersData",currentUser.uid);
//      await updateDoc(userRef, {
//        avatar: pictureURL
//        })
//        .then(()=> {console.log("new avatar set in base")})
//      }
  
//   },[pictureURL])

 // przeciez w bazie ni ema takiego dokumenty jeszcze 
 

useEffect(()=>{
 
     updatingProfile();
     updateAvatarBase();  

  thumbnailError ? console.log(thumbnailError): console.log('')
},[pictureURL])
      
//tego jeszcze nie ma
// useEffect(()=>{
//   
//   }
//   updateAvatar2()
//   },[thumbnail,uploadFile])
    
return (
<>

<input
  // label="Image"
  placeholder="Choose image"
  accept="image/png,image/jpeg"
  type="file"
  onChange={(e) => {
    handleFileChange(e)
    //console.log(e.target.files[0])
   //setThumbnail(e.target.files[0]);
  }}
/>

{/* <button onClick={uploadFile}>Upload</button> */}
</>)
}

export default SetAvatar;


