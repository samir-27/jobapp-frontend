import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <nav className="bg-white border-b-2 z-50 top-0 sticky">
  <div className="py-4 flex justify-between items-center">
    <div className="text-2xl font-bold text-indigo-500">
      <Link to="/">Get Placed</Link>
    </div>

    <div className="hidden md:flex space-x-8 items-center">
      <Link
        to="/"
        className="text-gray-700 hover:text-indigo-500 font-medium"
      >
        Home
      </Link>
      <Link
        to="/jobs"
        className="text-gray-700 hover:text-indigo-500 font-medium"
      >
        Jobs
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

      {/* Login/Logout button logic */}
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
        to="/jobs"
        className="block py-2 px-4 text-gray-700 hover:text-indigo-500"
      >
        Jobs
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