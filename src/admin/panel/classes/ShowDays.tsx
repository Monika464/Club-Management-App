import React from "react";
import { useEffect, useState } from "react";
import { IDateObject, useFetchDates } from "../../../utils/hooks/useFetchDates";
import { format } from "date-fns";
import { pl, enUS } from "date-fns/locale";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./showdays-translations";
import Trisc from "../../../assets/triskelion.png";

export interface IShowdaysProps {}

export const ShowDays: React.FunctionComponent<IShowdaysProps> = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const data = useFetchDates();

  const [duplicates, setDuplicates] = useState<IDateObject[] | null>(null);
  const [isShowAllDays, setIsShowAllDays] = useState(false);

  const manageShowAllDaysButton = () => {
    setIsShowAllDays(!isShowAllDays);
  };

  const dateMap: { [key: string]: IDateObject[] } = {};

  data?.forEach((elem) => {
    const monthYearKey = `${new Date(elem.toMillis()).getMonth()}-${new Date(
      elem.toMillis()
    ).getFullYear()}`;
    if (!dateMap[monthYearKey]) {
      dateMap[monthYearKey] = [];
    }
    dateMap[monthYearKey].push(elem);
  });

  useEffect(() => {
    const duplicates: IDateObject[] = [];

    data?.forEach((elem, indexA) => {
      const timestampA = elem.toMillis();

      for (let i = indexA + 1; i < data.length; i++) {
        const timestampB = data[i].toMillis();

        if (timestampA === timestampB) {
          duplicates.push(elem);
        }
      }
    });

    setDuplicates(duplicates);
  }, [data]);

  const locale = currentLanguage === "pl" ? pl : enUS;

  return (
    <>
      {isShowAllDays && (
        <div>
          <div className="datelist">
            {Object.keys(dateMap).map((monthYearKey) => (
              <div key={monthYearKey}>
                <h5>
                  <img
                    src={Trisc}
                    alt="Trisc"
                    style={{
                      marginRight: "5px",
                      marginLeft: "5px",
                      height: "15px",
                    }}
                  />
                  {format(dateMap[monthYearKey][0].toMillis(), "MMM yyyy", {
                    locale,
                  })}
                </h5>

                {dateMap[monthYearKey].map((elem, index) => (
                  <p key={index}>
                    {`${format(elem.toMillis(), "d", { locale })} ${format(
                      elem.toMillis(),
                      "EEE",
                      { locale }
                    )}`}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={manageShowAllDaysButton} className="btnsmall">
        {isShowAllDays ? t.close : t.showDates}
      </button>

      {duplicates &&
        duplicates.map((dup, index) => (
          <p key={index} style={{ color: "red" }}>
            {`${t.duplicate}: ${format(dup?.toMillis(), "PPP", { locale })}`}
          </p>
        ))}
    </>
  );
};

export default ShowDays;

// import { useEffect, useState } from "react";
// import { IDateObject, useFetchDates } from "../../../utils/hooks/useFetchDates";
// import { pl } from "date-fns/locale";
// import { format } from "date-fns";
// import Trisc from "../../../assets/triskelion.png";

// export interface IShowdaysProps {}

// export const ShowDays: React.FunctionComponent<IShowdaysProps> = () => {
//   const data = useFetchDates();

//   const [duplicates, setDuplicates] = useState<IDateObject[] | null>();

//   const [isShowAllDays, setIsShowAllDays] = useState(false);

//   const manageShowAllDaysButton = () => {
//     setIsShowAllDays(!isShowAllDays);
//   };

//   const dateMap: { [key: string]: IDateObject[] } = {};

//   data?.forEach((elem) => {
//     const monthYearKey = `${new Date(elem.toMillis()).getMonth()}-${new Date(
//       elem.toMillis()
//     ).getFullYear()}`;
//     if (!dateMap[monthYearKey]) {
//       dateMap[monthYearKey] = [];
//     }
//     dateMap[monthYearKey].push(elem);
//     //console.log("milielems",(new Date(elem.toMillis()) ).getMonth())
//   });

//   useEffect(() => {
//     const duplicates: IDateObject[] = [];

//     data?.forEach((elem, indexA) => {
//       // const timestampA = elem.toDate().getTime();
//       const timestampA = elem.toMillis();

//       for (let i = indexA + 1; i < data.length; i++) {
//         const timestampB = data[i].toMillis();

//         if (timestampA === timestampB) {
//           duplicates.push(elem);
//         }
//       }
//     });

//     setDuplicates(duplicates);

//     //console.log("cow duplicates",duplicates)
//   }, [data]);

//   return (
//     <>
//       {isShowAllDays && (
//         <div>
//           <div className="datelist">
//             {Object.keys(dateMap).map((monthYearKey) => (
//               <div key={monthYearKey}>
//                 <h5>
//                   {/* Display the month and year as the section header */}
//                   <img
//                     src={Trisc}
//                     alt="Trisc"
//                     style={{
//                       marginRight: "5px",
//                       marginLeft: "5px",
//                       height: "15px",
//                     }}
//                   />
//                   {format(dateMap[monthYearKey][0].toMillis(), "MMM yyyy", {
//                     locale: pl,
//                   })}
//                 </h5>

//                 {dateMap[monthYearKey].map((elem, index) => (
//                   <p key={index}>
//                     {/* Display the day of the month and short weekday */}
//                     {`${format(elem.toMillis(), "d", {
//                       locale: pl,
//                     })} ${format(elem.toMillis(), "EEE", { locale: pl })}`}
//                   </p>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <button onClick={manageShowAllDaysButton} className="btnsmall">
//         {isShowAllDays ? "Zamknij" : "Wyświetl daty"}
//       </button>

//       {duplicates &&
//         duplicates.map((dup, index) => (
//           <p key={index} style={{ color: "red" }}>
//             Duplikat: {format(dup?.toMillis(), "PPP", { locale: pl })}
//           </p>
//         ))}
//     </>
//   );
// };
