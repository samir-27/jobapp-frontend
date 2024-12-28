import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import FilterSection from "../components/FilterSection";
import { useSearchParams } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchParams] = useSearchParams();
  useEffect(() => {
  
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

    fetchJobs();
  }, [searchParams]);

  return (
    <div className="mt-10">
      <div className="flex sm:flex-row gap-10 flex-col">
        <div className="sm:w-1/3 w-full">
          <FilterSection/>
        </div>
        <div className="sm:w-2/3 w-full">
          <div className="">
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
