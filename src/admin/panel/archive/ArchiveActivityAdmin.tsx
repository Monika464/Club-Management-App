import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../App";
import DateFnsFormat from "../../../utils/components/DateFnsFormat";
import { format } from "date-fns";
import { useModUsersForSelect } from "../../../utils/hooks/useModUsersForSelect ";

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
  //dodaje dns

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
      Wybrany użytkownik: {chosenUserByIdLabel}
      <ol>
        {timestampArr.map((elem) => (
          <li key={elem.id}>
            <div className="archive">
              {/* <p>Zgłoszenie przez: {elem.kto}</p> */}
              {/* Data utworzenia: {format(elem.created_at, "yyyy-MM-dd")} */}
              <p>
                Data utworzenia: <DateFnsFormat element={elem.created_at} />
              </p>

              {elem.stopData && (
                <>
                  <p>Zawieszenie członkowstwa dnia:</p>
                  <p>
                    Od: <DateFnsFormat element={elem.stopData} />
                  </p>
                </>
              )}

              {elem.restartData && (
                <>
                  <p>Powrót do klubu zgłoszony dnia:</p>
                  <p>
                    Od: <DateFnsFormat element={elem.restartData} />
                  </p>
                </>
              )}

              {elem.pausaData && (
                <>
                  <p>Pauza zgłoszona dnia:</p>
                  <p>
                    Od: <DateFnsFormat element={elem.returnData} />
                  </p>
                  {elem.reason && <p>Powód: {elem.reason}</p>}
                </>
              )}

              {elem.returnData && (
                <>
                  <p>Powrót po kontuzji zgłoszony dnia:</p>
                  <p>
                    Od: <DateFnsFormat element={elem.returnData} />
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
