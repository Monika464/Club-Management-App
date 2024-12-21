import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
//import ColovLogo from "./../../assets/kolovlogo.png";
import eagleLogo from "./../../assets/eagle.png";
import { useContext } from "react";
import { UserContext } from "../../utils/auth/UserContext.tsx";
import translations from "./navbar-translations.ts";

import "./navbar.css";
import { useRegisteringUsers } from "../../utils/hooks/useIsUserRegistered.tsx";
import { useIsAdmin } from "../../utils/auth/useIsAdmin.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
export interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = () => {
  const auth = getAuth();
  // const [authing, setAuthing] = useState(false);
  //const [isAdmin,setIsAdmin] = useState(false);

  const isUserRegistered = useRegisteringUsers();
  //console.log("isRegistered",isUserRegistered)

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [rendered, setRendered] = useState(false);
  const isAdmin = useIsAdmin(currentUser?.uid || "");

  const { currentLanguage, setCurrentLanguage } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setRendered(true);
      console.log("rendering", rendered);
    }, 1000);

    return () => {
      clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
    };
  }, [isUserRegistered]);

  const logout = () => {
    navigate("/login");
    return signOut(auth);
  };

  const redirectToPanel = () => {
    navigate("/userpanel");
  };

  const redirectToAdminPanel = () => {
    navigate("/adminpanel");
  };

  const toggleLanguage = (language: "en" | "pl") => {
    setCurrentLanguage(language);
  };

  console.log("currentLanguage", currentLanguage);
  const t = translations[currentLanguage as "en" | "pl"];
  return (
    <nav className="navbar">
      <ul>
        <li className="logo">
          <img src={eagleLogo} alt="logo" />
          <span className="title">{t.title}</span>
        </li>

        {/* <li>
   {isAdmin &&  <Link to="/signup" className="navlink">Register user</Link >}
   </li> */}
        <li>
          {currentUser && !isUserRegistered && (
            <NavLink to="/signup2" className="navlink">
              {t.register}
            </NavLink>
          )}
        </li>
        <li>
          {!currentUser && (
            <NavLink to="/login" className="navlink">
              {t.login}
            </NavLink>
          )}
        </li>

        <li>
          {currentUser && isAdmin && (
            <button className="btn" onClick={redirectToAdminPanel}>
              {t.admin}
            </button>
          )}
        </li>
        <li>
          {currentUser && (
            <button className="btn" onClick={redirectToPanel}>
              {t.panel}
            </button>
          )}
        </li>

        <li>
          {currentUser && (
            <button className="btn" onClick={logout}>
              {t.logout}
            </button>
          )}
        </li>
        {/* Language switch */}
        <li className="language-switch">
          <span
            className={currentLanguage === "en" ? "active-language" : ""}
            onClick={() => toggleLanguage("en")}
          >
            EN
          </span>{" "}
          |{" "}
          <span
            className={currentLanguage === "pl" ? "active-language" : ""}
            onClick={() => toggleLanguage("pl")}
          >
            PL
          </span>
        </li>
        {/* <li>
          {!currentUser && (
            <NavLink to="/login" className="navlink">
              Language switch
            </NavLink>
          )}
        </li> */}

        {/* <button onClick={handlePrzenies}>przenies</button> */}
      </ul>
    </nav>
  );
};

export default Navbar;
