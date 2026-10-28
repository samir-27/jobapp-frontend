import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import FeaturedJobCard from "./FeaturedJobCard";

const Featuredjob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/jobs`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch jobs");
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          setJobs([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const safeJobsList = Array.isArray(jobs) ? jobs : [];

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <h1 className="text-black text-4xl font-bold pb-10 mx-4 sm:mx-0">
          Featured Jobs
        </h1>
        {loading ? (
          <div className="flex justify-center p-8 text-gray-400">Loading featured positions...</div>
        ) : safeJobsList.length === 0 ? (
          <p className="text-gray-500 italic mx-4 sm:mx-0">No open positions currently available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-10 mx-4 sm:mx-0">
            {safeJobsList.slice(0, 6).map((job) => (
              <FeaturedJobCard key={job._id || job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Featuredjob;
