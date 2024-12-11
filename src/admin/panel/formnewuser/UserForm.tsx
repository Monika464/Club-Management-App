import React from "react";
import { FormWrapper } from "./FormWrapper";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./userform-translations";

interface IUserFormProps {
  setName: (value: string) => void;
  setSurname: (value: string) => void;
  name: string;
  surname: string;
  setDob: (value: Date) => void;
  dob: Date | any;
}

export function UserForm(props: IUserFormProps) {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //setDobInput(e.target.value);
    const dateParts = e.target.value.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[2]);
    const newDate = new Date(year, month, day);
    props.setDob(newDate);
  };

  return (
    <>
      <FormWrapper title="Podstawowe dane">
        <br />
        <label>{t.name}</label>
        <input
          autoFocus
          required
          type="text"
          onChange={(e) => props.setName(e.target.value)}
          value={props?.name}
        ></input>
        <label>{t.surname}</label>
        <input
          required
          type="text"
          onChange={(e) => props.setSurname(e.target.value)}
          value={props?.surname}
        ></input>
        <label>{t.dob}</label>
        <input
          required
          type="date"
          onChange={handleDobChange}
          defaultValue={props.dob}
          /*value={props?.dob}*/
        ></input>
      </FormWrapper>
    </>
  );
}
