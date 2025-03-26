import { Link, Outlet, useNavigate } from "react-router-dom";

const CompanyProfile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/signin");
  };

  return (
    <div className="py-10 container mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4 w-full">
          <nav className="bg-white border rounded-lg p-5">
            <ul className="space-y-3">
              <li>
                <Link
                  to="."
                  className="block text-center py-3 px-5 rounded-lg font-medium transition bg-blue-100 hover:bg-blue-500 hover:text-white"
                >
                  My Profile
                </Link>
              </li>
              
              <li>
                {/* Logout as a button */}
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-3 px-5 rounded-lg font-medium transition bg-red-100 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
