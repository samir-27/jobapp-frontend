import { useNavigate } from "react-router-dom";

const FeaturedJobCard = ({ job }) => {
  const navigate = useNavigate();
  return ( 
    <div className="flex flex-wrap -m-4 cursor-pointer" onClick={() => navigate(`/job-detail/${job._id}`)}>
      <div className="p-4 w-full">
        <div className="flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col shadow-md bg-white 
                        transition-transform duration-300 hover:scale-105 hover:shadow-lg gap-5">
          <div className="rounded-full overflow-hidden h-20 w-20 flex items-center justify-center bg-gray-200">
            <img
              className="h-20 w-20 object-cover "
              src={job.company.logo}
              alt="Company Logo"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
              {job.title} - {job.company.name}
            </h2>
            <div className="flex flex-wrap py-3 gap-6 text-gray-700 text-base">
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/639/639343.png"
                  className="h-6 w-6"
                  alt="Experience"
                />
                <span>{job.experience}</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3135/3135679.png"
                  className="h-6 w-6"
                  alt="Salary"
                />
                <span>${job.salary} USD</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/535/535137.png"
                  className="h-6 w-6"
                  alt="Location"
                />
                <span>{job.location}</span>
              </div>
            </div>

            {/* Skills Section */}
            <div className="flex flex-wrap gap-2 mt-4">
              {job.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-blue-200 text-blue-700 text-sm font-semibold rounded-full  bg-opacity-50"
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
