import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../utils/auth/UserContext";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../App";
import { useNavigate } from "react-router-dom";
//import { getDownloadURL, uploadBytes,ref as storageRef } from 'firebase/storage';
import { updateProfile } from "firebase/auth";

export interface IdateObj {
  seconds: number;
  nanoseconds: number;
}

interface ISigninSending {
  name: string | null;
  surname: string | null;
  dob: Date | IdateObj | null;
  startDay: IdateObj | null;
  option: string | null;
  //email: string | null,
  //password: string | null
  // pictureURL: string | null
}

export function SigninSendingTest(props: ISigninSending) {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  //console.log('currentUser',currentUser)

  const [optionMulti, setOptionMulti] = useState<boolean>(false);
  const [optionPass, setOptionPass] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);

  useEffect(() => {
    //console.log('optionoption',props.option)
    if (props.option === "multi") {
      setOptionMulti(true);
      setOptionPass(false);
      console.log("optionMulti  true");
    }
    if (props.option === "pass") {
      //console.log('optionPass true')
      setOptionPass(true);
      setOptionMulti(false);
    }
  }, [props.option]);

  const dataToUsersArchive = {
    created_at: serverTimestamp(),
    userUid: currentUser?.uid,
    kto: `${props.name} ${props.surname}`,
    ur: props.dob,
    startDay: props.startDay,
  };
  //console.log("pictureURLu",props)

  const WriteUserInfo = async () => {
    //console.log("przycisk wcisniety")
    if (!db) {
      console.error("Firebase Firestore is not initialized yet");
      return;
    }

    if (currentUser) {
      //jesli  option multi
      if (optionMulti) {
        const docRef = doc(db, "usersData", currentUser.uid);
        await setDoc(docRef, {
          name: props.name,
          surname: props.surname,
          dob: props.dob,
          id: currentUser?.uid,
          start: props.startDay,
          due: null,
          optionPass: false,
          optionMulti: true,
          avatar: currentUser.photoURL,
        })
          .then(() => console.log("multi user. update succesful"))
          .then(() => setIsSent(true))
          .then(() => navigate("/userpanel"))
          .catch((err) => console.error(err));
      }
      //jesli  option pass
      if (optionPass) {
        const docRef = doc(db, "usersData", currentUser.uid);
        await setDoc(docRef, {
          name: props.name,
          surname: props.surname,
          dob: props.dob,
          id: currentUser?.uid,
          start: props.startDay,
          due: props.startDay,
          optionPass: optionPass,
          optionMulti: false,
          avatar: currentUser.photoURL,
        })
          .then(() => console.log("pass user. update succesful"))
          .then(() => setIsSent(true))
          .then(() => navigate("/userpanel"))
          .catch((err) => console.error(err));
      }

      //stworz skrzynke mailowa tego usera
      const docRef = doc(db, "usersMailbox", currentUser.uid);
      await setDoc(docRef, {
        mailbox: true,
      });
    }

    //dodaj do archive
    await addDoc(collection(db, "newUsersArchive"), dataToUsersArchive).then(
      () => console.log("new user data sent to archive")
    );
  };

  useEffect(() => {
    //const pathAnonim = `thumbnails/anonim.png`

    if (currentUser) {
      updateProfile(currentUser, {
        displayName: props.name,
      })
        .then(() => {
          //console.log("response",response);
          console.log("Profile name updated!");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [WriteUserInfo]);

  //po zakonczeniu dorobic przekierowanie na userprofile

  // useEffect(()=>{
  //console.log("z komponentu SigninSendingTest",props.name, props.surname,props.dob,"hej", props.option,props.email,props.password)
  //trzeba wyslac do bazy

  // },[props.name])

  return (
    <div>
      <br />
      <button onClick={WriteUserInfo} className="btnsmall">
        Zarejestruj uzywkownika w bazie
      </button>
      {isSent && <p>użytkownik zapisany w bazie</p>}
    </div>
  );
}
