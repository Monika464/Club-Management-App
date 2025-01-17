import React from "react";
import { useLanguage } from "../../utils/context/LanguageContext";
import translations from "./chat-translations";

const ChatPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <p style={{ fontSize: "20px", margin: "20px 0" }}>{t.joinourchat}</p>
      <a
        href="https://chatapp-tlzr.onrender.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "5px",
          fontSize: "17px",
          fontWeight: "bold",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007BFF")}
      >
        {t.gotochat}
      </a>
      <div style={{ marginTop: "20px" }}>
        <span style={{ fontSize: "16px", marginRight: "5px" }}>
          {t.publicroom}
        </span>
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>bfft</span>
      </div>
      <p style={{ fontSize: "16px", marginTop: "20px" }}>{t.refresh}</p>
    </div>
  );
};

export default ChatPage;

// import React from "react";
// import { useLanguage } from "../../utils/context/LanguageContext";
// import translations from "./chat-translations";

// const ChatPage: React.FC = () => {
//   const { currentLanguage } = useLanguage();
//   const t = translations[currentLanguage as "en" | "pl"];
//   return (
//     <div>
//       <p>{t.joinourchat}</p>
//       <span>
//         {" "}
//         <a
//           href="https://chatapp-tlzr.onrender.com"
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ fontSize: "17px", fontWeight: "bold" }}
//         >
//           {t.gotochat}
//         </a>
//       </span>

//       <span style={{ marginLeft: "10px" }}>
//         {t.publicroom} <span style={{ fontWeight: "bold" }}>bfft</span>
//       </span>
//       <p>{t.refresh}</p>
//     </div>
//   );
// };

// export default ChatPage;
