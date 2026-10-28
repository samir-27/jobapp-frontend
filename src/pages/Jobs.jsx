import { useEffect, useState, useCallback } from "react";
import JobCard from "../components/JobCard";
import FilterSection from "../components/FilterSection";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const fetchJobs = useCallback(async (signal) => {
    try {
      setLoading(true);
      const queryString = searchParams.toString();
      const response = await fetch(`${API_BASE_URL}/jobs?${queryString}`, {
        signal,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error fetching jobs:", err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    fetchJobs(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchJobs]);

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="pt-5 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Section */}
          <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-300 pb-4 lg:pb-0 pr-0 lg:pr-4">
            <FilterSection />
          </div>

          {/* Job Cards Section */}
          <div className="w-full lg:w-3/4">
            {loading && <div className="text-center py-8 text-gray-600">Loading jobs...</div>}
            {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
            {!loading && !error && jobs.length === 0 && (
              <div className="text-center py-8 text-gray-600">No matching jobs found.</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
