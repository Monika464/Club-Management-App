//import { Link } from "react-router-dom"
import ArchiveUserPayment from "../components/archive/ArchiveUserPayment"
import ArchiveViewUser from "../components/archive/ArchiveViewUser"


export interface IArchiveUserpage {

}

const ArchiveUserpage: React.FunctionComponent<IArchiveUserpage> =() => {


    return(
        <div>
                <div><ArchiveUserPayment/></div>
            <div> <ArchiveViewUser/></div>

   
      

       </div>


    )
}

export default ArchiveUserpage