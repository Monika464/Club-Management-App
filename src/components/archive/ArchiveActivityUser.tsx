import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/auth/UserContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../App";
import DateFnsFormat from "../DateFnsFormat";

export interface IArchiveActivityUser {}

export interface ItimestampArr1 {
  id: string;
  time: Date;
  pausaData: Date;
  reason: string;
}

export interface ItimestampArr2 {
  id: string;
  time: Date;
  endPauseData: Date;
}

export interface ItimestampArr3 {
  id: string;
  time: Date;
  stopData: Date;
}
export interface ItimestampArr4 {
  id: string;
  time: Date;
  restartData: Date;
}

export const ArchiveActivityUser: React.FunctionComponent<
  IArchiveActivityUser
> = () => {
  const [timestampArr1, setTimestampsArr1] = useState<ItimestampArr1[]>([]);
  const [timestampArr2, setTimestampsArr2] = useState<ItimestampArr2[]>([]);
  const [timestampArr3, setTimestampsArr3] = useState<ItimestampArr3[]>([]);
  const [timestampArr4, setTimestampsArr4] = useState<ItimestampArr4[]>([]);

  const { currentUser } = useContext(UserContext);

  const getArchiveDatafromBase = useCallback(async () => {
    const getfromBase1 = async () => {
      if (currentUser) {
        const q1 = query(
          collection(db, "activitiArchive"),
          where("userUid", "==", currentUser.uid),
          where("pausaData", ">", ""),
          where("pausaData", "<", null)
        );

        // const q1 = query(
        // collection(db, "activitiArchive"),
        // where("userUid", "==", currentUser.uid),
        // where("pausaData", "!=", null)
        //  );

        const unsubscribe = onSnapshot(q1, (querySnapshot) => {
          const temp1 = querySnapshot.docs
            .map((doc) => {
              if (doc.data().pausaData) {
                return {
                  id: doc.id,
                  time: doc.data().created_at,
                  pausaData: doc.data().pausaData,
                  reason: doc.data().reason,
                };
              }
              return null;
            })
            .filter((item) => item !== null) as ItimestampArr1[];
          // console.log("temp1",temp1)
          setTimestampsArr1([...temp1]);
        });

        return () => unsubscribe();
      }
    };

    const getfromBase2 = async () => {
      if (currentUser) {
        // Q2
        const q2 = query(
          collection(db, "activitiArchive"),
          where("userUid", "==", currentUser.uid),
          where("endPauseData", "!=", null)
        );

        const unsubscribe = onSnapshot(q2, (querySnapshot) => {
          const temp2 = querySnapshot.docs
            .map((doc) => {
              if (doc.data().endPauseData) {
                return {
                  id: doc.id,
                  time: doc.data().created_at,
                  endPauseData: doc.data().endPauseData,
                };
              }
              return null;
            })
            .filter((item) => item !== null) as ItimestampArr2[];
          //console.log("temp2",temp2)
          setTimestampsArr2([...temp2]);
          // console.log("timestampArr2",timestampArr2)
        });

        return () => unsubscribe();
      }
    };

    const getfromBase3 = async () => {
      if (currentUser) {
        // Q3
        const q3 = query(
          collection(db, "activitiArchive"),
          where("userUid", "==", currentUser.uid),
          where("stopData", "!=", null)
        );

        const unsubscribe = onSnapshot(q3, (querySnapshot) => {
          const temp3 = querySnapshot.docs
            .map((doc) => {
              // console.log("tu3", doc.id, " => ", doc.data());

              if (doc.data().stopData) {
                return {
                  id: doc.id,
                  time: doc.data().created_at,
                  stopData: doc.data().stopData,
                };
              }
              return null;
            })
            .filter((item) => item !== null) as ItimestampArr3[];
          //console.log("temp3",temp3)
          setTimestampsArr3([...temp3]);
          //console.log("timestampArr3",timestampArr3)
        });

        return () => unsubscribe();
      }
    };

    const getfromBase4 = async () => {
      if (currentUser) {
        // Q4
        const q4 = query(
          collection(db, "activitiArchive"),
          where("userUid", "==", currentUser.uid),
          where("restartData", "!=", null)
        );

        const unsubscribe = onSnapshot(q4, (querySnapshot) => {
          const temp4 = querySnapshot.docs
            .map((doc) => {
              //console.log("tu4", doc.id, " => ", doc.data());

              if (doc.data().restartData) {
                return {
                  id: doc.id,
                  time: doc.data().created_at,
                  restartData: doc.data().restartData,
                };
              }
              return null;
            })
            .filter((item) => item !== null) as ItimestampArr4[];

          setTimestampsArr4([...temp4]);
        });

        return () => unsubscribe();
      }
    };

    getfromBase1();
    getfromBase2();
    getfromBase3();
    getfromBase4();
  }, [db, currentUser]);

  useEffect(() => {
    getArchiveDatafromBase();
  }, [db, currentUser, getArchiveDatafromBase]);

  return (
    <>
      <br></br>
      <br></br>
      <p className="title">Historia aktywności</p>
      <ol>
        {timestampArr1 &&
          timestampArr1.map((elem) => (
            <li key={elem.id}>
              <div className="archive">
                <p>pauza zgłoszona dnia: </p>
                <p>
                  <DateFnsFormat element={elem.time} />
                </p>
                <p>
                  od: <DateFnsFormat element={elem.pausaData} />
                </p>
              </div>
            </li>
          ))}

        {timestampArr2 &&
          timestampArr2.map((elem) => (
            <li key={elem.id}>
              <div className="archive">
                <p>powrót po kontuzji zgłoszony dnia: </p>
                <p>
                  <DateFnsFormat element={elem.time} />
                </p>
                <p>
                  od: <DateFnsFormat element={elem.endPauseData} />
                </p>
              </div>
            </li>
          ))}

        {timestampArr3 &&
          timestampArr3.map((elem) => (
            <li key={elem.id}>
              <div className="archive">
                <p>stop zgłoszony dnia: </p>
                <p>
                  <DateFnsFormat element={elem.time} />
                </p>
                <p>
                  od: <DateFnsFormat element={elem.stopData} />
                </p>
              </div>
            </li>
          ))}

        {timestampArr4 &&
          timestampArr4.map((elem) => (
            <li key={elem.id}>
              <div className="archive">
                <p>powrót do klubu zgłoszony dnia: </p>
                <p>
                  <DateFnsFormat element={elem.time} />
                </p>
                <p>
                  od: <DateFnsFormat element={elem.restartData} />
                </p>
              </div>
            </li>
          ))}
      </ol>
    </>
  );
};

export default ArchiveActivityUser;
