import { useFavorites } from "./FavoritesContext";
import JobCard from "../components/JobCard";

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Favorite Jobs</h1>
      {favorites.length === 0 ? (
        <p>No favorite jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;