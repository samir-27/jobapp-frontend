import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";


const App = () => {
  return (
    <>
      <ToastContainer position="top-center" />
      <div className="2xl:mx-96 xl:mx-72 lg:mx-52 md:mx-36 mx-10 ">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/job-detail/:id" element={<JobDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      </div>
    </>
  );
};

export default App;
