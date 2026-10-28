import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import { toast } from "react-toastify";

const STAGES = [
  { key: "applied", label: "Applied" },
  { key: "screening", label: "Screening" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
  { key: "hired", label: "Hired" },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "hired":
      return { bg: "bg-green-100 text-green-800 border-green-300", label: "Hired" };
    case "offer":
      return { bg: "bg-amber-100 text-amber-800 border-amber-300", label: "Offer Extended" };
    case "interview":
      return { bg: "bg-indigo-100 text-indigo-800 border-indigo-300", label: "Interviewing" };
    case "screening":
      return { bg: "bg-purple-100 text-purple-800 border-purple-300", label: "Screening" };
    case "rejected":
      return { bg: "bg-red-100 text-red-800 border-red-300", label: "Not Selected" };
    case "withdrawn":
      return { bg: "bg-gray-100 text-gray-700 border-gray-300", label: "Withdrawn" };
    case "applied":
    default:
      return { bg: "bg-blue-100 text-blue-800 border-blue-300", label: "Applied" };
  }
};

const ApplyJobCard = ({ application, onWithdrawn }) => {
  const navigate = useNavigate();
  const [withdrawing, setWithdrawing] = useState(false);

  const job = application.job || {};
  const status = application.status || "applied";
  const badge = getStatusBadge(status);

  const companyName = job.company?.name || "Partner Company";
  const appliedDate = application.createdAt
    ? new Date(application.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  // Calculate stage index for visual stepper
  const currentStageIndex = STAGES.findIndex((s) => s.key === status);
  const isTerminalNegative = ["rejected", "withdrawn"].includes(status);

  const handleWithdraw = async () => {
    if (
      !window.confirm(
        `Are you sure you want to withdraw your application for ${job.title || "this position"}?`
      )
    ) {
      return;
    }

    try {
      setWithdrawing(true);
      const res = await fetchWithAuth(`/applyjob/${application._id}/withdraw`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to withdraw application");
      }

      toast.success("Application withdrawn successfully");
      if (onWithdrawn) {
        onWithdrawn(application._id);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {companyName}
          </span>
          <h3 className="text-xl font-bold text-gray-900 mt-0.5">
            {job.title || "Position Title Unavailable"}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
            {job.location && <span>📍 {job.location}</span>}
            {job.jobType && <span>💼 {job.jobType}</span>}
            {job.salary && <span>💰 ${Number(job.salary).toLocaleString()}</span>}
            {appliedDate && <span>📅 Applied: {appliedDate}</span>}
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Visual Pipeline Progress Bar (if not rejected/withdrawn) */}
      {!isTerminalNegative ? (
        <div className="my-5">
          <div className="flex justify-between items-center text-xs font-medium text-gray-600 mb-2">
            {STAGES.map((s, idx) => {
              const isPast = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <span
                  key={s.key}
                  className={`${
                    isCurrent
                      ? "text-blue-600 font-bold"
                      : isPast
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex">
            {STAGES.map((s, idx) => {
              const isPast = idx <= currentStageIndex;
              return (
                <div
                  key={s.key}
                  className={`h-full flex-1 transition-all duration-300 ${
                    isPast ? "bg-blue-600" : "bg-transparent"
                  } ${idx !== STAGES.length - 1 ? "border-r border-white" : ""}`}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="my-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-200">
          Application status is currently{" "}
          <strong className="text-gray-800">{badge.label}</strong>.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center pt-3 border-t border-gray-100 gap-2 mt-4">
        {job._id && (
          <button
            onClick={() => navigate(`/job-detail/${job._id}`)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            View Job Details →
          </button>
        )}

        {!isTerminalNegative && (
          <button
            onClick={handleWithdraw}
            disabled={withdrawing}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
          >
            {withdrawing ? "Withdrawing..." : "Withdraw Application"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplyJobCard;
