import { format } from "date-fns";
import { pl } from "date-fns/locale";

export interface IDateFnsFormatProps {
  element: Date | any;
}

const DateFnsFormat: React.FunctionComponent<IDateFnsFormatProps> = (props) => {
  const date =
    props.element instanceof Date
      ? props.element
      : props.element?.toDate
      ? props.element.toDate()
      : null;

  return <>{date && format(date, "PPP", { locale: pl })}</>;
};

export default DateFnsFormat;
