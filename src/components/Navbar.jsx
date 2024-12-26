import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if the user is signed in
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    // Check for JWT token in cookies or localStorage
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token) {
      setIsAuthenticated(true); // User is signed in
    } else {
      setIsAuthenticated(false); // User is not signed in
    }
  }, []);

  const handleSignin = () => {
    navigate("/signin");
  };

  const handleLogout = () => {
    // Remove the token from cookies
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
    setIsAuthenticated(false); // Set authentication state to false
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav className="bg-white shadow-lg z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center h-8vh">
        <div className="text-2xl font-bold text-indigo-500">
          <Link to="/">Brand</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className="text-gray-700 hover:text-indigo-500 font-medium"
          >
            Home
          </Link>
          <Link
            to="/blog"
            className="text-gray-700 hover:text-indigo-500 font-medium"
          >
            Blog
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-indigo-500 font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-indigo-500 font-medium"
          >
            Contact
          </Link>

          {/* Conditionally Render Sign In / Log Out Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-indigo-500 rounded-md shadow hover:bg-indigo-600"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={handleSignin}
              className="px-4 py-2 text-white bg-indigo-500 rounded-md shadow hover:bg-indigo-600"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
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
        <div className="md:hidden bg-white shadow-lg">
          <Link
            to="/"
            className="block py-2 px-4 text-gray-700 hover:text-indigo-500"
          >
            Home
          </Link>
          <Link
            to="/blog"
            className="block py-2 px-4 text-gray-700 hover:text-indigo-500"
          >
            Blog
          </Link>
          <Link
            to="/about"
            className="block py-2 px-4 text-gray-700 hover:text-indigo-500"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block py-2 px-4 text-gray-700 hover:text-indigo-500"
          >
            Contact
          </Link>

          {/* Mobile button (conditional rendering) */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full py-2 mt-2 text-white bg-indigo-500 rounded-md shadow hover:bg-indigo-600"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={handleSignin}
              className="w-full py-2 mt-2 text-white bg-indigo-500 rounded-md shadow hover:bg-indigo-600"
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
