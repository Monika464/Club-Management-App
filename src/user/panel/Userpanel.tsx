import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../utils/auth/UserContext";
import { UserProfile } from "./UserProfile";
import { DisplayUserDataUser } from "./DisplayUserDataUser";
import { useNavigate } from "react-router-dom";
import EmailComponent from "../../utils/components/EmailComponent";
import { useLanguage } from "../../utils/context/LanguageContext.tsx";
import translations from "./userpanel-translations"; // Tłumaczenia
import "./userpanel.css";

export interface IUserProps {}

import { DisplayNextTrainings } from "./DisplayNextTrainings";

const Userpanel: React.FunctionComponent<IUserProps> = () => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handelonmouseover = () => {
    setIsMouseOver(!isMouseOver);
  };

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  return (
    <>
      <div className="main">
        <div className="box">
          <div className="zero">
            <div className="profile">
              <UserProfile />
            </div>
            {/* <ChoosingAvatar/> */}

            {/* <img src={mail} onClick={() => navigate('/mailboxuser')}/>  */}
            <div className="mail">
              <EmailComponent
                collectionName={"usersmails"}
                currentId={currentUser?.uid}
                onClick={() => navigate("/mailboxuser")}
                onmouseover={() => handelonmouseover()}
                isMO={isMouseOver}
              />
            </div>
          </div>
          <div className="content">
            <div className="linkowisko">
              <ul className="linkshape">
                <li>
                  <NavLink to="/home">{t.news}</NavLink>
                </li>
                <li>
                  <NavLink to="/archiveuser">{t.archive}</NavLink>
                </li>
                <li>
                  <NavLink to="/injuryuser">{t.injury}</NavLink>
                </li>
                <li>
                  <NavLink to="/membershipuser">{t.membership}</NavLink>
                </li>
                <li>
                  <NavLink to="/instruction">{t.instruction}</NavLink>
                </li>
              </ul>
            </div>
            <div className="glowna">
              <div className="glowna separate-components">
                <DisplayNextTrainings userid={currentUser?.uid} />

                <DisplayUserDataUser />
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Userpanel;
