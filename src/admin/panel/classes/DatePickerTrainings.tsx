import React from "react";
import { useEffect, useState } from "react";
//import { db } from "../App";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../App";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./datepickertrainings-translations";
export interface PossibleTrainingDate {
  value: Date;
  label: string;
}

export const DatePickerTrainings: React.FunctionComponent = () => {
  const animatedComponents = makeAnimated();

  const [selectedDates, setSelectedDates] = useState<PossibleTrainingDate[]>(
    []
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dayRange, setDayRange] = useState<Date[]>([]);
  const [userChoice, setUserChoice] = useState<Date[]>([]);

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const getDatesBetween = (startDate: Date, endDate: Date) => {
    const datess: Date[] = [];

    let currentDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );

    while (currentDate <= endDate) {
      datess.push(currentDate);

      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
    }

    return datess;
  };

  const onChange = async (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setDayRange(
      getDatesBetween(start, end).filter(
        (el) => el.getDay() === 1 || el.getDay() === 4
      )
    );
  };

  useEffect(() => {
    if (dayRange) {
      const newDates = dayRange.map((day) => ({
        value: day,
        label: day.toLocaleDateString("default", {
          month: "short",
          day: "numeric",
        }),
      }));
      setSelectedDates((prevSelectedDates) => [
        ...prevSelectedDates,
        ...newDates,
      ]);
    }
  }, [dayRange]);

  const resetState = () => {
    setUserChoice([]);
    setSelectedDates([]);
    setStartDate(new Date());
    setEndDate(null);
  };

  const sendToFirebase = async () => {
    await addDoc(collection(db, "trainingDays"), {
      datesSet: userChoice?.map((dat) => new Date(dat)),
      created_at: serverTimestamp(),
    })
      .then(() => {
        console.log("succsess!! Data sent");
        resetState();
        //setIsReset(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <DatePicker
        selected={startDate}
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        selectsRange
        inline
        isClearable
      />

      <Select
        components={animatedComponents}
        closeMenuOnSelect={false}
        isMulti
        options={selectedDates}
        onChange={(choice) => {
          const selectedValues: Date[] = choice?.map(
            (option: any) => option.value
          );
          setUserChoice(selectedValues);
        }}
      />

      <button className={"btn"} onClick={sendToFirebase}>
        {t.save}
      </button>
    </>
  );
};
