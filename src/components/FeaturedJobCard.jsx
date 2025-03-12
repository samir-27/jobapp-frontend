const FeaturedJobCard = ({ job }) => {
  // Log job salary to verify it is correctly passed
  console.log(job.salary);

  return (
    <div className="flex flex-wrap -m-4 ">
      <div className="p-4 w-full">
        <div className="flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col shadow-md bg-white">
          <div className="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
            <img
              className="h-20 w-20 object-contain"
              src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c5f/66bf2b9a2ff5d8f19427f6db_job-07.svg"
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
            <p className="leading-relaxed text-base">{job.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedJobCard;
