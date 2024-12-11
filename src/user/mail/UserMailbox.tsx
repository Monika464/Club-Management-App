import React from "react";
import MailToAdminSend from "./MailToAdminSend";
import { useState } from "react";
import MailboxToUserReceive2 from "./MailboxToUserReceive2";
import { useLanguage } from "../../utils/context/LanguageContext";
import translations from "./usermailbox-translations";

const UserMailbox: React.FunctionComponent = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  //const navigate = useNavigate();
  const [isEditedmailToAdmin, setIsEditedmailToAdmin] =
    useState<boolean>(false);

  const handleEditMailToAdmin = () => {
    setIsEditedmailToAdmin(!isEditedmailToAdmin);
    //navigate('/userpanel')
  };

  return (
    <div>
      {/* <img src={mail} onClick={() => navigate('/userpanel')}/> */}
      {/* <MailboxToUserReceive/> */}
      <MailboxToUserReceive2 />

      <br></br>
      <button onClick={handleEditMailToAdmin} className="btn">
        {isEditedmailToAdmin ? t.close : t.sendMessageToTrainer}
      </button>
      {isEditedmailToAdmin && <MailToAdminSend />}
    </div>
  );
};

export default UserMailbox;
