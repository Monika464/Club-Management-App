export interface IInstruction {}
import { useLanguage } from "../../utils/context/LanguageContext";
import translations from "../components/instruction-translation";

const Instruction: React.FunctionComponent<IInstruction> = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  return (
    <div>
      <p className="title">{t.title}</p>

      <ol>
        <li>{t.instruction1}</li>
        <li>{t.instruction2}</li>
        <li>{t.instruction3}</li>
        <li>{t.instruction4}</li>
        <li>{t.instruction5}</li>
        <li>{t.instruction6}</li>
        <li>{t.instruction7}</li>
      </ol>
    </div>
  );
};

export default Instruction;
