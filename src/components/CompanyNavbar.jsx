import { useState, useEffect } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import NotificationsDrawer from "./NotificationsDrawer";

const CompanyNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    navigate("/signin");
  };

  const handleMobileNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-slate-900 text-white z-50 top-0 sticky shadow-md">
      <div className="py-3.5 flex justify-between items-center container mx-auto px-4">
        <div className="text-xl font-bold tracking-tight">
          <Link
            to="/company/postedjobs"
            onClick={handleMobileNavClick}
            className="flex items-center gap-2"
          >
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-black text-sm">
              RECRUITER
            </span>
            <span>Workplace</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/company/postedjobs"
            className="hover:text-blue-400 font-medium text-sm"
          >
            Hiring Pipeline
          </Link>
          <Link
            to="/company/addjob"
            className="hover:text-blue-400 font-medium text-sm"
          >
            Post Vacancy
          </Link>

          {isAuthenticated && <NotificationsDrawer />}

          <Link
            to="/company/profile"
            className="hover:text-blue-400"
            title="Company Profile"
          >
            <FaCircleUser size={26} />
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 text-white px-4 py-3 space-y-2 border-t border-slate-700">
          <Link
            to="/company/postedjobs"
            onClick={handleMobileNavClick}
            className="block py-1 hover:text-blue-400"
          >
            Hiring Pipeline
          </Link>
          <Link
            to="/company/addjob"
            onClick={handleMobileNavClick}
            className="block py-1 hover:text-blue-400"
          >
            Post Vacancy
          </Link>
          <Link
            to="/company/profile"
            onClick={handleMobileNavClick}
            className="block py-1 hover:text-blue-400"
          >
            Company Profile
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="w-full text-left py-1 text-red-400 font-semibold"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default CompanyNavbar;
