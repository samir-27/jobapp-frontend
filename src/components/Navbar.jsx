import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleUser, FaHeart } from "react-icons/fa6";
import { useFavorites } from "./FavoritesContext";
import NotificationsDrawer from "./NotificationsDrawer";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const { favorites } = useFavorites();

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

  return (
    <nav className="bg-blue-600 text-white z-50 top-0 sticky shadow-md">
      <div className="py-3 flex justify-between items-center container mx-auto px-4">
        <div className="text-2xl font-bold tracking-tight">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-white text-blue-600 px-2 py-0.5 rounded font-black text-lg">GP</span>
            <span>GetPlaced</span>
          </Link>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-blue-100 font-medium text-sm">Home</Link>
          <Link to="/jobs" className="hover:text-blue-100 font-medium text-sm">Find Jobs</Link>
          {isAuthenticated && (
            <>
              <Link to="/profile/appliedjobs" className="hover:text-blue-100 font-medium text-sm">
                Applications
              </Link>
              <Link to="/profile/offers" className="hover:text-blue-100 font-medium text-sm">
                Interviews & Offers
              </Link>
            </>
          )}
          <Link to="/favorites" className="hover:text-blue-100 font-medium text-sm flex items-center gap-1.5">
            <FaHeart size={16} /> Saved ({favorites.length})
          </Link>
          <Link to="/companies" className="hover:text-blue-100 font-medium text-sm">Companies</Link>

          {isAuthenticated && <NotificationsDrawer />}

          <Link to="/profile" className="hover:text-blue-100" title="My Profile">
            <FaCircleUser size={26} />
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-3 py-1.5 rounded-lg transition"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/signin"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold text-xs px-3.5 py-1.5 rounded-lg transition"
            >
              Sign In
            </Link>
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
        <div className="md:hidden bg-blue-700 text-white px-4 py-3 space-y-2 border-t border-blue-600">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gray-200">
            Home
          </Link>
          <Link to="/jobs" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gray-200">
            Find Jobs
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/profile/appliedjobs" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gray-200">
                My Applications
              </Link>
              <Link to="/profile/offers" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gray-200">
                Interviews & Offers
              </Link>
            </>
          )}
          <Link to="/favorites" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gray-200">
            Saved Jobs ({favorites.length})
          </Link>
          <Link to="/companies" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gray-200">
            Companies
          </Link>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gray-200">
            Profile Settings
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full text-left py-1 text-red-200 font-semibold"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/signin" onClick={() => setIsOpen(false)} className="block py-1 font-bold text-white">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
