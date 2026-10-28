import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");
    navigate("/signin");
  };

  const isActive = (path) => {
    if (path === "") {
      return (
        location.pathname === "/company/profile" ||
        location.pathname === "/company/profile/"
      );
    }
    return location.pathname.includes(`/company/profile/${path}`);
  };

  return (
    <div className="py-10 container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4 w-full">
          <nav className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-2">
              Employer Settings
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="."
                  className={`block text-center py-2.5 px-4 rounded-xl font-semibold text-sm transition ${
                    isActive("")
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-blue-50/70 text-blue-900 hover:bg-blue-100"
                  }`}
                >
                  Company Profile
                </Link>
              </li>
              <li className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2.5 px-4 rounded-xl font-semibold text-sm transition bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
