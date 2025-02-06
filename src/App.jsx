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
import CompanyDashBoard from "./pages/CompanyDashBoard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddJob from "./components/AddJob";
import PostedJobs from "./components/PostedJobs";
import CompanyNav from "./components/CompanyNav";
import Profile from "./pages/Profile";
import MyProfile from "./components/MyProfile";

const App = () => {
  const location = useLocation();

  return (
    <>
      <ToastContainer position="top-center" />
      {!(["/signin", "/signup"].includes(location.pathname) || location.pathname.startsWith("/company")) && <Navbar />}
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job-detail/:id" element={<JobDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} >
            <Route index element={<MyProfile />} />
          </Route>
          {/* Protected Route for company dashboard */}
          <Route
            path="/company"
            element={
              <ProtectedRoute requiredRole="company">

                <CompanyDashBoard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AddJob />} /> {/* Default for /company */}
            <Route path="postedjobs" element={<PostedJobs />} />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
