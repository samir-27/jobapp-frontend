import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import { ToastContainer } from "react-toastify";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import AddJob from "./components/AddJob";
import PostedJobs from "./components/PostedJobs";
import Profile from "./pages/Profile";
import MyProfile from "./components/MyProfile";
import AppliedJobs from "./components/AppliedJobs";
import CandidateOffers from "./components/CandidateOffers";
import CompanyNavbar from "./components/CompanyNavbar";
import CompanyProfile from "./pages/CompnyProfile";
import CompanyMyProfile from "./components/CompanyMyProfile";
import Favorites from "./components/Favorites";
import CompanySignup from "./pages/CompanySignup";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Footer from "./components/Footer";

const ProtectedUserRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  return token && role === "user" ? children : <Navigate to="/signin" replace />;
};

const ProtectedCompanyRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  return token && role === "company" ? children : <Navigate to="/signin" replace />;
};

const App = () => {
  const location = useLocation();

  const isCompanyRoute = location.pathname.startsWith("/company");
  const isAuthPage = [
    "/signin",
    "/signup",
    "/company/signup",
    "/reset-password",
    "/verify-email",
  ].includes(location.pathname);

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Render Navbar based on context */}
      {!isAuthPage && !isCompanyRoute && <Navbar />}
      {!isAuthPage && isCompanyRoute && <CompanyNavbar />}

      <div className="min-h-[80vh]">
        <Routes>
          {/* Public & Authentication Routes */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Navigate to="/signin" replace />} />
          <Route path="/company/signup" element={<CompanySignup />} />

          {/* Public Browsing Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job-detail/:id" element={<JobDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/comp-detail/:id" element={<CompanyDetail />} />

          {/* Notification Deep-link Aliases */}
          <Route
            path="/applied-jobs"
            element={<Navigate to="/profile/appliedjobs" replace />}
          />
          <Route
            path="/interviews"
            element={<Navigate to="/profile/offers" replace />}
          />
          <Route
            path="/offers"
            element={<Navigate to="/profile/offers" replace />}
          />

          {/* Candidate Protected Routes */}
          <Route
            path="/favorites"
            element={
              <ProtectedUserRoute>
                <Favorites />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedUserRoute>
                <Profile />
              </ProtectedUserRoute>
            }
          >
            <Route index element={<MyProfile />} />
            <Route path="appliedjobs" element={<AppliedJobs />} />
            <Route path="offers" element={<CandidateOffers />} />
          </Route>

          {/* Employer Protected Routes */}
          <Route
            path="/company/home"
            element={<Navigate to="/company/postedjobs" replace />}
          />
          <Route
            path="/company/addjob"
            element={
              <ProtectedCompanyRoute>
                <AddJob />
              </ProtectedCompanyRoute>
            }
          />
          <Route
            path="/company/postedjobs"
            element={
              <ProtectedCompanyRoute>
                <PostedJobs />
              </ProtectedCompanyRoute>
            }
          />
          <Route
            path="/company/profile"
            element={
              <ProtectedCompanyRoute>
                <CompanyProfile />
              </ProtectedCompanyRoute>
            }
          >
            <Route index element={<CompanyMyProfile />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAuthPage && !isCompanyRoute && <Footer />}
    </>
  );
};

export default App;
