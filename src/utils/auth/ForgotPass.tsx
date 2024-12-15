import React from "react";
import { SetStateAction, useState } from "react";
import { resetPassForEmail } from "../../App";
import "./Login.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../../utils/context/LanguageContext";
import translations from "./forgotpass-translation";

export interface IForgotPassProps {}

const ForgotPass: React.FunctionComponent<IForgotPassProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [isSend, setIsSend] = useState(false);
  //const [isError, setIsError] = useState('');

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const handleSendPass = () => {
    if (email) {
      resetPassForEmail(email);
    }
  };
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    handleSendPass();
    console.log(t.emailSent);
    setIsSend(true);
    // navigate('/login')
  };

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setIsSend(false);
    setEmail(event.target.value);
  };

  return (
    <div>
      <div id="main" className="login-form">
        <div className="title">{t.giveEmail}</div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <br></br>
          <button className="btn">{t.send}</button>
        </form>

        {isSend && (
          <div>
            <p>{t.linkSent}</p>
            <Link to={"../login"} style={{ fontSize: "small" }}>
              {t.goLogin}
            </Link>
          </div>
        )}
        {/* {isError &&<p>{isError.toString()}</p>} */}
      </div>
    </div>
  );
};

export default ForgotPass;
