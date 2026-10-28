import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import ApplyJobCard from "./ApplyJobCard";
import { fetchWithAuth } from "../utils/api";
import { Link } from "react-router-dom";

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem("authToken");
  let userID = null;
  if (authToken) {
    try {
      const decodeToken = jwtDecode(authToken);
      userID = decodeToken.id;
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }

  const fetchApplications = useCallback(async () => {
    if (!userID) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth(`/applyjob/user/${userID}`);
      if (!res.ok) {
        throw new Error("Failed to load your applications");
      }
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading applications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userID]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApplicationWithdrawn = (withdrawnId) => {
    setApplications((prev) =>
      prev.map((app) =>
        app._id === withdrawnId
          ? {
              ...app,
              status: "withdrawn",
              stageHistory: [
                ...(app.stageHistory || []),
                {
                  stage: "withdrawn",
                  changedAt: new Date().toISOString(),
                  note: "Candidate withdrew application",
                },
              ],
            }
          : app
      )
    );
  };

  return (
    <div className="bg-blue-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Tracker</h1>
            <p className="text-gray-600 mt-1">
              Real-time recruitment pipeline updates for all positions you applied to.
            </p>
          </div>
          <span className="mt-2 sm:mt-0 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
            {applications.length} {applications.length === 1 ? "Application" : "Applications"}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-xl text-center">
            {error}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No applications submitted yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Ready to take the next step in your career? Browse open positions and apply today.
            </p>
            <Link
              to="/jobs"
              className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Explore Job Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <ApplyJobCard
                key={app._id}
                application={app}
                onWithdrawn={handleApplicationWithdrawn}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
