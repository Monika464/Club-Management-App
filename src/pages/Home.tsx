
import useFetchCollectionData from '../hooks/useFetchCollections.tsx';
import ProjectList from '../components/project/ProjectsList.tsx';
import ProjectSingle from '../components/project/ProjectSingle.tsx';


export interface IDocument {

    assignedUsers: IforSel | null;
    category: string ;
   comments: IComment[] | null;
    created_at: IDateObj;
    details: string | null;
    eventdate: IDateObj;
    name: string;
    photo: string;
    visibility: string;
    id: string;
  
  }
  export interface IAssignedUser{
    dob:IDateObj;
  name: string;
  surname: string;
  id: string;
  avatar:  string
    }
  export interface IProject{
    project: IDocument | null;
  }
  
  export interface IDateObj{
  seconds: number;
  nanoseconds: number;
  toMillis(): string | number;
  }
  
  export interface IComment{
    content: string;
    created_at: IDateObj;
    displayName: string;
    photoURL: string;
    id: string; 
    uid: string;
  }

  export interface IforSel{
    value: IAssignedUser;
    label: string
  }
  

    const HomePage: React.FunctionComponent =() => {

        const {dataFromCollection, error} = useFetchCollectionData("projects")
        //const {dataFromCollection: userData, error: userError} = useFetchCollectionData("usersData")
       
  //       useEffect(()=>{
    
  //  //console.log("dataFromCollection",dataFromCollection)
  //   },[dataFromCollection])
    
  

    return (
        <>
            <h2 className='page-title'>Wydarzenia klubowe</h2>
       {error && <p className='error'>{error}</p>}
       {dataFromCollection && <ProjectList projects={dataFromCollection}/>}

  <ProjectSingle/>

 

             {/* <p key={doc.uid}>
                 {doc.name}
                {doc.details}
               {(doc.eventdate).toDate().toString()} */}
                <br></br>
             
{/*
    {`${doc.eventdate.toDate().toLocaleDateString('pl-PL')}`}
    <br></br>
                <img src={doc.photo} style= {{width: 80 }} alt="photo" />

                 {doc.assignedUsers && doc.assignedUsers.map((user)=>(
                   <p key={user.id}>
                   <img src= {user.avatar} style= {{width: 20 }} alt="avatar" />
                   </p>                
                   </p>
                   ))} 
        */}


        </>
    );

}

{/* <div className="siteLink"> 
<ul>
  <li> <Link to="/userpanel" className="userpanel">userpanel</Link></li>
</ul>
</div> */}

export default HomePage;