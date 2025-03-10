import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignin = () => {
    navigate("/signin");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <nav className="bg-indigo-500 text-white z-50 top-0 sticky ">
      <div className="py-4 flex justify-between items-center container mx-auto">
        <div className="text-2xl font-bold">
          <Link to="/">Get Placed</Link>
        </div>

        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/" className="hover:text-gray-300 font-medium">Home</Link>
          <Link to="/jobs" className="hover:text-gray-300 font-medium">Jobs</Link>
          <Link to="/about" className="hover:text-gray-300 font-medium">About</Link>
          <Link to="/contact" className="hover:text-gray-300 font-medium">Contact</Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-indigo-500 rounded-md shadow hover:bg-gray-200"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={handleSignin}
              className="px-4 py-2 bg-white text-indigo-500 rounded-md shadow hover:bg-gray-200"
            >
              Sign In
            </button>
          )}
          <Link to="/profile" className="hover:text-gray-300">
            <FaCircleUser size={30} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-indigo-500 shadow-lg">
          <Link to="/" className="block py-2 px-4 hover:text-gray-300">Home</Link>
          <Link to="/jobs" className="block py-2 px-4 hover:text-gray-300">Jobs</Link>
          <Link to="/about" className="block py-2 px-4 hover:text-gray-300">About</Link>
          <Link to="/contact" className="block py-2 px-4 hover:text-gray-300">Contact</Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full py-2 mt-2 bg-white text-indigo-500 rounded-md shadow hover:bg-gray-200"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={handleSignin}
              className="w-full py-2 mt-2 bg-white text-indigo-500 rounded-md shadow hover:bg-gray-200"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;