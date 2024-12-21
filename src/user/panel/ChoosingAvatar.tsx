import { db, storage } from "../../App.tsx";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/auth/UserContext.tsx";
import { updateProfile } from "firebase/auth";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Import all avatar images
import warrior0 from "../../assets/avatars/0warrior.png";
import warrior1 from "../../assets/avatars/1warrior.png";
import warrior2 from "../../assets/avatars/2warrior.png";
import warrior3 from "../../assets/avatars/3warrior.png";
import warrior4 from "../../assets/avatars/4warrior.png";
import warrior5 from "../../assets/avatars/5warrior.png";
import warrior6 from "../../assets/avatars/6warrior.png";
import warrior7 from "../../assets/avatars/7warrior.png";
import warrior8 from "../../assets/avatars/8warrior.png";
import warrior9 from "../../assets/avatars/9warrior.png";

// Array to store avatar information
const avatars = [
  { src: warrior0, filename: "0warrior.png" },
  { src: warrior1, filename: "1warrior.png" },
  { src: warrior2, filename: "2warrior.png" },
  { src: warrior3, filename: "3warrior.png" },
  { src: warrior4, filename: "4warrior.png" },
  { src: warrior5, filename: "5warrior.png" },
  { src: warrior6, filename: "6warrior.png" },
  { src: warrior7, filename: "7warrior.png" },
  { src: warrior8, filename: "8warrior.png" },
  { src: warrior9, filename: "9warrior.png" },
];

const ChoosingAvatar = () => {
  const [thumbnail, setThumbnail] = useState<null | string>(null);
  const [url, setUrl] = useState<string>("");
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const uploadFile = useCallback(async () => {
    if (thumbnail) {
      try {
        const downloadUrl = await getDownloadURL(
          storageRef(storage, `avatars2/${thumbnail}`)
        );
        setUrl(downloadUrl);
      } catch (error) {
        console.error(error);
      }
    }
  }, [thumbnail]);

  useEffect(() => {
    uploadFile();
  }, [thumbnail]);

  useEffect(() => {
    const updateAvatar = async () => {
      if (currentUser && url) {
        try {
          await updateProfile(currentUser, { photoURL: url });

          const userRef = doc(db, "usersData", currentUser.uid);
          console.log("hello");
          await updateDoc(userRef, { avatar: url });
          console.log("hello1");
          console.log("Profile updated and avatar set!");
          console.log("Navigating to /userpanel...");
          navigate("/userpanel", { replace: true });
        } catch (error) {
          console.error(error);
        }
      }
    };

    updateAvatar();
  }, [url]);

  const handleMouseOver = (index: number) => setIsHovered(index);
  const handleMouseOut = () => setIsHovered(null);
  const handleClick = (index: number) => {
    setThumbnail(avatars[index].filename);
    setClickedIndex(index);
  };

  return (
    <div>
      {avatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar.src}
          style={{
            width: isHovered === index ? 80 : 40,
            filter: clickedIndex === index ? "blur(80px)" : "none",
          }}
          alt={`Avatar ${index}`}
          onMouseOver={() => handleMouseOver(index)}
          onMouseOut={handleMouseOut}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default ChoosingAvatar;

// export interface IChoosingAvatar {}

// import { db, storage } from "../../App.tsx";
// import { useCallback, useContext, useEffect, useState } from "react";
// import { UserContext } from "../../utils/auth/UserContext.tsx";
// import { updateProfile } from "firebase/auth";
// import { ref as storageRef, getDownloadURL } from "firebase/storage";

// import warrior0 from "../../assets/avatars/0warrior.png";
// import warrior1 from "../../assets/avatars/1warrior.png";
// import warrior2 from "../../assets/avatars/2warrior.png";
// import warrior3 from "../../assets/avatars/3warrior.png";
// import warrior4 from "../../assets/avatars/4warrior.png";
// import warrior5 from "../../assets/avatars/5warrior.png";
// import warrior6 from "../../assets/avatars/6warrior.png";
// import warrior7 from "../../assets/avatars/7warrior.png";

// //console.log("warrior0",warrior0);

// import { doc, updateDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const ChoosingAvatar = () => {
//   const [thumbnail, setThumbnail] = useState<null | string>(null);
//   // const [thumbnailError, setThumbnailError] = useState<string | null>(null)
//   // const [pictureURL, setPictureURL] = useState<string | null>(null)
//   const [url, setUrl] = useState<string>("");
//   //const [avatarChanged, setAvatarChanged] = useState(false);
//   // const [isClicked, setIsClicked] = useState(false);
//   const { currentUser } = useContext(UserContext);
//   const navigate = useNavigate();
//   const [isHovered, setIsHovered] = useState<number | null>(null);
//   const [mod0, setMod0] = useState(false);
//   const [mod1, setMod1] = useState(false);
//   const [mod2, setMod2] = useState(false);
//   const [mod3, setMod3] = useState(false);
//   const [mod4, setMod4] = useState(false);
//   const [mod5, setMod5] = useState(false);
//   const [mod6, setMod6] = useState(false);
//   const [mod7, setMod7] = useState(false);

//   // console.log("thumb",thumbnail)

//   const uploadFile = useCallback(async () => {
//     if (thumbnail) {
//       await getDownloadURL(storageRef(storage, `avatars2/${thumbnail}`))
//         .then((url) => {
//           setUrl(url);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   }, [thumbnail]);

//   // const uploadFile = async () => {
//   //      if(thumbnail){
//   //        await getDownloadURL(storageRef(storage, `avatars2/${thumbnail}`))
//   //         .then((url) => {
//   //          setUrl(url)
//   //          })
//   //         .catch((error) => {
//   //          console.log(error);
//   //         });
//   //     }
//   // }

//   useEffect(() => {
//     uploadFile();
//   }, [thumbnail]);

//   useEffect(() => {
//     const updateAvatar = async () => {
//       if (currentUser && thumbnail) {
//         console.log("is thumbnail", thumbnail);
//         updateProfile(currentUser, {
//           photoURL: url,
//         })
//           .then(() => {
//             //console.log("response",response);
//             console.log("Profile updated!");
//           })
//           .then(() => {
//             navigate("/userpanel", { replace: true });
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       }
//     };
//     updateAvatar();
//   }, [url]);

//   useEffect(() => {
//     const updateAvatar2 = async () => {
//       if (currentUser && thumbnail) {
//         const userRef = doc(db, "usersData", currentUser?.uid);
//         await updateDoc(userRef, {
//           avatar: url,
//         }).then(() => {
//           console.log("new avatar set");
//         });
//       }
//     };

//     updateAvatar2();
//   }, [url]);

//   const handleAvatHover = (index: number) => {
//     setIsHovered(index);
//   };

//   return (
//     <div>
//       <img
//         src={warrior0}
//         //  style= {{width: 40 }}
//         style={{
//           width: isHovered === 0 ? 80 : 40,
//           filter: mod0 ? "blur(80px)" : "none",
//         }}
//         alt="awatar"
//         onClick={() => {
//           setThumbnail("0warrior.png");
//           setMod0(true);
//         }}
//         onMouseOver={() => handleAvatHover(0)}
//         // onMouseOver={() => setIsHovered(true)}
//         // onMouseOut={() => setIsHovered(false)}
//       />
//       <img
//         src={warrior1}
//         style={{
//           width: isHovered === 1 ? 80 : 40,
//           filter: mod1 ? "blur(80px)" : "none",
//         }}
//         alt="awatar"
//         onClick={() => {
//           setThumbnail("1warrior.png");
//           setMod1(true);
//         }}
//         onMouseOver={() => handleAvatHover(1)}
//         // onMouseOver={() => setIsHovered(true)}
//         // onMouseOut={() => setIsHovered(false)}
//       />

//       <img
//         src={warrior2}
//         style={{
//           width: isHovered === 2 ? 80 : 40,
//           filter: mod2 ? "blur(80px)" : "none",
//         }}
//         alt="awatar"
//         onClick={() => {
//           setThumbnail("2warrior.png");
//           setMod2(true);
//         }}
//         onMouseOver={() => handleAvatHover(2)}
//         // onMouseOver={() => setIsHovered(true)}
//         // onMouseOut={() => setIsHovered(false)}
//       />

//       <img
//         src={warrior3}
//         style={{
//           width: isHovered === 3 ? 80 : 40,
//           filter: mod3 ? "blur(80px)" : "none",
//         }}
//         alt="awatar"
//         onClick={() => {
//           setThumbnail("3warrior.png");
//           setMod3(true);
//         }}
//         onMouseOver={() => handleAvatHover(3)}
//         // onMouseOver={() => setIsHovered(true)}
//         // onMouseOut={() => setIsHovered(false)}
//       />

//       <br></br>
//       <img
//         src={warrior4}
//         style={{
//           width: isHovered === 4 ? 80 : 40,
//           filter: mod4 ? "blur(80px)" : "none",
//         }}
//         alt="awatar"
//         onClick={() => {
//           setThumbnail("4warrior.png");
//           setMod4(true);
//         }}
//         onMouseOver={() => handleAvatHover(4)}
//         // onMouseOver={() => setIsHovered1(true)}
//         // onMouseOut={() => setIsHovered1(false)}
//       />
//       <img
//         src={warrior5}
//         style={{
//           width: isHovered === 5 ? 80 : 40,
//           filter: mod5 ? "blur(80px)" : "none",
//         }}
//         alt="awatar"
//         onClick={() => {
//           setThumbnail("5warrior.png");
//           setMod5(true);
//         }}
//         onMouseOver={() => handleAvatHover(5)}
//         // onMouseOver={() => setIsHovered1(true)}
//         // onMouseOut={() => setIsHovered1(false)}
//       />
//       <img
//         src={warrior6}
//         style={{
//           width: isHovered === 6 ? 80 : 40,
//           filter: mod6 ? "blur(80px)" : "none",
//         }}
//         alt="awatar"
//         onClick={() => {
//           setThumbnail("6warrior.png");
//           setMod6(true);
//         }}
//         onMouseOver={() => handleAvatHover(6)}
//         // onMouseOver={() => setIsHovered1(true)}
//         // onMouseOut={() => setIsHovered1(false)}
//       />
//       <img
//         src={warrior7}
//         style={{
//           width: isHovered === 7 ? 80 : 40,
//           filter: mod7 ? "blur(80px)" : "none",
//         }}
//         alt="awatar"
//         onClick={() => {
//           setThumbnail("7warrior.png");
//           setMod7(true);
//         }}
//         onMouseOver={() => handleAvatHover(7)}
//         // onMouseOver={() => setIsHovered1(true)}
//         // onMouseOut={() => setIsHovered1(false)}
//       />
//       <br></br>
//       {/* <button onClick={uploadFile}>Upload</button> */}
//       {/*
//    {avatarChanged && <p>Avatar wgrany</p>} */}
//     </div>
//   );
// };

// export default ChoosingAvatar;
