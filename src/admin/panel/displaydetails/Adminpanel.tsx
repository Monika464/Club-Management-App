import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../../user/panel/userpanel.css";
import EmailComponent from "../../../utils/components/EmailComponent.tsx";
import { AdminPanelStatistics } from "./AdminPanelStatistics.tsx";

export interface IDataItem {
  name: string;
  surname: string;
  avatar: string;
  pause?: boolean;
  stop?: boolean;
}

const Adminpanel: React.FunctionComponent = () => {
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
              <p className="title">Witaj adminie </p>
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
                  <NavLink to="/home">Wydarzenia</NavLink>
                </li>
                <li>
                  <NavLink to="/create">Dodaj event</NavLink>
                </li>
                <li>
                  <NavLink to="/membershipadmin">Rezygnacje</NavLink>
                </li>
                <li>
                  <NavLink to="/paymentadmin">Płatności</NavLink>
                </li>
                <li>
                  <NavLink to="/injuryadmin">Kontuzje</NavLink>
                </li>
                <li>
                  <NavLink to="/usersreport">Użytkownicy</NavLink>
                </li>
                <li>
                  <NavLink to="/datespicker">Treningi</NavLink>
                </li>
                <li>
                  <NavLink to="/attendancelist">Obecność</NavLink>
                </li>
                <li>
                  <NavLink to="/archiveadmin">Archiwum</NavLink>
                </li>
                <li>
                  <NavLink to="/signup">Nowy użytkownik</NavLink>
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
