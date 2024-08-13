import DisplayUserDataAdmin from "./DisplayUserDataAdmin";
import { UsersWithDebt } from "./UsersWithDebt";

export interface IRaportUsersPage {}

export const RaportUsersPage: React.FunctionComponent<
  IRaportUsersPage
> = () => {
  return (
    <div>
      <UsersWithDebt />
      <br></br>
      <br></br>
      <DisplayUserDataAdmin />
    </div>
  );
};
