import { Link } from "react-router-dom";
import Avatar from "../../../user/panel/Avatar";
import "./project.css";
import { format } from "date-fns";
import pl from "date-fns/locale/pl";
import en from "date-fns/locale/en-US";
import translations from "./projectsummary-translations.ts";
import { LanguageContext } from "../../../utils/context/LanguageContext.tsx";
import { useContext } from "react";

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

export interface IforSel {
  value: IAssignedUser;
  label: string;
}

export interface IAssignedUser {
  dob: IDateObj;
  name: string;
  surname: string;
  id: string;
  avatar: string;
}

export interface IDateObj {
  seconds: number;
  nanoseconds: number;
  toMillis(): string | number | Date;
}

export interface IComment {
  content: string;
  created_at: IDateObj;
  displayName: string;
  photoURL: string;
  id: string;
}
interface ProjectSummaryProps {
  project: IDocument | null;
}
const ProjectSummary: React.FunctionComponent<ProjectSummaryProps> = (
  props
) => {
  const { currentLanguage } = useContext(LanguageContext); // Pobieranie bieżącego języka
  const t = translations[currentLanguage];
  const locale = currentLanguage === "pl" ? pl : en;

  return (
    <div>
      {props.project && (
        <div className="project-summary">
          <p>
            <Link to="/home" className="linkback">
              {t.updates}
            </Link>
          </p>
          <h1 className="page-title">{props?.project?.name}</h1>

          {/* <p className='due-date'>{`${props?.project?.eventdate.toDate().toLocaleDateString('pl-PL')}`}</p> */}
          <p className="due-date">
            {props.project && (
              <>
                {format(
                  new Date(props.project?.eventdate.toMillis()),
                  "PP-EEEE",
                  { locale }
                )}
              </>
            )}
          </p>
          <p className="details">{props?.project?.details}</p>

          <img src={props?.project?.photo} className="photo" />

          <h4>{t.participants}</h4>

          <div className="assigned-users">
            <ul>
              {props?.project?.assignedUsers?.map((user) => (
                <li key={user.value.id}>
                  <div className="wyrownaj">
                    <Avatar src={user.value.avatar} />
                    <p>
                      {user.value.name} {user.value.surname}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSummary;
