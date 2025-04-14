import React, { useState, useEffect } from 'react';
import { FaCircleUser } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';

const CompanyNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleSignin = () => {
    navigate('/login');
  };

  const handleMobileNavClick = () => {
    setIsOpen(false); // close the menu after clicking a link
  };

  return (
    <nav className="bg-blue-500 text-white z-50 top-0 sticky">
      <div className="py-4 flex justify-between items-center container mx-auto px-4">
        <div className="text-2xl font-bold">
          <Link to="/company/addjob" onClick={handleMobileNavClick}>Get Placed</Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/company/addjob" className="hover:text-gray-300 font-medium">Create Job</Link>
          <Link to="/company/postedjobs" className="hover:text-gray-300 font-medium">Posted Jobs</Link>
          <Link to="/company/profile" className="hover:text-gray-300">
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

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-500 px-4 py-2 space-y-2">
          <Link
            to="/company/home"
            onClick={handleMobileNavClick}
            className="block text-white hover:text-gray-300 font-medium"
          >
            Home
          </Link>
          <Link
            to="/company/addjob"
            onClick={handleMobileNavClick}
            className="block text-white hover:text-gray-300 font-medium"
          >
            Create Job
          </Link>
          <Link
            to="/company/postedjobs"
            onClick={handleMobileNavClick}
            className="block text-white hover:text-gray-300 font-medium"
          >
            Posted Jobs
          </Link>
          <Link
            to="/company/profile"
            onClick={handleMobileNavClick}
            className="block text-white hover:text-gray-300 font-medium"
          >
            Profile
          </Link>

        </div>
      )}
    </nav>
  );
};

export default CompanyNavbar;

