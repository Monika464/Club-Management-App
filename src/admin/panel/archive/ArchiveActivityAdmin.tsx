import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../App";
import DateFnsFormat from "../../../utils/components/DateFnsFormat";
import { format } from "date-fns";
import { useModUsersForSelect } from "../../../utils/hooks/useModUsersForSelect ";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./archiveactivityadmin-translations";
export interface IArchiveActivityAdmin {}

interface ITimestampData {
  id: string;
  created_at: Date;
  kto: string;
  stopData?: Date;
  restartData?: Date;
  pausaData?: Date;
  returnData: Date;
  reason?: string;
}

const ArchiveActivityAdmin: React.FunctionComponent<
  IArchiveActivityAdmin
> = () => {
  const userModForSelect = useModUsersForSelect();
  const [chosenUserId, setChosenUserId] = useState<string | null>(null);
  const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string>("");
  const [timestampArr, setTimestampArr] = useState<ITimestampData[]>([]);
  const [rendered, setRendered] = useState(false);

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setRendered(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const getArchiveDataFromBase = useCallback(() => {
    if (chosenUserId) {
      const q = query(
        collection(db, "activitiArchive"),
        where("userUid", "==", chosenUserId)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const temp = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            created_at: data.created_at.toDate(),
            kto: data.kto,
            stopData: data.stopData?.toDate(),
            restartData: data.restartData?.toDate(),
            pausaData: data.pausaData?.toDate(),
            returnData: data.returnData?.toDate(),
            reason: data.reason || "",
          };
        });
        setTimestampArr(temp);
      });

      return () => unsubscribe();
    }
  }, [chosenUserId]);

  timestampArr.map((elem) => {
    //const formattedDate = format(new Date(), "yyyy-MM-dd");
    const formattedDate = format(elem.created_at, "yyyy-MM-dd");
    console.log(formattedDate);
  });

  useEffect(() => {
    getArchiveDataFromBase();
  }, [chosenUserId, getArchiveDataFromBase]);

  return (
    <div>
      <Select
        closeMenuOnSelect={true}
        options={userModForSelect}
        onChange={(choice) => {
          if (choice) {
            setChosenUserId(choice.value);
            setChosenUserByIdLabel(choice.label);
          }
        }}
      />
      <br></br>
      {!rendered && <div>loading ..</div>}
      {t.chosenUser} {chosenUserByIdLabel}
      <ol>
        {timestampArr.map((elem) => (
          <li key={elem.id}>
            <div className="archive">
              <p>
                {t.createdAt}{" "}
                <DateFnsFormat
                  element={elem.created_at}
                  locale={currentLanguage as "pl" | "en"}
                />
              </p>

              {elem.stopData && (
                <>
                  <p>{t.membershipSuspended}</p>
                  <p>
                    {t.from}{" "}
                    <DateFnsFormat
                      element={elem.stopData}
                      locale={currentLanguage as "pl" | "en"}
                    />
                  </p>
                </>
              )}

              {elem.restartData && (
                <>
                  <p>{t.clubReturnReported}</p>
                  <p>
                    {t.from}{" "}
                    <DateFnsFormat
                      element={elem.restartData}
                      locale={currentLanguage as "pl" | "en"}
                    />
                  </p>
                </>
              )}

              {elem.pausaData && (
                <>
                  <p>{t.pauseReported}</p>
                  <p>
                    {t.from}{" "}
                    <DateFnsFormat
                      element={elem.returnData}
                      locale={currentLanguage as "pl" | "en"}
                    />
                  </p>
                  {elem.reason && (
                    <p>
                      {t.reason} {elem.reason}
                    </p>
                  )}
                </>
              )}

              {elem.returnData && (
                <>
                  <p>{t.returnReported}</p>
                  <p>
                    Od:{" "}
                    <DateFnsFormat
                      element={elem.returnData}
                      locale={currentLanguage as "pl" | "en"}
                    />
                  </p>
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ArchiveActivityAdmin;
