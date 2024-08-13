export interface ICreate {}

export interface ITimeObj {
  toMillis(): number | string;
  seconds: number;
  nanoseconds: number;
}

export interface IforSel {
  value: IAssignedUser;
  label: string;
}

export interface IAssignedUser {
  dob: ITimeObj;
  name: string;
  surname: string;
  id: string;
  avatar: string;
}

export interface IDocument {
  toMillis(): string | number | Date;
  assignedUsers: IAssignedUser[] | null;
  category: string;
  comments: IComment[] | null;
  created_at: IDateObj;
  details: string | null;
  eventdate: IDateObj;
  name: string;
  photo: string;
  visibility: string;
  id: string;
}

export interface IProject {
  project: IDocument | null;
}

export interface IDateObj {
  seconds: number;
  nanoseconds: number;
  toMillis(): string | number;
}

export interface IComment {
  content: string;
  created_at: IDateObj;
  displayName: string;
  photoURL: string;
  id: string;
  uid: string;
}

import Select from "react-select";
import "./create.css";
import { useState } from "react";
//import { useModUsersForSelect } from '../hooks/useModUsersForSelect ';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../../App";
//import { useFetchUsers } from '../hooks/useFetchUsers';
import { useModAvatUsers } from "../../../utils/hooks/useModAvatUsers";
import { useNavigate } from "react-router-dom";
import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
//import { Timestamp } from 'firebase-admin/firestore';

const Create: React.FunctionComponent<ICreate> = () => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState<string>("");
  // const [assignedUser, setAssignedUser] = useState<IforSel[]>([])
  const [formError, setFormError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<string | null>("");
  //const [newUsersList, setNewUsersList] = useState<US[]>([])
  //const [eventDateTime, setEventDateTime] = useState<string>(''); // Przechowuje datę i godzinę jako string
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  //const [pictureURL, setPictureURL] = useState<URL | null | string>(null)
  const [selected, setSelect] = useState<File | null>(null);
  //const userModForSelect  =  useModUsersForSelect();
  const [assignedUsersListAsVL, setAssignedUserListAsVL] = useState<IforSel[]>(
    []
  );
  //const [chosenUsersAsVL, setChosenUsersAsVL] =

  const usersWithAvatars = useModAvatUsers();
  const navigate = useNavigate();

  //console.log("usersWithAvatars",usersWithAvatars)

  const categories = [
    { value: "zawody", label: "Zawody" },
    { value: "treningi", label: "Treningi" },
    { value: "inne", label: "Inne" },
  ];

  const visible = [
    { value: "public", label: "Publiczne" },
    { value: "privat", label: "Prywatne" },
  ];

  // const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEventDateTime(e.target.value);
  //   };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnail(null);

    if (e.target.files) {
      let selectedd = e.target.files[0];
      console.log("e.target", e.target);
      console.log("selected1", selected);
      setSelect(selectedd);
    }
    if (!selected) {
      setThumbnailError("Please select a file");
      return;
    }

    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    if (selected.size > 10000000) {
      setThumbnailError("Image file size must be less than ..kb");
      return;
    }
    //console.log("selected2", selected)
    setThumbnailError(null);
    setThumbnail(selected);
  };

  //  // console.log('PictureURLzeew',pictureURL );
  //  useEffect(()=>{

  //   const temp =[]

  //   const assigningValLab =()=>{
  //       console.log("assignedUser",el,index);
  //       temp.push(el);
  //      }
  //      setAssignedUserListAsVL(temp)

  //    assigningValLab();

  //  },[])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // if (!selected) {
    //     setThumbnailError('Please select a file')
    //     return
    //   }
    setFormError(null);

    if (thumbnail) {
      const uploadPath = `projects-photo/${thumbnail.name}`;
      const imageRef = storageRef(storage, uploadPath);

      const snapshot = await uploadBytes(imageRef, thumbnail);
      const url = await getDownloadURL(snapshot.ref);

      //  const assignedUsersList: IforSelect[] = assignedUser?.map((u) => ({
      //   value: {
      //     dob: u.value.dob,
      //     name: u.value.name,
      //     surname: u.value.surname,
      //     id: u.value.id,
      //     avatar: u.value.avatar
      //   },
      //   label: `${u.value.name} ${u.value.surname}`
      // })) || [];

      // const assignedUsersList:IforSel = assignedUser?.map((u)=>{

      // //   // return {
      // //   //     name: u.name,
      // //   //     avatar: u.avatar,
      // //   //     id: u.id
      // //   //   }
      //    return {
      //   name: u.value.name,
      //   surname: u.value.surname,
      //   avatar: u.value.avatar,
      //   id: u.value.id,
      //   dob: u.value.dob
      // }
      // })

      const moddate = new Date(eventDate);
      // console.log("modddate",moddate )
      await addDoc(collection(db, "projects"), {
        name: name,
        details: details,
        category: category,
        eventdate: moddate,
        visibility: visibility,
        assignedUsers: assignedUsersListAsVL,
        created_at: serverTimestamp(),
        photo: url,
        comments: [],
      })
        .then(() => {
          console.log("susceess!! Data sent");
          // resetState();
        })
        .then(() => {
          navigate("/home");
          // resetState();
        })
        .catch((err) => {
          console.error(err);
        });

      // console.log(name, details,'eventDate', eventDate, category.value, assignedUsersList,visibility.value)

      // console.log("formError",formError)
    }
  };

  //console.log('assignedUsers',assignedUsers );

  return (
    <div className="create-form">
      <h2 className="page-title">Stwórz nowe wydarzenie</h2>
      <br></br>
      <br></br>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Tytuł projektu:</span>
          <input
            // required
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Szczegóły:</span>
          <textarea
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          ></textarea>
        </label>
        <label>
          <span>Data wydarzenia :</span>
          {/* <input
          required
          type="datetime-local"
          onChange={handleDateTimeChange}
          value={eventDateTime}
            /> */}
          <input
            required
            type="date"
            onChange={(e) => setEventDate(e.target.value)}
            value={eventDate}
          />
        </label>
        <label>
          <span>Kategoria:</span>
          <Select
            required
            onChange={(option) => {
              if (option) {
                setCategory(option.value);
              }
            }}
            options={categories}
          />
        </label>
        <label>
          <span>Widoczność:</span>
          <Select
            //required
            onChange={(option) => {
              if (option) {
                setVisibility(option.value);
              }
            }}
            options={visible}
          />
        </label>
        <label>
          <span>Przypisz do:</span>

          <Select
            onChange={(option) => {
              setAssignedUserListAsVL(
                option.map((item) => ({
                  label: item.label,
                  value: {
                    dob: item.value.dob,
                    name: item.value.name,
                    surname: item.value.surname,
                    id: item.value.id,
                    avatar: item.value.avatar,
                  },
                }))
              );
            }}
            options={usersWithAvatars}
            isMulti
          />

          {/* <Select
            onChange={(option) =>{
              setAssignedUserListAsVL(option);
              console.log("option",option);
              //option sklada sie z obiektow o kolejnych indeksach
              //z ktorych kazdy ma wartość value i label
              //label to string a value to obiekt zawierajacy 
              //name,surname,avatar,id,dob
            }                          
            }
            options={usersWithAvatars}
            isMulti
          />  */}
        </label>
        <br></br>
        <label>
          <span>Wgraj zdjęcie:</span>
          <input
            // label="Image"
            placeholder="Choose image"
            accept="image/png,image/jpeg"
            type="file"
            onChange={(e) => {
              handleFileChange(e);
              //console.log(e.target.files[0])
              // setThumbnail(e.target.files[0]);
            }}
          />
          {/* <button onClick={uploadFile}>Upload</button> */}
        </label>
        <br />
        <button className="btn">Add Project</button>
      </form>
      {formError && <p className="error">{formError}</p>}

      {thumbnailError && <p className="error">{thumbnailError}</p>}
    </div>
  );
};

export default Create;
