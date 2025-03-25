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
    <div className="">
      <div className="container mx-auto">
        <h1 className="text-black text-4xl font-bold py-10">Featured job</h1>
        <div className="grid grid-cols-2 gap-10">
          {jobs.slice(0, 6).map((job) => (
            <FeaturedJobCard key={job.id} job={job} />
          ))}
        </div>
        <div>
   
        </div>
      </div>
    </div>
  );
};

export default Featuredjob;
