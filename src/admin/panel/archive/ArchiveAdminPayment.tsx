import Select from "react-select";
import { useModUsersForSelect } from "../../../utils/hooks/useModUsersForSelect ";
import { useCallback, useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../App";
import DateFnsFormat from "../../../utils/components/DateFnsFormat";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./archiveadminpayment-translations";

export interface IArchiveAdminPayment {}

export interface IPaymentItem {
  id: string;
  time: Date;
  kto: string;
  due: Date;
  prevadd: number;
  prevdebt: number;
}

const ArchiveAdminPayment: React.FunctionComponent<
  IArchiveAdminPayment
> = () => {
  const userModForSelect = useModUsersForSelect();

  const [chosenUserId, setChosenUserId] = useState<string | null>(null);
  const [chosenUserByIdLabel, setChosenUserByIdLabel] = useState<string | null>(
    null
  );
  const [paymentsArr, setPaymentsArr] = useState<IPaymentItem[]>([]);
  const [rendered, setRendered] = useState(false);

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setRendered(true);
    }, 1000);

    return () => {
      clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
    };
  }, []);
  console.log(rendered);

  const getArchivePayfromBase = useCallback(async () => {
    const getfromBase = async () => {
      if (chosenUserId) {
        const q = query(
          collection(db, "paymentArchive"),
          where("userUid", "==", chosenUserId)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          //console.log("querySnapshot",querySnapshot.docs)
          const temp = querySnapshot.docs
            .map((doc) => {
              if (doc.data()) {
                return {
                  id: doc.id,
                  time: doc.data().created_at,
                  kto: doc.data().kto,
                  due: doc.data().due,
                  prevadd: doc.data().prevadd,
                  prevdebt: doc.data().prevdebt,
                } as IPaymentItem;
              }
              return null;
            })
            .filter((item) => item !== null) as IPaymentItem[];

          setPaymentsArr([...temp]);
        });

        return () => unsubscribe();
      }
    };
    getfromBase();
  }, [db, chosenUserId]);

  useEffect(() => {
    getArchivePayfromBase();
  }, [db, chosenUserId, getArchivePayfromBase]);

  useEffect(() => {
    //console.log("paymentsArr",paymentsArr )
  }, [getArchivePayfromBase, paymentsArr]);

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
      {t.chosenUser} {chosenUserByIdLabel}
      <br></br>
      <br></br>
      <ol>
        {paymentsArr &&
          paymentsArr &&
          paymentsArr.map((elem: IPaymentItem) => (
            <li key={elem.id}>
              <div className="archive">
                <p>{t.paymentDate} </p>
                <p>
                  <DateFnsFormat
                    element={elem.time}
                    locale={currentLanguage as "pl" | "en"}
                  />
                </p>
                {/* <p>za: {elem.trenings} treningów</p> */}
                <p>{t.nextPaymentDue}</p>
                <p>
                  <DateFnsFormat
                    element={elem.due}
                    locale={currentLanguage as "pl" | "en"}
                  />
                </p>
                {elem.prevdebt && (
                  <div>
                    <p>
                      {t.previousDebt} {elem.prevdebt}{" "}
                    </p>
                  </div>
                )}

                {elem.prevadd && (
                  <div>
                    <p>{elem.prevadd}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
};

export default ArchiveAdminPayment;
