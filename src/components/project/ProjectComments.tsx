import { useContext, useState } from "react";
import { UserContext } from '../../context/UserContext';
import { Timestamp, doc,  updateDoc} from "firebase/firestore";
import { db } from "../../App";
import Avatar from "../Avatar";
import { format } from "date-fns";
import dot from '../../assets/elements/dot.svg'

export interface IDocument {
  toMillis(): string | number | Date;
  assignedUsers: IforSel[] | null;
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

export interface IDateObj{
  toMillis(): string | number;
  seconds: number;
  nanoseconds: number;
}
interface ProjectCommentsProps {
  project: IDocument | null;
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

  const ProjectComments: React.FunctionComponent<ProjectCommentsProps> =(props) => {
    
    const { currentUser} = useContext(UserContext);
    const [newComment, setNewComment] = useState('')

    //console.log('props',props)

const handleSubmit =async(e: { preventDefault: () => void; })=>{
    e.preventDefault()

  
     const commentToAdd = {
        displayName: currentUser?.displayName,
        photoURL: currentUser?.photoURL,
        content: newComment,
        created_at: Timestamp.fromDate(new Date),
        id: Math.random(),
        uid: currentUser?.uid
       }

  
   // console.log("proooops",props?.project?.comments[0])

    

           const updateComment = async(id: string)=>{

            if(props.project && props.project.comments){
                       const userRef = doc(db, "projects",id);
                          await updateDoc(userRef, {
                           comments: [...props.project.comments, commentToAdd]
                          })
                       .then(()=>{console.log("komentarz zapisany")})
                }                    
           } 

           if(props?.project?.id){
            updateComment(props.project.id)
           }
           

   
}

const deleteComment =async(projid: string, comid: string)=>{
  if (props.project && props.project.comments) {
    const filteredComments = props.project.comments.filter((comment) => comment.id.toString() !== comid );
   
//console.log('filteredComments',filteredComments)
    const userRef = doc(db, 'projects',projid);
    await updateDoc(userRef, {
      comments: filteredComments,
    });
    console.log('Komentarz usunięty');
  }
};

const handleClickDot =(e: any)=>{

  const closestComment = e.target.closest('.comment-author');
  if (closestComment) {
    const comId = closestComment.getAttribute('data-comment-id');
    console.log("Comment ID:", comId);
    if(props.project){
      deleteComment(props.project.id, comId);
    }
    
  }
}





// (props.project.comments).map((com)=>{
//   console.log(com.id, "comid")
// })

return(
<div>

<div className="comments-container">
    <div className="project-comments">
      
    {props.project?.comments  && <h4>Komentarze</h4>}
     <ul>
    {props.project?.comments &&  props.project?.comments?.length>0 && props.project.comments.map((com)=>(
      <li key={com.id}>
         <p className="comment-date">{`${format(new Date(com.created_at?.toMillis()), 'yyyy-MM-dd HH:mm')}`}</p>
        <div className="comment-author" data-comment-id={com.id}>
          {com.uid && (com.uid === currentUser?.uid) && <img src={dot} width="20px" onClick={handleClickDot}></img>}
         
          <Avatar src={com.photoURL}/>

            <p className="comment-content">{com.displayName}</p>
            </div>
           
        

 
        <div className="comment-content">
        <p>{com.content}</p>
        </div>
        <br></br>
      

      </li>
   
     ))}
</ul>

   </div>


{props.project && <div>
  <div className="add-comment-container">
{/* <h4>Project comments</h4> */}
<form className="add-comment" onSubmit={handleSubmit}>
  <label>
<span>Skomentuj</span>
<textarea
required
onChange={(e)=>setNewComment(e.target.value)}
value={newComment}
></textarea>
  </label>
  <button className="btn">Send</button>

</form> 
</div>
</div>}
</div>
</div>)
}

export default ProjectComments;