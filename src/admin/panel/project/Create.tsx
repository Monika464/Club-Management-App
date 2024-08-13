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

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../../App";

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

  const [formError, setFormError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<string | null>("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);

  const [selected, setSelect] = useState<File | null>(null);

  const [assignedUsersListAsVL, setAssignedUserListAsVL] = useState<IforSel[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);

  const usersWithAvatars = useModAvatUsers();
  const navigate = useNavigate();

  const categories = [
    { value: "zawody", label: "Zawody" },
    { value: "treningi", label: "Treningi" },
    { value: "inne", label: "Inne" },
  ];

  const visible = [
    { value: "public", label: "Publiczne" },
    { value: "privat", label: "Prywatne" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnail(null);

    if (e.target.files) {
      const selected = e.target.files[0];
      setSelect((prevSelected) => {
        console.log("Previous selected file:", prevSelected);
        return selected;
      });
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    setFormError(null);

    if (thumbnail) {
      const uploadPath = `projects-photo/${thumbnail.name}`;
      const imageRef = storageRef(storage, uploadPath);

      const snapshot = await uploadBytes(imageRef, thumbnail);
      const url = await getDownloadURL(snapshot.ref);

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
          setLoading(false);
        })
        .then(() => {
          navigate("/home");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

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
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Create;
