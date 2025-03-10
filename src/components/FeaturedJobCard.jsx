const FeaturedJobCard = () => {
  return (
    <div className="bg-white p-6 rounded shadow-xl flex items-center gap-8 hover:shadow-2xl transition-shadow duration-300 mx-auto border w-full border-gray-200">
      <img
        className="h-20 w-20 object-contain"
        src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c5f/66bf2b9a2ff5d8f19427f6db_job-07.svg"
        alt="Company Logo"
      />
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900">Full Stack Developer</h1>
        <div className="flex flex-wrap py-3 gap-6 text-gray-700 text-base">
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/128/639/639343.png"
              className="h-6 w-6"
              alt="Experience"
            />
            <span>3 - 5 years</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3135/3135679.png"
              className="h-6 w-6"
              alt="Salary"
            />
            <span>$3k - $5k USD</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/128/535/535137.png"
              className="h-6 w-6"
              alt="Location"
            />
            <span>Remote</span>
          </div>
        </div>
        <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg text-base font-semibold hover:bg-indigo-700 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default FeaturedJobCard;