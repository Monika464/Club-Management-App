
import './App.css'
import Userpanel from "./pages/Userpanel.tsx";
import Adminpanel from "./pages/Adminpanel.tsx";
import HomePage from "./pages/Home.tsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupPage from "./components/Signup.tsx";
import LoginPage from "./utils/auth/Login.tsx";
import { initializeApp } from 'firebase/app';
import { config } from './utils/config/config.ts';
import AuthRoute from './utils/auth/AuthRoute.tsx';
import AdminRoute from './utils/auth/AdminRoute.tsx';
import Navbar from './components/Navbar.tsx';
import { UserContextProvider } from './utils/auth/UserContext.tsx';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Signup2 from './components/newuserform/Signup2.tsx';
import Create from './pages/Create.tsx';
import { getStorage } from "firebase/storage";
import Membershipage from './pages/Membershippage.tsx';
import Injurypage from './pages/Injurypage.tsx';
import MembershiUserpage from './pages/MembershipUserpage.tsx';
import InjuryUserpage from './pages/InjuryUserpage.tsx';
import ProjectSingle from './components/project/ProjectSingle.tsx';
import DatePickerpages from './pages/DatePickerpage.tsx';
import Attendancepage from './pages/AttendanceListpage.tsx';
import ArchiveUserpage from './pages/ArchiveUserpage.tsx';
import ArchiveAdminpage from './pages/ArchiveAdminpage.tsx';
import PaymentAdminPage from './pages/PaymentAdminPage.tsx';
import UserMailbox from './pages/UserMailbox.tsx';
import AdminMailbox from './pages/AdminMailbox.tsx';
import { RaportUsersPage } from './pages/RaportUserspage.tsx';
import Instruction from './pages/Instruction.tsx';
import ForgotPass from './utils/auth/ForgotPass.tsx';


export const app = initializeApp(config.firebaseConfig)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();



export interface IApplicationProps { }

// Funkcja resetująca hasło i wysyłająca e-mail z linkiem resetującym



// const actionCodeSettings = {
//   //url: 'https://example.com/reset-password',
//   url: 'https://club-ts-407c6.web.app',
//   handleCodeInApp: true,
// };

const sendCustomPasswordResetEmail = (email: string) => {
  // Tutaj możesz umieścić własną logikę wysyłania e-maila resetującego, np. za pomocą usługi SMTP
  console.log(`Wysłano e-mail resetujący na adres: ${email}`);
  // W rzeczywistej aplikacji powinieneś użyć odpowiedniej usługi lub API do wysyłania e-maili
};

export const resetPassForEmail = (email: string) => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      return sendCustomPasswordResetEmail(email);
    })
    .then(() => { console.log("wyslano hasło na email") })
    .catch((error) => {
      console.error('Błąd podczas resetowania hasła:', error.message);
      // Tutaj możesz obsłużyć błędy związane z wysyłaniem e-maila resetującego
    });
};

const Application: React.FunctionComponent = () => {
  // const { currentUser} = useContext(UserContext);
  //const [isUser, setIsUser] = useContext(false)



  return (
    <div className='App'>
      <BrowserRouter>

        <div className='container'>

          <UserContextProvider>
            <Navbar />

            <Routes>

              <Route
                path="/"
                element={
                  <AuthRoute>
                    <HomePage />
                  </AuthRoute>
                }
              />

              <Route
                path="/home"
                element={
                  <HomePage />
                }
              />

              <Route
                path="/create"
                element={
                  <AdminRoute>
                    <Create />
                  </AdminRoute>
                }
              />

              <Route
                path="/membershipadmin"
                element={
                  <AdminRoute>
                    <Membershipage />
                  </AdminRoute>
                }
              />

              <Route
                path="/paymentadmin"
                element={
                  <AdminRoute>
                    <PaymentAdminPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/injuryadmin"
                element={
                  <AdminRoute>
                    <Injurypage />
                  </AdminRoute>
                }
              />

  
              <Route
                path="/usersreport"
                element={
                  <AdminRoute>
                    <RaportUsersPage />
                  </AdminRoute>
                }
              />


              <Route
                path="/datespicker"
                element={
                  <AdminRoute>
                    <DatePickerpages />
                  </AdminRoute>
                }
              />

              <Route
                path="/attendancelist"
                element={
                  <AdminRoute>
                    <Attendancepage />
                  </AdminRoute>
                }
              />


              <Route
                path="/archiveadmin"
                element={
                  <AdminRoute>
                    <ArchiveAdminpage />
                  </AdminRoute>
                }
              />



              <Route
                path="/membershipuser"
                element={
                  <AuthRoute>
                    <MembershiUserpage />
                  </AuthRoute>
                }
              />
              <Route
                path="/injuryuser"
                element={
                  <AuthRoute>
                    <InjuryUserpage />
                  </AuthRoute>
                }
              />


              <Route
                path="/archiveuser"
                element={
                  <AuthRoute>
                    <ArchiveUserpage />
                  </AuthRoute>
                }
              />

              <Route
                path="/mailboxuser"
                element={
                  <AuthRoute>
                    <UserMailbox />
                  </AuthRoute>
                }
              />

              <Route
                path="/mailboxadmin"
                element={
                  <AdminRoute>
                    <AdminMailbox />
                  </AdminRoute>
                }
              />
              <Route
                path="/instruction"
                element={
                  <AuthRoute>
                    <Instruction />
                  </AuthRoute>
                }
              />


              <Route
                path="/projects/:id"
                element={
                  <ProjectSingle />
                }
              />

              <Route
                path="adminpanel"
                element={
                  <AdminRoute>
                    <Adminpanel />
                  </AdminRoute>

                }
              />

              <Route path="userpanel" element={
                <AuthRoute>
                  <Userpanel />
                </AuthRoute>
              } />

              <Route path="forgotpass" element={
                <ForgotPass />
              } />


              <Route path="signup" element={<SignupPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup2" element={

                <Signup2 />


              } />

            </Routes>
          </UserContextProvider>
        </div>
      </BrowserRouter>

    </div>
  )
}

export default Application;


