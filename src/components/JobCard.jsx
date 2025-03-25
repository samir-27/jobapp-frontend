import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate(`/job-detail/${job._id}`);
  };
  console.log(job)
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

  <button
    onClick={handleApplyNow}
    className="mt-6 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
  >
    View Details
  </button>
</div>

  );
};

export default JobCard;