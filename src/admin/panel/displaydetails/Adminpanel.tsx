import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../../user/panel/userpanel.css";
import EmailComponent from "../../../utils/components/EmailComponent.tsx";
import { AdminPanelStatistics } from "./AdminPanelStatistics.tsx";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./adminpanel-translations";

export interface IDataItem {
  name: string;
  surname: string;
  avatar: string;
  pause?: boolean;
  stop?: boolean;
}

const Adminpanel: React.FunctionComponent = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const navigate = useNavigate();

  const [isMouseOver, setIsMouseOver] = useState(false);
  const handelonmouseover = () => {
    setIsMouseOver(!isMouseOver);
  };
  return (
    <>
      <div className="main">
        <div className="box">
          <div className="zero">
            <div className="profile">
              <p className="title">{t.hello}</p>
              <br></br>
              <br></br>
              {/* <img src={mail} onClick={() => navigate('/mailboxadmin')}/>  */}
            </div>

            <div className="mail">
              <EmailComponent
                collectionName={"usersmessages"}
                currentId={"empty"}
                onClick={() => navigate("/mailboxadmin")}
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
                  <NavLink to="/create">{t.addevent}</NavLink>
                </li>
                <li>
                  <NavLink to="/membershipadmin">{t.resignation}</NavLink>
                </li>
                <li>
                  <NavLink to="/paymentadmin">{t.payments}</NavLink>
                </li>
                <li>
                  <NavLink to="/injuryadmin">{t.injuries}</NavLink>
                </li>
                <li>
                  <NavLink to="/usersreport">{t.users}</NavLink>
                </li>
                <li>
                  <NavLink to="/datespicker">{t.classess}</NavLink>
                </li>
                <li>
                  <NavLink to="/attendancelist">{t.attendance}</NavLink>
                </li>
                <li>
                  <NavLink to="/archiveadmin">{t.archive}</NavLink>
                </li>
                <li>
                  <NavLink to="/signup">{t.newUser}</NavLink>
                </li>
              </ul>
            </div>
            <div className="glowna">
              <br></br>
              <br></br>
              <AdminPanelStatistics name={""} surname={""} avatar={""} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminpanel;
