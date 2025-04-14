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

const ProtectedUserRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  return token && role === "user" ? children : <Navigate to="/signin" />;
};

const ProtectedCompanyRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  return token && role === "company" ? children : <Navigate to="/company/signup" />;
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
      <Route path="/" element={<ProtectedUserRoute><Home /></ProtectedUserRoute>} />
<Route path="/jobs" element={<ProtectedUserRoute><Jobs /></ProtectedUserRoute>} />
<Route path="/job-detail/:id" element={<ProtectedUserRoute><JobDetail /></ProtectedUserRoute>} />
<Route path="/about" element={<ProtectedUserRoute><About /></ProtectedUserRoute>} />
<Route path="/contact" element={<ProtectedUserRoute><Contact /></ProtectedUserRoute>} />
<Route path="/companies" element={<ProtectedUserRoute><Companies /></ProtectedUserRoute>} />
<Route path="/comp-detail/:id" element={<ProtectedUserRoute><CompanyDetail /></ProtectedUserRoute>} />
<Route path="/favorites" element={<ProtectedUserRoute><Favorites /></ProtectedUserRoute>} />

<Route path="/profile" element={<ProtectedUserRoute><Profile /></ProtectedUserRoute>}>
  <Route index element={<MyProfile />} />
  <Route path="appliedjobs" element={<AppliedJobs />} />
</Route>

<Route path="/company/signup" element={<CompanySignup />} />

<Route path="/company/addjob" element={<ProtectedCompanyRoute><AddJob /></ProtectedCompanyRoute>} />
<Route path="/company/postedjobs" element={<ProtectedCompanyRoute><PostedJobs /></ProtectedCompanyRoute>} />
<Route path="/company/profile" element={<ProtectedCompanyRoute><CompanyProfile /></ProtectedCompanyRoute>}>
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
