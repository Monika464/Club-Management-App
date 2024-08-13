
import { useFetchUsers } from "./useFetchUsers";

interface Iusers {
  value: string;
  label: string
}
export interface Iuser{
  surname: string;
  name: string;
  add: number | null;
  debt: number | null;
  dob: ITimeObj; 
  due: ITimeObj | null;
  pause: ITimeObj | null;
  stop: ITimeObj | null;
  start:ITimeObj; 
  restart: ITimeObj  | null;
  optionMulti: false;
  optionPass: false;
  avatar: URL | null;
  }

  export interface ITimeObj {
    seconds: number;
    nanoseconds: number;
    toMillis(): number | Date;
  }

export const useModUsersForSelect = () => {  
  const usersInfo = useFetchUsers();

//console.log("usersForSel",usersInfo)
  

     const temp: Iusers[] = [];   
    
      //usersInfo?.map((el: { dob: string | number | Date; name: string; surname: string; id: any; })=>{  
        usersInfo?.map((el)=>{    
      const today= new Date();
       // console.log("el", el)
        //console.log("el", el.dob.toDate())
       const todayUTimestamp = (today.getTime());
      // const elementDobUTimestamp = el.dob?.toDate().getTime();
      const elementDobUTimestamp: number = (el.dob).toMillis() as number;
     // console.log("elementDobUTimestamp ", elementDobUTimestamp )
     // console.log("el ", el )
      const diffTime: number = Math.abs(todayUTimestamp - elementDobUTimestamp);  
 
    const age = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));   
    const nameSurnameAge =  el.name + " "+ el.surname +" "+ age;  

    //return { value: el.id, label: nameSurnameAge}
    temp.push({ value: el.id, label: nameSurnameAge})    
    
    });
  

  

    return temp

}