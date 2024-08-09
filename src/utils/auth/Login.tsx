
import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import './Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';


import { auth } from "../../App";
import { useIsAdmin } from './useIsAdmin';
import { UserContext } from './UserContext';


export interface IApplicationProps { };


const LoginPage: React.FunctionComponent<IApplicationProps> = () => {
  const { currentUser } = useContext(UserContext);

  //console.log('currentUser',currentUser)
  const isAdmin = useIsAdmin(currentUser?.uid);
  console.log("czy jest admin?", isAdmin)

  //const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);

  const defaultFormFields = {
    email: '',
    password: '',
  }

  const [formFields, setFormFields] = useState(defaultFormFields)
  const { email, password } = formFields


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormFields({ ...formFields, [name]: value })
    //console.log("formFields",formFields);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()


    // Send the email and password to firebase
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log("res user uid", res.user.uid)
        useIsAdmin(res.user.uid) ? navigate('/adminpanel') : navigate('/userpanel')
        setAuthing(true)
      })
      .catch(error => {
        console.log(error);
        setAuthing(false);

      })


  };
  // const resetFormFields = () => {
  //   return (
  //     setFormFields(defaultFormFields)
  //   );
  // }




  return (


    <div id="main" className="login-form">
      <div className='title'>Login</div>

      <div id="fields">
        <br />
      </div>


      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <input
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        {/*<input id='recaptcha' type="submit" />*/}
        <br />
        <button className="btn" disabled={authing} >Zaloguj </button>
      </form>

      {/* <ForgotPass/> */}
      <Link to={'/forgotpass'} style={{ fontSize: 'small' }}>Nie pamiętam hasła</Link>


    </div>
  )
}

export default LoginPage;




