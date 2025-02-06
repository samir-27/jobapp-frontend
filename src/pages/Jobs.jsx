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
    <div className="mt-5 container mx-auto">
      <div className="flex sm:flex-row gap-10 flex-col">
        <div className="sm:w-1/4 w-full sm:border-r border-gray-300 pr-4">
          <FilterSection />
        </div>

        {/* Job Cards Section */}
        <div className="sm:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default Jobs;
