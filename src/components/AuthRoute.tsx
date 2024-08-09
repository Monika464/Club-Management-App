import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export interface IAuthRouteProps {
   children: ReactNode
};
//zrob nowy authcontext z currentuser https://codingpr.com/react-firebase-auth-tutorial/

const AuthRoute: React.FunctionComponent<IAuthRouteProps> =(props) => {
     const {children} = props;
     const auth = getAuth();
     const navigate = useNavigate();
     const [loading, setLoading] = useState(false);

     useEffect(()=>{
        
     const AuthCheck = onAuthStateChanged (auth, (user)=>{
         if(user){
            setLoading(false)
            //console.log("jest user",user.displayName, user.email, user.uid);
            navigate('/userpanel');
                       
         } else {
            console.log("unauthorized");
            navigate('/login')
         }

     });

     return () => AuthCheck();

    },[auth]); 

  
    if (loading) return <p>loading...</p>

    return <>{children}</>
};

export default AuthRoute;