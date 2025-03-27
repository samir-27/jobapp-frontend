import React, { useEffect, useState } from 'react';
import { FaCircleUser } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';

const CompanyNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-500 text-white z-50 top-0 sticky">
      <div className="py-4 flex justify-between items-center container mx-auto">
        <div className="text-2xl font-bold">
          <Link to="/">Get Placed</Link>
        </div>

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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-500 shadow-lg">
          <Link to="/company/home" className="hover:text-gray-300 font-medium">Home</Link>
          <Link to="/company/addjob" className="hover:text-gray-300 font-medium">Create Job</Link>
          <Link to="/company/postedjobs" className="hover:text-gray-300 font-medium">Posted Jobs</Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full py-2 mt-2 bg-white text-blue-500 rounded-md shadow hover:bg-gray-200"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={handleSignin}
              className="w-full py-2 mt-2 bg-white text-blue-500 rounded-md shadow hover:bg-gray-200"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default CompanyNavbar;
