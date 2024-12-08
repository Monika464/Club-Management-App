import { useCallback, useEffect, useState } from "react";
import { useSearchDatesByIndex } from "../../utils/hooks/useSearchDatesByIndex";
import { useSearchDatesPlusN } from "../../utils/hooks/useSearchDatesPlusN";
import { useSearchIndexCloseToday } from "../../utils/hooks/useSearchIndexCloseToday";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../../App";
import { format } from "date-fns";
import { pl, enUS } from "date-fns/locale";
import translations from "./displaynexttrainings-translations.ts";
import { useLanguage } from "../../utils/context/LanguageContext.tsx";
import "./displayNextTrainings.css";

export interface IDisplayNextTrainings {
  userid: string | undefined;
}
export interface Inajblizszyindexwbaziedat {
  najblizszyindexwbaziedat: number;
}

export const DisplayNextTrainings: React.FunctionComponent<
  IDisplayNextTrainings
> = (props) => {
  const { currentLanguage } = useLanguage(); // Pobierz aktualny język
  const t = translations[currentLanguage as "en" | "pl"];

  const locale = currentLanguage === "pl" ? pl : enUS;
  const najblizszyindexwbaziedat = useSearchIndexCloseToday();

  const data0napodtsawieindex = useSearchDatesByIndex(
    najblizszyindexwbaziedat + 0
  );

  const data1napodtsawieindex = useSearchDatesByIndex(
    najblizszyindexwbaziedat + 1
  );

  const data2napodtsawieindex = useSearchDatesByIndex(
    najblizszyindexwbaziedat + 2
  );

  const data3napodtsawieindex = useSearchDatesByIndex(
    najblizszyindexwbaziedat + 3
  );

  const [isMulti, setIsMulti] = useState<boolean>(false);
  const [isPause, setIsPause] = useState<boolean>(false);
  const [isStop, setisStop] = useState<boolean>(false);
  const [rendered, setRendered] = useState(false);

  const indexnajblizszejnaleznejplatnosci = useSearchDatesPlusN(
    0,
    props.userid
  );

  //const nastPlat = useSearchDatesByIndex(indexnajblizszejnaleznejplatnosci)

  //console.log('nastPlat',nastPlat.toDate());
  useEffect(() => {
    const timer = setTimeout(() => {
      setRendered(true);
    }, 1000); // 1000 milisekund = 1 sekunda

    return () => {
      clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
    };
  }, []);

  const getUserDatafromBase = useCallback(async () => {
    if (props.userid) {
      const userRef = doc(db, "usersData", props.userid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        // console.log("usersdata displaynexttrainings", docSnap.data());
        //multi
        if (docSnap.data().optionMulti === true) {
          // console.log("optionMulti",docSnap.data().optionMulti === true)
          setIsMulti(true);
        }
        //pause
        if (docSnap.data().pause) {
          setIsPause(true);
        }
        //stop
        if (docSnap.data().stop) {
          setisStop(docSnap.data().stop);
        }
      }
    }
  }, [props.userid, rendered]);

  useEffect(() => {
    getUserDatafromBase();
    //console.log("current user", currentUser?.email, "multi",isMulti, isPause,"add",add)
    //console.log("debt", debt)
    //paymentDateIndex < dzisIndex ? console.log('zzzadłuzenie:' , dzisIndex -paymentDateIndex, 'treningi')
    // :console.log("nie ma zadluzenia")
  }, [getUserDatafromBase, props.userid, rendered]);

  const getColor = (index: number): string => {
    if (isMulti || isStop || isPause) {
      return "inherit";
    } else if (index >= indexnajblizszejnaleznejplatnosci) {
      return "red";
    } else {
      return "green";
    }
  };

  for (let i = 0; i < 4; i++) {
    if (najblizszyindexwbaziedat + i < indexnajblizszejnaleznejplatnosci) {
      //console.log("sa jeszcze do wykorzystania")
    }

    if (najblizszyindexwbaziedat + i > indexnajblizszejnaleznejplatnosci) {
      // console.log("istnieje zadluzenie")
    }
    if (najblizszyindexwbaziedat + i === indexnajblizszejnaleznejplatnosci) {
      // console.log("ptatnosc na nastepnym treningu")
    }
  }

  //console.log("data0napodtsawieindex",data0napodtsawieindex?.toDate())

  return (
    <>
      <p>{t.title}</p>
      <div className="trenings">
        {data0napodtsawieindex ? (
          <div
            className={`trening 0`}
            style={{ color: getColor(najblizszyindexwbaziedat + 0) }}
          >
            {/* {format(data0napodtsawieindex.toDate(), 'do MMM', { locale: pl })}    */}
            {format((data0napodtsawieindex as Timestamp).toDate(), "do MMM", {
              locale: pl,
            })}
          </div>
        ) : (
          <div
            className={`trening 0`}
            style={{ color: getColor(najblizszyindexwbaziedat + 0) }}
          >
            +1
          </div>
        )}
        {data1napodtsawieindex ? (
          <div
            className={`trening 1`}
            style={{ color: getColor(najblizszyindexwbaziedat + 1) }}
          >
            {/* {format(data1napodtsawieindex.toDate(), 'do MMM', { locale: pl })} */}
            {format((data1napodtsawieindex as Timestamp).toDate(), "do MMM", {
              locale: pl,
            })}
          </div>
        ) : (
          <div
            className={`trening 1`}
            style={{ color: getColor(najblizszyindexwbaziedat + 1) }}
          >
            +1
          </div>
        )}
        {data2napodtsawieindex ? (
          <div
            className={`trening 2`}
            style={{ color: getColor(najblizszyindexwbaziedat + 2) }}
          >
            {/* {format(data2napodtsawieindex.toDate(), 'do MMM', { locale: pl })} */}
            {format((data2napodtsawieindex as Timestamp).toDate(), "do MMM", {
              locale: pl,
            })}
          </div>
        ) : (
          <div
            className={`trening 2`}
            style={{ color: getColor(najblizszyindexwbaziedat + 2) }}
          >
            +1
          </div>
        )}
        {data3napodtsawieindex ? (
          <div
            className={`trening 3`}
            style={{ color: getColor(najblizszyindexwbaziedat + 3) }}
          >
            {/* {format(data3napodtsawieindex.toDate(), 'do MMM', { locale: pl })} */}
            {format((data3napodtsawieindex as Timestamp).toDate(), "do MMM", {
              locale: pl,
            })}
          </div>
        ) : (
          <div
            className={`trening 3`}
            style={{ color: getColor(najblizszyindexwbaziedat + 3) }}
          >
            +1
          </div>
        )}
      </div>
    </>
  );
};
