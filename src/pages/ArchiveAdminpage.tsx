//import { Link } from "react-router-dom"
import ArchiveAdminPayment from "../components/archive/ArchiveAdminPayment"
import ArchiveViewAdmin from "../components/archive/ArchiveViewAdmin"

export interface IArchiveAdminpage {

}

const ArchiveAdminpage: React.FunctionComponent<IArchiveAdminpage> =() => {


    return(
        <div>
          <p className="title">Historia aktywności</p>
            <div> <ArchiveViewAdmin/></div>
            
            <p className="title">Historia płatności</p>
           <div><ArchiveAdminPayment/></div>
       </div>


    )
}

export default ArchiveAdminpage