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
              src={job.company?.logo || "https://cdn-icons-png.flaticon.com/512/3237/3237472.png"}
              alt="Company Logo"
            />
          </div>
    
          {/* Job Content */}
          <div className="flex-grow">
            {/* Title */}
            <h2 className="text-gray-900 text-xl font-semibold mb-2">
              {job.title} - {job.company?.name || "Hiring Partner"}
            </h2>
    
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-gray-700 text-sm mb-3">
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/639/639343.png"
                  className="h-5 w-5"
                  alt="Experience"
                />
                <span>{job.experience || "Fresher"}</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3135/3135679.png"
                  className="h-5 w-5"
                  alt="Salary"
                />
                <span>${Number(job.salary || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2838/2838912.png"
                  className="h-5 w-5"
                  alt="Location"
                />
                <span className="capitalize">{job.location || "Remote"}</span>
              </div>
            </div>
    
            {/* Description */}
            <p className="leading-relaxed text-base text-gray-600 line-clamp-2">
              {job.description}
            </p>
    
            {/* Action Link */}
            <div className="mt-4 flex items-center text-blue-500 font-medium">
              <span>Apply Now</span>
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedJobCard;
