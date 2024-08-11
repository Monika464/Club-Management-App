import Select from "react-select";
import { useModUsersForSelect } from "../../hooks/useModUsersForSelect ";
import { useCallback, useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../App";
import DateFnsFormat from "../DateFnsFormat";

export interface IArchiveAdminPayment {}
// export interface ItimestampArr {
//   created_at: Date;
//   kto: string;

//   userUid: string;
// }

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
      Wybrany uzytkownik: {chosenUserByIdLabel}
      <br></br>
      <br></br>
      <ol>
        {paymentsArr &&
          paymentsArr &&
          paymentsArr.map((elem: IPaymentItem) => (
            <li key={elem.id}>
              <div className="archive">
                <p>płatność dnia: </p>
                <p>
                  <DateFnsFormat element={elem.time} />
                </p>
                {/* <p>za: {elem.trenings} treningów</p> */}
                <p>Kolejna należność oczekiwana po tej płatności:</p>
                <p>
                  <DateFnsFormat element={elem.due} />
                </p>
                {elem.prevdebt && (
                  <div>
                    <p>zadłuzenie: {elem.prevdebt} </p>
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
