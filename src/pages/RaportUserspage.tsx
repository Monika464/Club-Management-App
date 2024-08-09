import DisplayUserDataAdmin from "../components/displayDetails/DisplayUserDataAdmin"
import { UsersWithDebt } from "../components/displayDetails/UsersWithDebt"

export interface IRaportUsersPage{
}
 

export const RaportUsersPage : React.FunctionComponent<IRaportUsersPage> =() => {


    return(<div>
<UsersWithDebt/>
<br></br><br></br>
<DisplayUserDataAdmin/> 

    </div>)
}