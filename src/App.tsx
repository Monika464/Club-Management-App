import "./App.css";
import Userpanel from "./user/panel/Userpanel.tsx";
import Adminpanel from "./admin/panel/displaydetails/Adminpanel.tsx";
import HomeEventPage from "./admin/panel/project/HomeEventPage.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./admin/panel/formnewuser/Signup.tsx";
import LoginPage from "./utils/auth/Login.tsx";
import { initializeApp } from "firebase/app";
import { config } from "./utils/auth/config/config.ts";
import AuthRoute from "./utils/auth/AuthRoute.tsx";
import AdminRoute from "./utils/auth/AdminRoute.tsx";
import Navbar from "./utils/components/Navbar.tsx";
import { UserContextProvider } from "./utils/auth/UserContext.tsx";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Signup2 from "./admin/panel/formnewuser/Signup2.tsx";
import Create from "./admin/panel/project/Create.tsx";
import { getStorage } from "firebase/storage";
import Membershipage from "./admin/panel/activity/Membershippage.tsx";
import Injurypage from "./admin/panel/activity/Injurypage.tsx";
import MembershiUserpage from "./user/activity/MembershipUserpage.tsx";
import InjuryUserpage from "./user/activity/InjuryUserpage.tsx";
import ProjectSingle from "./admin/panel/project/ProjectSingle.tsx";
import DatePickerpages from "./admin/panel/classes/DatePickerpage.tsx";
import Attendancepage from "./admin/panel/attendancelist/AttendanceListpage.tsx";
import ArchiveUserpage from "./user/archive/ArchiveUserpage.tsx";
import ArchiveAdminpage from "./admin/panel/archive/ArchiveAdminpage.tsx";
import PaymentAdminPage from "./admin/panel/payments/PaymentAdminPage.tsx";
import UserMailbox from "./user/mail/UserMailbox.tsx";
import AdminMailbox from "./admin/mail/AdminMailbox.tsx";
import { RaportUsersPage } from "./admin/panel/displaydetails/RaportUserspage.tsx";
import Instruction from "./utils/components/Instruction.tsx";
import ForgotPass from "./utils/auth/ForgotPass.tsx";

export const app = initializeApp(config.firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();

export interface IApplicationProps {}

// Funkcja resetująca hasło i wysyłająca e-mail z linkiem resetującym

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
    .then(() => {
      console.log("wyslano hasło na email");
    })
    .catch((error) => {
      console.error("Błąd podczas resetowania hasła:", error.message);
      // Tutaj możesz obsłużyć błędy związane z wysyłaniem e-maila resetującego
    });
};

const Application: React.FunctionComponent = () => {
  // const { currentUser} = useContext(UserContext);
  //const [isUser, setIsUser] = useContext(false)

  return (
    <div className="App">
      <BrowserRouter>
        <div className="container">
          <UserContextProvider>
            <Navbar />

            <Routes>
              <Route
                path="/"
                element={
                  <AuthRoute>
                    <HomeEventPage />
                  </AuthRoute>
                }
              />

              <Route path="/home" element={<HomeEventPage />} />

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

              <Route path="/projects/:id" element={<ProjectSingle />} />

              <Route
                path="adminpanel"
                element={
                  <AdminRoute>
                    <Adminpanel />
                  </AdminRoute>
                }
              />

              <Route
                path="userpanel"
                element={
                  <AuthRoute>
                    <Userpanel />
                  </AuthRoute>
                }
              />

              <Route path="forgotpass" element={<ForgotPass />} />

              <Route path="signup" element={<SignupPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup2" element={<Signup2 />} />
            </Routes>
          </UserContextProvider>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Application;
