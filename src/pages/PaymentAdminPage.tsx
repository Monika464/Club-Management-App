import React, { useState } from "react";
import SwitchMultiToPass from "../components/SwitchMultiToPass";
import SwithPassToMulti from "../components/SwithPassToMulti";
import { UsersPayments } from "../components/UserPayments";

const PaymentAdminPage: React.FunctionComponent = () => {
  const [clickedComponent, setClickedComponent] = useState<string | null>(null);

  const handleClick = (component: string) => {
    setClickedComponent(component);
  };

  return (
    <div>
      <p className="title">Płatności</p>
      <div
        className={`component-container ${
          clickedComponent !== "UsersPayments" ? "blurred" : ""
        }`}
        onClick={() => handleClick("UsersPayments")}
      >
        <UsersPayments />
      </div>

      <br></br>
      <br></br>
      <p className="title">Przełącz użytkownika z multi na karnet</p>
      <div
        className={`component-container ${
          clickedComponent !== "SwitchMultiToPass" ? "blurred" : ""
        }`}
        onClick={() => handleClick("SwitchMultiToPass")}
      >
        <SwitchMultiToPass />
      </div>

      <br></br>
      <br></br>
      <p className="title">Przełącz użytkownika na karnetu na multi</p>
      <div
        className={`component-container ${
          clickedComponent !== "SwithPassToMulti" ? "blurred" : ""
        }`}
        onClick={() => handleClick("SwithPassToMulti")}
      >
        <SwithPassToMulti />
      </div>
    </div>
  );
};

export default PaymentAdminPage;








// import { Link } from "react-router-dom"
// import SwitchMultiToPass from "../components/SwitchMultiToPass"
// import SwithPassToMulti from "../components/SwithPassToMulti"
// import { UsersPayments } from "../components/UserPayments"


// const PaymentAdminPage: React.FunctionComponent =() => {

//     return(

//         <div>
//            Płatności
//            <br></br>
//             <UsersPayments/>
//             <br></br> <br></br><br></br>
// Przełącz użytkownika z multi na karnet
// <SwitchMultiToPass/>
// <br></br> <br></br>

// Przełącz użytkownika na karnetu na multi
// <SwithPassToMulti/>
// <br></br> <br></br>



//     </div>
//     )

// }

// export default PaymentAdminPage