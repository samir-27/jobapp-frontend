import { useFavorites } from "./FavoritesContext";
import JobCard from "../components/JobCard";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { favorites, loading } = useFavorites();

  return (
    <div className="bg-blue-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Opportunities</h1>
            <p className="text-gray-600 mt-1">
              Keep track of roles you are interested in and apply when ready.
            </p>
          </div>
          <span className="mt-2 sm:mt-0 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
            {favorites.length} {favorites.length === 1 ? "Job Saved" : "Jobs Saved"}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-5xl mb-4">🔖</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No saved jobs yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Explore opportunities across companies and save jobs to compare or apply later.
            </p>
            <Link
              to="/jobs"
              className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((job) => (
              <JobCard key={job._id || job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
