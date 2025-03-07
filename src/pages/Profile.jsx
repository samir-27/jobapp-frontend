import { Link, Outlet, useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();

  return (
    <div className="py-10 container mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4 w-full">
          <nav className="bg-white border rounded-lg p-5">
            <ul className="space-y-3">
              {[
                { name: "My Profile", path: "." },
                { name: "Applied Jobs", path: "appliedjobs" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={"block text-center py-3 px-5 rounded-lg font-medium transition bg-indigo-100 hover:bg-indigo-500 hover:text-white"}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
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

export default Profile;
