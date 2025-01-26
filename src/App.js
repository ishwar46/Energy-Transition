import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/MainHome/HomePage";
import Accomodation from "./pages/Accomodation/Accomodation";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./components/NotFound";
import LoginPage from "./pages/LoginPage/LoginPage";
import AdminLogin from "./pages/LoginPage/AdminLogin";
import AdminRoutes from "./PrivateRoutes/AdminRoutes";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import Registrations from "./pages/Registration/Registrations";
import ScrollToTop from "./ScrollToTop";
import EditUser from "./pages/adminDashboard/EditUser.jsx";
import ParticipantAttendance from "./pages/adminDashboard/Attendance.jsx";
import Queries from "./pages/queries/Queries.jsx";
import SessionDetails from "./pages/SessionDetails/SessionDetails.jsx";
import QuestionsForm from "./components/QuestionForm.jsx";
import LiveStreamPage from "./pages/LiveStream/LiveStream.jsx";

function App() {
  return (
    <Router>
      <Toaster position="bottom-left" reverseOrder={false} /> <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />{" "}
        {/* <Route path="/homepage" element={<HomePage />} />{" "}
        <Route path="/event" element={<Schedule />} />{" "}
        <Route path="/ceomessage" element={<CeoMessage />} />{" "}
        <Route path="/speakers" element={<Speakers />} />{" "}
        <Route path="/schedulenew" element={<Schedule />} />{" "}
        <Route path="/gallery" element={<GallerySection />} />{" "}
        <Route path="/chiefguest" element={<ChiefGuest />} />{" "}
        <Route path="/ourteam" element={<MeetOurTeam />} />{" "}
        <Route path="/introduction" element={<Introduction />} />{" "}
        <Route path="/aboutus" element={<AboutUs />} />{" "} */}
        <Route path="/register" element={<Registrations />} />{" "}
        <Route path="/login" element={<LoginPage />} />{" "}
        <Route path="/sessions" element={<SessionDetails />} />{" "}
        <Route path="/questions-form" element={<QuestionsForm />} />{" "}
        <Route path="/live-stream" element={<LiveStreamPage />} />{" "}
        <Route path="/accomodation" element={<Accomodation />} />{" "}
        {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} />{" "} */}
        <Route path="/ishwarrrrr" element={<Queries />} />{" "}
        {/* <Route path="/changepassword" element={<ChangePassword />} /> {""}{" "} */}

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
