// export interface IAdminRole{}
// //import  functions from "firebase-functions";
// import admin from "firebase-admin"; 
// admin.initializeApp();
// //functoions sa platne


// //export const AdminRole : React.FunctionComponent<IAdminRole> =(props) => {

//     exports.addAdminRole = functions.http.onCall((data,context) =>{
//   return admin.auth().getUserByEmail(data.email)
//   .then(user =>{
//      return admin.auth().setCustomUserClaims(user.uid, {
//       admin: true
//      });
//     })
//   })
//   .then(()=>{
//     return{
//         message: `success! ${data.email}has been made an admin`
//     }
//   })
// .catch(err =>{
//     return err
// })



// //console.log("admin",admin)

// //return (<>uu</>)}