//import MailboxToUserReceive from "../components/mail/MailBoxToUserReceive"
//import mail from '../assets/mail.png'
//import { useNavigate } from "react-router-dom";
import MailToAdminSend from "../../admin/mail/MailToAdminSend";
import { useState } from "react";
import MailboxToUserReceive2 from "./MailboxToUserReceive2";

const UserMailbox: React.FunctionComponent = () => {
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
        {isEditedmailToAdmin ? "Zamknij" : "Wyślij wiadomośc do trenera"}
      </button>
      {isEditedmailToAdmin && <MailToAdminSend />}
    </div>
  );
};

export default UserMailbox;
