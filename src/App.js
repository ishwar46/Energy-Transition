import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CeoMessage from "./pages/CEOMessage/CeoMessage";
import HomePage from "./pages/MainHome/HomePage";
import Accomodation from "./pages/Accomodation/Accomodation";
import Speakers from "./components/Spakers";
import Schedule from "./pages/Schedule/Schedule";
import GallerySection from "./pages/Gallery/GalleyPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./components/NotFound";
import LoginPage from "./pages/LoginPage/LoginPage";
import AdminLogin from "./pages/LoginPage/AdminLogin";
import AdminRoutes from "./PrivateRoutes/AdminRoutes";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import Registrations from "./pages/Registration/Registrations";
import ScrollToTop from "./ScrollToTop";
import UserRoutes from "./PrivateRoutes/UserRoutes";
import UserDashboardPage from "./pages/UserDashboard/UserDashboardPage";
import EditUser from "./pages/adminDashboard/EditUser.jsx";
import ChangePassword from "./pages/Changepassword/ChangePassword.jsx";
import ParticipantAttendance from "./pages/adminDashboard/Attendance.jsx";
import UnderMaintenance from "./pages/UnderMaintainance/UnderMaintainance.jsx";
import Notifications from "./pages/Notification/NotificationsPage.jsx";
import Introduction from "./pages/Introduction/Introduction.jsx";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
import MeetOurTeam from "./pages/OurTeam/OurTeam.jsx";
import ChiefGuest from "./pages/ChiefGuest/ChiefGuest.jsx";
import Queries from "./pages/queries/Queries.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivcyPolicyPage.jsx";

function App() {
  return (
    <Router>
      <Toaster position="bottom-left" reverseOrder={false} /> <ScrollToTop />
      <Routes>
        <Route path="/" element={<Registrations />} />{" "}
        {/* <Route path="/homepage" element={<HomePage />} />{" "}
        <Route path="/event" element={<Schedule />} />{" "}
        <Route path="/ceomessage" element={<CeoMessage />} />{" "}
        <Route path="/accomodation" element={<Accomodation />} />{" "}
        <Route path="/speakers" element={<Speakers />} />{" "}
        <Route path="/schedulenew" element={<Schedule />} />{" "}
        <Route path="/gallery" element={<GallerySection />} />{" "}
        <Route path="/chiefguest" element={<ChiefGuest />} />{" "}
        <Route path="/ourteam" element={<MeetOurTeam />} />{" "}
        <Route path="/introduction" element={<Introduction />} />{" "}
        <Route path="/aboutus" element={<AboutUs />} />{" "} */}
        <Route path="/register" element={<Registrations />} />{" "}
        <Route path="/login" element={<LoginPage />} />{" "}
        {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} />{" "}
        <Route path="/ishwarrrrr" element={<Queries />} />{" "}
        <Route path="/changepassword" element={<ChangePassword />} /> {""}{" "} */}

        {/* {""} <Route path="/maintenance" element={<UnderMaintenance />} /> {""}{" "}
        <Route path="/notifications" element={<Notifications />} /> {""}{" "} */}

        <Route path="/admin" element={<AdminLogin />} />{" "}
        {/* Admin Protected Routes */}{" "}
        <Route element={<AdminRoutes />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />{" "}
        </Route>{" "}
        <Route element={<AdminRoutes />}>
          <Route path="/edituser/:userId" element={<EditUser />} />{" "}
        </Route>{" "}
        <Route element={<AdminRoutes />}>
          <Route path="/attendance" element={<ParticipantAttendance />} />{" "}
        </Route>{" "}
        {/* User Protected Route */}{" "}
        {/* <Route element={<UserRoutes />}>
          <Route path="/userdashboard" element={<UserDashboardPage />} />{" "}
        </Route>{" "} */}
        {/* Catch-all for 404 Not Found */}{" "}
        <Route path="*" element={<NotFoundPage />} />{" "}
      </Routes>{" "}
    </Router>
  );
}

export default App;
