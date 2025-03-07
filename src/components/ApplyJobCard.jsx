import { Navigate, useNavigate } from "react-router-dom";

const ApplyJobCard = ({ job }) => {
    const navigate= useNavigate();
    const handledViewClick = () => {
        navigate(`/job-detail/${job._id}`)
    }
    return (
      <div className="bg-white rounded p-5 border border-2 border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-800">{job.companyName}</h2>
        <h2>{job.title}</h2>
        <p className="text-gray-600 mt-2">{job.description}</p>
        <button onClick={handledViewClick} className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          View Details
        </button>
      </div>
    );
  };
  
  export default ApplyJobCard;
  