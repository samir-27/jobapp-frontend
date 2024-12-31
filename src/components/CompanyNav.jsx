import { Link } from "react-router-dom"

const CompanyNav = () => {
  return (
    <div>
       <nav className="bg-white border-b-2 z-50 top-0 sticky">
  <div className="py-4 flex justify-between items-center">
    <div className="text-2xl font-bold text-indigo-500">
      <Link to="/">Get Placed</Link>
    </div>

    <div className="hidden md:flex space-x-8 items-center">


    </div>
    </div>
    </nav>
    </div>
  )
}

export default CompanyNav
