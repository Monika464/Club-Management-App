import React from "react";
import ArchiveUserPayment from "../archive/ArchiveUserPayment";
import { ArchiveActivityUser } from "../archive/ArchiveActivityUser";

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
