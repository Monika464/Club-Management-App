//import { useNavigate } from "react-router-dom";
import { MailToAdminReceive } from "./MailToAdminReceive";
//import MailboxToUserSend from "../components/mail/MailBoxToUserSend";
import MailboxToUserSend2 from "../../user/mail/MailBoxToUserSend2";

export interface IAdminMailbox {}

const AdminMailbox: React.FunctionComponent<IAdminMailbox> = () => {
  //const navigate = useNavigate();

  return (
    <div>
      {/* <img src={mail} onClick={() => navigate('/userpanel')}/> */}
      <MailToAdminReceive />

      <br></br>
      {/* <MailboxToUserSend/> */}
      <MailboxToUserSend2 />

      <br></br>
    </div>
  );
};

export default AdminMailbox;
