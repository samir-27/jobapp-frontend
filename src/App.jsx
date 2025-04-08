import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import CompanyDashBoard from "./components/CompanyNavbar";
import AddJob from "./components/AddJob";
import PostedJobs from "./components/PostedJobs";
import Profile from "./pages/Profile";
import MyProfile from "./components/MyProfile";
import AppliedJobs from "./components/AppliedJobs";
import CompanyNavbar from "./components/CompanyNavbar";
import CompanyProfile from "./pages/CompnyProfile";
import CompanyMyProfile from "./components/CompanyMyProfile";
import Favorites from "./components/Favorites";
import CompanySignup from "./pages/CompanySignup";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Footer from "./components/Footer";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/signin" />;
};

const App = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, [location]);

  return (
    <>
  <ToastContainer position="top-center" />
  {/* Show Navbar only if the user is authenticated and not on sign-in or sign-up pages */}
  {isAuthenticated &&
    !["/signin", "/signup", "/company/signup"].includes(location.pathname) &&
    !location.pathname.startsWith("/company") && <Navbar />}
  
  {isAuthenticated &&
    location.pathname.startsWith("/company") &&
    location.pathname !== "/company/signup" && <CompanyNavbar />}

  <div>
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes (User must be authenticated) */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path="/job-detail/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
      <Route path="/comp-detail/:id" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}>
        <Route index element={<MyProfile />} />
        <Route path="appliedjobs" element={<AppliedJobs />} />
      </Route>

      {/* Protected Routes for Company Dashboard */}
      <Route path="/company/signup" element={<CompanySignup />} />
      <Route path="/company/addjob" element={<ProtectedRoute><AddJob /></ProtectedRoute>} />
      <Route path="/company/postedjobs" element={<ProtectedRoute><PostedJobs /></ProtectedRoute>} />
      <Route path="/company/profile" element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>}>
        <Route index element={<CompanyMyProfile />} />
      </Route>
    </Routes>
    {
          !["/signin", "/signup", "/company/signup"].includes(location.pathname) &&
          !location.pathname.startsWith("/company") && <Footer />
    }
    
  </div>
</>

  );
};

export default App;
