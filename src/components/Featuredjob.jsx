import { useEffect, useState } from "react";
import FeaturedJobCard from "./FeaturedJobCard";

const Featuredjob = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Fetch jobs from the API
    fetch("http://localhost:3000/jobs")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data); // Assuming the response is an array of job objects
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  return (
    <div className="bg-white">
      <div className="container mx-auto">
        <h1 className="text-black text-4xl font-bold py-10">Featured job</h1>
        <div className="grid grid-cols-2 gap-10">
          {jobs.slice(0, 6).map((job) => (
            <FeaturedJobCard key={job.id} job={job} />
          ))}
        </div>
        <div>
          <button className="relative w-52 px-8 py-4 my-10 text-lg font-bold text-white tracking-wide bg-indigo-500 rounded-full">
            Find all Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featuredjob;
