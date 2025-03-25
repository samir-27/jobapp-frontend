import { Link, Outlet } from "react-router-dom"

const CompanyProfile = () => {
  return (
    <div className="py-10 container mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4 w-full">
          <nav className="">
            <ul className="space-y-2">
              <li>
                <Link
                  to="."
                  className="block text-center py-4 px-6 bg-blue-100 hover:bg-blue-500 hover:text-white rounded-lg font-medium"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="appliedjobs"
                  className="block text-center py-4 px-6 bg-blue-100 hover:bg-blue-500 hover:text-white rounded-lg font-medium"
                >
                  Applied Jobs
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default CompanyProfile