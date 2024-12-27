import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate(); 

  const handleApplyNow = () => {
    navigate(`/job-detail/${job._id}`);
  };

  return (
    <div className="border border-gray-200 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
      <p className="text-gray-600 mt-2">{job.description}</p>
      <div className="mt-4">
        <span className="text-sm font-medium text-gray-700">Salary: ${job.salary}</span>
        <span className="ml-4 text-sm font-medium text-gray-700">Experience: {job.experience}</span>
        <span className="ml-4 text-sm font-medium text-gray-700">Company: {job.companyName}</span>
      </div>
      <button
        onClick={handleApplyNow}
        className="mt-4  px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        View Details
      </button>
    </div>
  );
};

export default JobCard;
