// import { useState } from "react";
// import Switch from "react-switch";

// export interface Itest{}

// export const SwitchButtonTest : React.FunctionComponent<Itest> =(props) => { 

//     const [checked, setChecked] = useState(false);
//     const [checked2, setChecked2] = useState(false);
//     const handleChange = (nextChecked: boolean | ((prevState: boolean) => boolean)) => {
//       setChecked(nextChecked);
//     }

//     const handleChange2 = (nextChecked: boolean | ((prevState: boolean) => boolean)) => {
//         setChecked2(nextChecked);
//       }
//       const handleSubmit =()=>{}

// //https://react-switch.netlify.app/
//     return(
//         <div className="example">
//       <h2>Test switch</h2>
//       <label>
//         <span>Switch with default style</span>
//         <Switch
//           onChange={handleChange}
//           checked={checked}
//           className="react-switch"
//           id="user-id"
//         />
//         <br></br>
         
//       <button onClick={handleSubmit}>Submit</button>
//       <p>
//         The switch is <span>{checked ? "on" : "off"}</span>
//       </p>
//       </label>
     

//       <Switch
//            className="react-switch"
//           onChange={handleChange2}
//           checked={checked2}
       
//         />

// <p>
//         The switch is <span>{checked2 ? "on" : "off"}</span>.
//       </p>



//     </div>)


  
//     }

// export default SwitchButtonTest