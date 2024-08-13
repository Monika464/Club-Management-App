import { useParams } from "react-router-dom";
//import useFetchCollectionData from "../../hooks/useFetchCollections"
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../App";
import { useEffect, useState } from "react";
import ProjectSummary from "./ProjectSummary";
import ProjectComments from "./ProjectComments";
//import { UserContext } from "../../context/UserContext";

export interface IDocument {
  toMillis(): string | number | Date;
  assignedUsers: IforSel[] | null;
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
export interface IAssignedUser {
  dob: IDateObj;
  name: string;
  surname: string;
  id: string;
  avatar: string;
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

export interface IforSel {
  value: IAssignedUser;
  label: string;
}
const ProjectSingle: React.FunctionComponent = () => {
  const [document, setDocument] = useState<IDocument | null>(null);
  const [error, setError] = useState<string | any>("");
  //const [error, setError] = useState<any | string>('');

  const { id } = useParams();

  useEffect(() => {
    try {
      if (id) {
        const projectRef = doc(db, "projects", id);

        const unsub = onSnapshot(projectRef, (doc) => {
          if (doc.exists()) {
            setDocument({ ...doc.data(), id: doc.id } as IDocument);
            //console.log("doc.data()",doc.data().assignedUsers[0].value.id)
            // jesli id to zapisz
          } else {
            setError("No such document exists");
            console.error(error);
          }
        });

        return () => unsub();
      }
    } catch (error) {
      setError(error);
    }
  }, [id, db]);

  return (
    <>
      <div className="project-details">
        <ProjectSummary project={document} />
        <ProjectComments project={document} />

        {/* <h1>{document?.name}</h1> */}

        {/* {error && <p>{error.toString}</p>} */}
      </div>
    </>
  );
};

export default ProjectSingle;
