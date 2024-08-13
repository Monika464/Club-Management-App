import { useFetchUsers } from "./useFetchUsers";

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
  avatar: string | null
  id: string;
  }

export interface ITimeObj {
  toMillis(): number | string; 
  seconds: number;
  nanoseconds: number;
}


export interface IforSel {
  value: IUsersDatS;
  label: string
}

export interface IUsersDatS{
  dob:ITimeObj;
  name: string;
  surname: string;
  id: string;
  avatar: string;
  
}
export const useModAvatUsers = ():IforSel[] => {  

  const usersInfo = useFetchUsers();
//console.log("usersInfo",usersInfo[1])

  

     const temp: IforSel[] = [];   
    
      usersInfo?.map((el)=>{  
        const today= new Date();
        //console.log("el", el)
        //console.log("el", el.dob.toDate())
       const todayUTimestamp = (today.getTime());
       //const elementDobUTimestamp = el.dob?.toDate().getTime();
      // const elementDobUTimestamp = el.dob?.toDate().getTime();
      const elementDobUTimestamp: number = el.dob?.toMillis() as number;
      //console.log("timestamp urodzenia", el.dob?.toDate().getTime(),"timastamp dzis",todayUTimestamp)
      const diffTime: number = Math.abs(todayUTimestamp - elementDobUTimestamp);  
    const age = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));   
    const nameSurnameAge =  el.name + " "+ el.surname +" "+ age;  

    const transformedObject: IforSel = {
        value: {
          dob: el.dob,
          name: el.name,
          surname: el.surname,
          id: el.id,
          avatar: el.avatar || "", // Assuming avatar can be a string or null
        },
        label: nameSurnameAge,
      };
  
      temp.push(transformedObject);


    //return { value: el.id, label: nameSurnameAge}
    //temp.push({ value: el, label: nameSurnameAge})    
    
    });
  

  

    return temp

}