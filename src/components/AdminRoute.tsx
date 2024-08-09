import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export interface IAdminRouteProps {
   children: ReactNode
};
//zrob nowy authcontext z currentuser https://codingpr.com/react-firebase-auth-tutorial/

const AdminRoute: React.FunctionComponent<IAdminRouteProps> =(props) => {
     const {children} = props;
     const auth = getAuth();
     const navigate = useNavigate();
     const [loading, setLoading] = useState(false);

     useEffect(()=>{
        
     const AuthCheckAdmin = onAuthStateChanged (auth, (user)=>{
         if(user?.uid === "Y19J2pywqfd2YKN3zVVGlzYEWR82" || user?.uid === "QQnLoM9alXNiJDcO5NYioj5YrE32"){
            setLoading(false)
            console.log("jest admin",user.displayName, user.email);
            navigate('/adminpanel');
                       
         } else {
            console.log("admin unauthorized");
            navigate('/login')
         }

     });

     return () => AuthCheckAdmin();

    },[auth]); 

  
    if (loading) return <p>loading...</p>

    return <>{children}</>
};

export default AdminRoute;