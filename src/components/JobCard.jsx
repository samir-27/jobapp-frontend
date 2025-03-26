import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "./FavoritesContext";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some((fav) => fav._id === job._id);

  const handleApplyNow = () => {
    navigate(`/job-detail/${job._id}`);
  };

  const handleAddToFavorite = () => {
    if (isFavorite) {
      removeFavorite(job._id);
    } else {
      addFavorite(job);
    }
  };

  return (
    <div className="bg-white border shadow-md border-gray-200 rounded p-6 transition-all transform hover:scale-[1.03]">
      <div className="flex items-center gap-4 mb-4">
        <img src={job.company.logo} alt="Company Logo" className="w-14 h-14 rounded-full shadow-md" />
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">{job.title}</h3>
          <p className="text-gray-600 text-sm">{job.company.name}</p>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>

      <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-700">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg">💰 Salary: ${job.salary}</span>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">📅 Experience: {job.experience}</span>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handleApplyNow}
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
        >
          View Details
        </button>
        
        {/* Favorite Button with Icon */}
        <button
          onClick={handleAddToFavorite}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-all
            ${isFavorite ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          {isFavorite ? <HiHeart size={24} /> : <HiOutlineHeart size={24} />}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
