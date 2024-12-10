import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/auth/UserContext";
import { db } from "../../App";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import DateFnsFormat from "../../utils/components/DateFnsFormat";
import { useLanguage } from "../../utils/context/LanguageContext.tsx";
import translations from "./archiveuserpayment-translations.ts";
export interface IArchiveUserPayment {}

export interface IPaymentItem {
  due: Date;
  id: string;
  time: Date;
  kto: string;
  prevadd: number;
  prevdebt: number;
}

const ArchiveUserPayment: React.FunctionComponent<IArchiveUserPayment> = () => {
  const { currentUser } = useContext(UserContext);
  const [paymentsArr, setPaymentsArr] = useState<IPaymentItem[]>([]);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const getArchivePayfromBase = useCallback(async () => {
    const getfromBase = async () => {
      if (currentUser) {
        const q = query(
          collection(db, "paymentArchive"),
          where("userUid", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          //console.log("querySnapshot",querySnapshot.docs)
          const temp = querySnapshot.docs
            .map((doc) => {
              console.log("payArch", doc.id, " => ", doc.data());

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
  }, [db, currentUser]);

  useEffect(() => {
    getArchivePayfromBase();
  }, [db, currentUser, getArchivePayfromBase]);

  // useEffect(() => {
  //   console.log("paymentsArr", paymentsArr);
  // }, [getArchivePayfromBase, paymentsArr]);

  return (
    <div>
      <p className="title">t.paymentHistory</p>
      <ol>
        {paymentsArr &&
          paymentsArr.map((elem) => (
            <li key={elem.id}>
              {/* płatność dnia: {elem.time.toDate().toString()} */}
              <div className="archive">
                <p>{t.paymentDate} </p>
                <p>
                  <DateFnsFormat element={elem.time} />
                </p>
                {/* <p>za: {elem.trenings} treningów</p> */}
                <p>{t.nextPaymentDue}</p>
                <p>
                  <DateFnsFormat element={elem.due} />
                </p>
                {elem.prevdebt && (
                  <div>
                    <p>
                      {" "}
                      {t.previousDebt}: {elem.prevdebt}{" "}
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

export default ArchiveUserPayment;
