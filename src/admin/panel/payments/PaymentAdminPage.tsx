import React, { useState } from "react";
import SwitchMultiToPass from "./SwitchMultiToPass";
import SwithPassToMulti from "./SwithPassToMulti";
import { UsersPayments } from "./UserPayments";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./paymentadminpage-translations.ts";

const PaymentAdminPage: React.FunctionComponent = () => {
  const [clickedComponent, setClickedComponent] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const handleClick = (component: string) => {
    setClickedComponent(component);
  };

  return (
    <div>
      <p className="title">{t.payments}</p>
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
      <p className="title">{t.switchMultiToPass}</p>
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
      <p className="title">{t.switchPassToMulti}</p>
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
