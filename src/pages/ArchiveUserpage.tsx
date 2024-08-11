//import { Link } from "react-router-dom"
import ArchiveUserPayment from "../components/archive/ArchiveUserPayment";
import { ArchiveActivityUser } from "../components/archive/ArchiveActivityUser";

export interface IArchiveUserpage {}

const ArchiveUserpage: React.FunctionComponent<IArchiveUserpage> = () => {
  return (
    <div>
      <div>
        <ArchiveUserPayment />
      </div>
      <div>
        {" "}
        <ArchiveActivityUser />
      </div>
    </div>
  );
};

export default ArchiveUserpage;
