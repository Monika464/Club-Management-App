import React from "react";
import { format } from "date-fns";
import { pl, enUS } from "date-fns/locale";

export interface IDateFnsFormatProps {
  element: Date | any;
  locale: "pl" | "en";
}

const DateFnsFormat: React.FunctionComponent<IDateFnsFormatProps> = (props) => {
  const date =
    props.element instanceof Date
      ? props.element
      : props.element?.toDate
      ? props.element.toDate()
      : null;
  if (!date) return null;

  // Mapowanie lokalizacji na `date-fns` locale
  const locales = { pl, en: enUS };

  // Zwróć sformatowaną datę z odpowiednią lokalizacją
  return <>{format(date, "PPP", { locale: locales[props.locale] })}</>;

  // return <>{date && format(date, "PPP", { locale: pl })}</>;
};

export default DateFnsFormat;
