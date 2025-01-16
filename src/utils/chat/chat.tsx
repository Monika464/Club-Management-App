import React from "react";
import { useLanguage } from "../../utils/context/LanguageContext";
import translations from "./chat-translations";

const ChatPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];
  return (
    <div>
      <p>{t.joinourchat}</p>
      <span>
        {" "}
        <a
          href="https://chatapp-tlzr.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "17px", fontWeight: "bold" }}
        >
          {t.gotochat}
        </a>
      </span>
      {/* <span>
        {" "}
        <a
          href="https://chatapp-tlzr.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to Chat App
        </a>
      </span> */}
      <span style={{ marginLeft: "10px" }}>
        {t.publicroom} <span style={{ fontWeight: "bold" }}>bfft</span>
      </span>
      <p>{t.refresh}</p>
    </div>
  );
};

export default ChatPage;
