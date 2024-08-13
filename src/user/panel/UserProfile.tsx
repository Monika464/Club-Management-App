import { useContext, useState } from "react";

import { getAuth, updatePassword, updateProfile } from "firebase/auth";

import { auth } from "../../App";
import SetAvatar from "../../utils/components/SetAvatar";
import ChoosingAvatar from "./ChoosingAvatar";
import { UserContext } from "../../utils/auth/UserContext";
import { useNavigate } from "react-router-dom";

export interface IUserProfile {}

export const UserProfile: React.FunctionComponent<IUserProfile> = () => {
  const [name, setName] = useState<string | null>("");
  const [thumbnail, setThumbnail] = useState<File | null | string | any>(null);
  const [thumbnailError, setThumbnailError] = useState<string>("");
  const [pictureURL, setPictureURL] = useState<string>("");
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [showEmail, setShowEmail] = useState<boolean>(false);

  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleName = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      updateProfile(user, { displayName: name })
        .then(() => {
          console.log("Your name was updated");
        })
        .then(() => {
          navigate("/userpanel", { replace: true });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  // const updatingEmail = async ()=>{
  //   const auth = getAuth();
  //   const user = auth.currentUser;

  //   if(user){

  //     await updateEmail(user, email).then(() => {
  //     alert("Email updated!")
  //     })
  //     .catch((error) => {
  //     alert("przed zminą hasła zweryfikuj email. Link został właśnie wysłany na twoją skrzynkę")
  //     console.error(error)
  //     veryfyingUser();
  //     });
  //    }
  //   }

  // const veryfyingUser = async() =>{
  //   const auth = getAuth();
  // const user = auth.currentUser;

  // if(user){
  //   sendEmailVerification(user).then(() => {
  //     console.log("Verification email sent.");
  //   }).catch((error) => {
  //     console.error("Error sending verification email:", error);
  //   });
  // }

  // }

  const [password, setPassword] = useState("");

  const updatingPassword = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const newPassword = password;

    if (user) {
      updatePassword(user, newPassword)
        .then(() => {
          alert("Password update successful");
        })
        .catch((error) => {
          alert("musisz się wylogowac i zalogowac ponownie");
          console.error(error);
          // ...
        });
    }
  };

  const handleEdit = () => {
    setIsEdited(!isEdited);
    setShowEmail(false);
  };

  const updatingProfile = async () => {
    if (currentUser && pictureURL) {
      await updateProfile(currentUser, {
        photoURL: pictureURL,
      })
        .then(() => {
          console.log("Profile updated!");
        })
        .then(() => {
          navigate("/userpanel", { replace: true });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const showingEmail = () => {
    setShowEmail(true);
  };

  return (
    <>
      <ul>
        <li className="logo">
          <div className="title">Cześć {auth.currentUser?.displayName}</div>
          <img
            src={auth.currentUser?.photoURL ?? ""}
            style={{ width: 80 }}
            alt="awatar"
          />
        </li>

        <button onClick={handleEdit} className="btnsmall">
          {isEdited ? "Zamknij" : "Edytuj profil"}
        </button>
      </ul>
      <br></br>

      {isEdited && (
        <ul>
          <li>
            Wgraj własny avatar
            <SetAvatar
              thumbnail={thumbnail}
              setThumbnail={setThumbnail}
              thumbnailError={thumbnailError}
              setThumbnailError={setThumbnailError}
              pictureURL={pictureURL}
              setPictureURL={setPictureURL}
              updatingProfile={updatingProfile}
            />
            <p>{thumbnailError}</p>
            <br></br>
            Albo wybierz jeden z dostępnych
            <ChoosingAvatar />
            <br></br>
            <br></br>
          </li>

          <li>
            <p>Zmień imię</p>
            <input
              type="text"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
              }}
            />
            <button onClick={handleName}>Uaktualnij</button>
          </li>

          <li>
            <br></br>
            <p>Zmień hasło</p>
            <input
              type="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
            />

            <button onClick={updatingPassword}>Uaktualnij</button>

            {/* <button onClick={handleSendPass}>wyslij nowe hasło</button> */}
          </li>

          <li>
            <br />
            <button onClick={showingEmail}>Pokaz twój aktualny email</button>
            {showEmail && currentUser && <p>{currentUser.email?.toString()}</p>}
          </li>
        </ul>
      )}

      <br></br>
    </>
  );
};
