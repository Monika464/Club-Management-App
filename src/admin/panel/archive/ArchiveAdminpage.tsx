//import { Link } from "react-router-dom"
import ArchiveAdminPayment from "./ArchiveAdminPayment";
import ArchiveViewAdmin from "./ArchiveActivityAdmin";
import { useLanguage } from "../../../utils/context/LanguageContext.tsx";
import translations from "./archiveadminpage-translations.ts";
export interface IArchiveAdminpage {}

const ArchiveAdminpage: React.FunctionComponent<IArchiveAdminpage> = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];
  return (
    <div>
      <p className="title">{t.activityHistory}</p>
      <div>
        {" "}
        <ArchiveViewAdmin />
      </div>

      <p className="title">{t.paymentHistory}</p>
      <div>
        <ArchiveAdminPayment />
      </div>
    </div>
  );
};

export default ArchiveAdminpage;
