import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import CompanyJobCard from "./CompanyJobCard";
import { API_BASE_URL, fetchWithAuth } from "../utils/api";

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");
  let ComId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      ComId = decodedToken.id;
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }

  const fetchJobs = useCallback(async (signal) => {
    if (!ComId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_BASE_URL}/jobs/company/${ComId}`, {
        signal,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posted jobs");
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
  }, [ComId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchJobs(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchJobs]);

  const handleJobDeleted = (deletedId) => {
    setJobs((prev) => prev.filter((j) => (j._id || j.id) !== deletedId));
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs((prev) =>
      prev.map((j) =>
        (j._id || j.id) === (updatedJob._id || updatedJob.id) ? updatedJob : j
      )
    );
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="py-6 container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Posted Jobs</h1>
        {loading && <div className="text-center py-8 text-gray-600">Loading posted jobs...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-8 text-gray-600">You have not posted any jobs yet.</div>
        )}
        <div className="w-full">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
            {jobs.map((job) => (
              <CompanyJobCard
                key={job._id || job.id}
                job={job}
                onJobDeleted={handleJobDeleted}
                onJobUpdated={handleJobUpdated}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostedJobs;
