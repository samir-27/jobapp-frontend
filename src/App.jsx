import { Routes, Route, useLocation } from "react-router-dom";
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
// import ProtectedRoute from "./components/ProtectedRoute";
import AddJob from "./components/AddJob";
import PostedJobs from "./components/PostedJobs";
import Profile from "./pages/Profile";
import MyProfile from "./components/MyProfile";
import JobsList from "./components/AppliedJobs";
import AppliedJobs from "./components/AppliedJobs";
import CompanyNavbar from "./components/CompanyNavbar";

const App = () => {
  const location = useLocation();

  return (
    <>
      <ToastContainer position="top-center" />
      {!(["/signin", "/signup"].includes(location.pathname) || location.pathname.startsWith("/company")) && <Navbar />}
      <div className="">
            <CompanyNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/temp" element={<JobsList />} /> */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job-detail/:id" element={<JobDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} >
            <Route index element={<MyProfile />} />
             <Route path="appliedjobs" element={<AppliedJobs />} />
          </Route>
          {/* Protected Route for company dashboard */}
            <Route path="/company/addjob" element={<AddJob />} />
            <Route path="/company/postedjobs" element={<PostedJobs />} />
 
        </Routes>
      </div>
    </>
  );
};

export default App;
