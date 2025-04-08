import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 border-t">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Branding */}
          <div className="mb-6 md:mb-0">
            <h1 className="text-2xl font-bold text-blue-500">GET PLACED</h1>
            <p className="mt-2 text-sm text-gray-500 max-w-sm">
              Your career journey starts here. Find jobs, connect with companies, and get placed with ease.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 mt-8 md:mt-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Pages</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/jobs" className="hover:text-blue-600">Jobs</Link></li>
                <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
                <li><Link to="/companies" className="hover:text-blue-600">Companies</Link></li>
                <li><Link to="/profile" className="hover:text-blue-600">Profile</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>Email: sumrasamir27@gmail.com</li>
                <li>Phone: 9316102936</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 text-center sm:text-left">© {new Date().getFullYear()} Get Placed. All rights reserved.</p>
          <div className="flex mt-4 sm:mt-0 space-x-4">
            <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
