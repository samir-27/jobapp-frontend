import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import FilterSection from "../components/FilterSection";
import { useSearchParams } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  let [searchParams] = useSearchParams();
  const fetchJobs = async () => {
    try {
      let queryString = searchParams.toString();
      const response = await fetch(`http://localhost:3000/jobs?${queryString}`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  useEffect(() => {
    fetchJobs();
    searchParams = ""
  }, [searchParams]);

  return (
<div className="bg-blue-50 min-h-screen">
  <div className="pt-5 container mx-auto">
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Filter Section */}
      <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-300 pb-4 lg:pb-0 pr-0 lg:pr-4">
        <FilterSection />
      </div>

      {/* Job Cards Section */}
      <div className="w-full lg:w-3/4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

    </div>
  </div>
</div>

  );
};

export default Jobs;
