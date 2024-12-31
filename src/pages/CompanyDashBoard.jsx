import { Link, Outlet } from "react-router-dom";

const CompanyDashBoard = () => {
  return (
    <div className="py-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4 w-full">
          <nav className="">
            <ul className="space-y-2">
              <li>
                <Link
                  to="."
                  className="block text-center py-4 px-6 bg-indigo-100 hover:bg-indigo-500 hover:text-white rounded-lg font-medium"
                >
                  Add Job
                </Link>
              </li>
              <li>
              <Link
                  to="."
                  className="block text-center py-4 px-6 bg-indigo-100 hover:bg-indigo-500 hover:text-white rounded-lg font-medium"
                >
                  Add Job
                </Link>
              </li>
              <li>
              <Link
                  to="."
                  className="block text-center py-4 px-6 bg-indigo-100 hover:bg-indigo-500 hover:text-white rounded-lg font-medium"
                >
                  Add Job
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="w-full border border-gray-300 rounded-lg  p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashBoard;
