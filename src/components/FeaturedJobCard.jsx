import { useNavigate } from "react-router-dom";

const FeaturedJobCard = ({ job }) => {
  const navigate = useNavigate();
  return ( 
    <div
    className="flex flex-wrap -m-4 cursor-pointer"
    onClick={() => navigate(`/job-detail/${job._id}`)}
  >
    <div className="p-4 w-full">
      <div className="flex flex-col sm:flex-row border-2 rounded-lg border-gray-200 border-opacity-50 p-6 shadow-md bg-white 
                      transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg gap-5">
        
        {/* Company Logo */}
        <div className="flex-shrink-0 flex justify-center sm:justify-start">
          <img
            className="h-20 w-20 rounded-md object-contain"
            src={job.company.logo}
            alt="Company Logo"
          />
        </div>
  
        {/* Job Content */}
        <div className="flex-grow">
          {/* Title */}
          <h2 className="text-gray-900 text-xl font-semibold mb-2">
            {job.title} - {job.company.name}
          </h2>
  
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-gray-700 text-sm mb-3">
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/128/639/639343.png"
                className="h-5 w-5"
                alt="Experience"
              />
              <span>{job.experience}</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/128/3135/3135679.png"
                className="h-5 w-5"
                alt="Salary"
              />
              <span>${job.salary} USD</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="https://cdn-icons-png.flaticon.com/128/535/535137.png"
                className="h-5 w-5"
                alt="Location"
              />
              <span>{job.location}</span>
            </div>
          </div>
  
          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default FeaturedJobCard;
