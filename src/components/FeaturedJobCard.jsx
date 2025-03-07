const FeaturedJobCard = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-6 hover:shadow-xl transition-shadow duration-300">
      <img
        className="h-16 w-16 object-contain"
        src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c5f/66bf2b9a2ff5d8f19427f6db_job-07.svg"
        alt="Company Logo"
      />
      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-800">Full Stack Developer</h1>
        <div className="flex flex-wrap py-2 gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/128/639/639343.png"
              className="h-5 w-5"
              alt="Experience"
            />
            <span>3 - 5 years</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3135/3135679.png"
              className="h-5 w-5"
              alt="Salary"
            />
            <span>3k$ - 5k$ USD</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/128/535/535137.png"
              className="h-5 w-5"
              alt="Location"
            />
            <span>Remote</span>
          </div>
        </div>
        <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default FeaturedJobCard;

