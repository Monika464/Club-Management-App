import { CollectionReference, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../App";
import { useCallback, useEffect, useState } from "react";
//import '..Avatar/'
import Avatar from "../Avatar";
import '../avatar.css';
import './adminPanelStatistics.css'

export interface ITimestampObject {

}

export interface IDataItem {
    name: string;
    surname: string;
    avatar: string;
    pause?: boolean;
    stop?: boolean;
  }

export const AdminPanelStatistics: React.FunctionComponent<IDataItem> =() => {
const [pausingUsers, setPausingUsers] = useState<IDataItem[]>([]);
const [stopingUsers, setStopingUsers] = useState<IDataItem[]>([]);
const [activeUsers, setActiveUsers] = useState<IDataItem[]>([])

const usersCollection: CollectionReference<any> = collection(db, "usersData");

const [rendered, setRendered] =   useState(false);

useEffect(() => {
    const timer = setTimeout(() => {
      setRendered(true);
    }, 1000); // 1000 milisekund = 1 sekunda
  
    return () => {
      clearTimeout(timer); // W przypadku odmontowania komponentu przed zakończeniem opóźnienia
    };
  }, []);

    const getUsersFromBase = useCallback(async () => {
      try {
        const unsub = onSnapshot(
          usersCollection,
          (snapshot) => {
            if (snapshot) {
              const pausingUsersArray: IDataItem[] = [];
              const stopingUsersArray: IDataItem[] = [];
              const activeUsersArray: IDataItem[] = [];

              snapshot.docs.forEach((doc) => {

                //console.log("doc", doc.data());

                if (doc.data().pause) {
                 // console.log(doc.data().name, "ma pauze");

                  pausingUsersArray.push({
                    name: doc.data().name,
                    surname: doc.data().surname,
                    avatar: doc.data().avatar,
                  });
                } else if (doc.data().stop) {
                  //console.log(doc.data().name, "ma stop")
                  
                  stopingUsersArray.push({
                    name: doc.data().name,
                    surname: doc.data().surname,
                    avatar: doc.data().avatar,
                  });
                } else {
                 // console.log(doc.data().name, "aktywny");

                  activeUsersArray.push({
                    name: doc.data().name,
                    surname: doc.data().surname,
                    avatar: doc.data().avatar,
                  });
                }
                setPausingUsers(pausingUsersArray); 
                setStopingUsers(stopingUsersArray);
                setActiveUsers(activeUsersArray)
              });

              // Aktualizuj stan tylko raz, po przetworzeniu wszystkich dokumentów 
             
            }
          },
          (error) => {
            console.error("Błąd podczas nasłuchiwania na zmiany:", error);
          }
        );

        return () => {
          // Odsubskrybuj, gdy komponent jest odmontowywany lub inaczej przerywany
          unsub();
        };
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
      }

    },[])
    
    useEffect(() => { 
    getUsersFromBase();
    // console.log("paisingd",pausingUsers)
    // console.log("stopingUsers",stopingUsers)
    // console.log("activeUsers",activeUsers)
  }, [rendered]);  

  return (
    <>

      <br />
      <br />
      <p className="title">Aktywni </p>
      <div className="active-members">
        {activeUsers &&
          activeUsers.map((el, index) => (
            <div className="active-member" key={index}>
              <p className="name">
                {el.name} {el.surname}
              </p>
              <Avatar src={el.avatar} />
            </div>
          ))}
      </div>
      <br />
      <br />
      <p className="title">Kontuzjowani</p>
      <div className="inactive-members">
        {pausingUsers &&
          pausingUsers.map((el, index) => (
            <div className="inactive-member" key={index}>
              <p className="name">
                {el.name} {el.surname}
              </p>
              <Avatar src={el.avatar} />
            </div>
          ))}
      </div>
      <br />
      <br />
      <p className="title">Zrezygnowali</p>
      <div className="inactive-members">
        {stopingUsers &&
          stopingUsers.map((el, index) => (
            <div className="inactive-member" key={index}>
              <p className="name">
                {el.name} {el.surname}
              </p>
              <Avatar src={el.avatar} />
            </div>
          ))}
      </div>
    </>
  );


    // return(<>Statystyki
      
    //             <br></br><br></br>
    //             Aktywni memberzy
    //             {activeUsers && activeUsers.map((el)=>(
    //               <>
    //             <p>{el.name} {el.surname}</p>
    //             {/* <img src={el.avatar}></img> */}
    //             <Avatar src={el.avatar}/>
    //              </>
                
    //             ))}
    //             <br></br><br></br>
    //             Kontuzjowani
    //             {pausingUsers && pausingUsers.map((el)=>(
    //             <>
    //               <p>{el.name} {el.surname}</p>              
    //               <Avatar src={el.avatar}/>
    //                 </>
    //             ))}
    //             <br></br><br></br>
    //             Zrezygnowali
    //             {pausingUsers && pausingUsers.map((el)=>(
    //              <>
    //              <p>{el.name} {el.surname}</p>
    //              <Avatar src={el.avatar}/>
    //                </>
    //            ))}
                
                
    //             </>)
}