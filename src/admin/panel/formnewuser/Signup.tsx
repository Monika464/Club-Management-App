import React, { ChangeEvent, FormEvent, useState } from "react";
import "./../../../utils/auth/Login.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./signup-translations";

export interface IApplicationProps {}

const SignupPage: React.FunctionComponent<IApplicationProps> = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const defaultFormFields = {
    email: "",
    password: "",
  };

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  //https://firebase.google.com/docs/storage/web/upload-files

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const logout = () => {
    navigate("/login");
    return signOut(auth);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Send the email and password to firebase
    await createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        navigate("/");
        console.log("data created", response);
        //console.log(response.user.uid);
        // response.user.uid === "2kyaZZ40UMc1nLaIexUoFKyfVtJ3" ? navigate('/signup'): navigate('/')
      })
      .then(() => {
        alert("New user Created!! Now login as a new user");
      })
      .then(() => {
        logout();
      })

      .catch((error) => {
        console.log(error);
        setAuthing(false);
      });
  };

  return (
    <div id="main" className="login-form">
      <div className="title">{t.createUser}</div>
      <br />

      <div id="fields"></div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <br />
        <button className="btn" disabled={authing}>
          {t.setAccount}{" "}
        </button>
      </form>

      {/* <p>Google</p>
            <button onClick={signInWithGoogle} disabled={authing}>signInWithGoogle</button>
        */}
    </div>
  );
};

export default SignupPage;
