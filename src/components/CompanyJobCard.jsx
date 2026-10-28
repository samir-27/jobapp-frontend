import { useState } from "react";
import { toast } from "react-toastify";
import { fetchWithAuth } from "../utils/api";

const STAGES = [
  { key: "applied", label: "Applied" },
  { key: "screening", label: "Screening" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
];

const CompanyJobCard = ({ job, onJobDeleted, onJobUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Active notes/interview/offer inline state
  const [expandedNotesAppId, setExpandedNotesAppId] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [schedulingAppId, setSchedulingAppId] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    title: "Initial Technical Screen",
    scheduledAt: "",
    mode: "remote",
    meetingLink: "",
  });
  const [offerAppId, setOfferAppId] = useState(null);
  const [offerForm, setOfferForm] = useState({
    salary: job.salary || 100000,
    currency: "USD",
    startDate: "",
    expiresAt: "",
    benefits: "Health insurance, 401(k) matching, Remote stipend",
    notes: "",
  });

  const [formData, setFormData] = useState({
    title: job.title || "",
    description: job.description || "",
    role: job.role || "",
    skills: job.skills || [],
    salary: job.salary || "",
    experience: job.experience || "",
    location: job.location || "",
    jobType: job.jobType || "",
    status: job.status || "draft",
    responsibilities: job.responsibilities || [],
    requirements: job.requirements || [],
    niceToHave: job.niceToHave || [],
  });

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const response = await fetchWithAuth(`/applyjob/job/${job._id}`);
      if (!response.ok) throw new Error("Failed to fetch applications");
      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Error fetching applications");
    } finally {
      setLoadingApps(false);
    }
  };

  const handleStageChange = async (applicationId, newStage) => {
    try {
      const res = await fetchWithAuth(`/applyjob/${applicationId}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update candidate stage");
      }

      const updated = await res.json();
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? updated : app))
      );
      toast.success(`Candidate stage moved to ${newStage.toUpperCase()}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRateCandidate = async (applicationId, rating) => {
    try {
      const res = await fetchWithAuth(`/applyjob/${applicationId}/rate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      if (!res.ok) {
        throw new Error("Failed to record rating");
      }

      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, rating } : app))
      );
      toast.info(`Candidate rated ${rating}/5 stars`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddNote = async (applicationId) => {
    if (!noteContent.trim()) return;
    try {
      const res = await fetchWithAuth(`/applyjob/${applicationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent.trim() }),
      });

      if (!res.ok) throw new Error("Failed to save note");
      const updated = await res.json();
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? updated : app))
      );
      setNoteContent("");
      toast.success("Recruiter evaluation note saved");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleScheduleInterview = async (applicationId) => {
    if (!interviewForm.scheduledAt) {
      toast.warning("Please choose a date and time for the interview");
      return;
    }

    try {
      const res = await fetchWithAuth("/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          title: interviewForm.title,
          scheduledAt: interviewForm.scheduledAt,
          mode: interviewForm.mode,
          meetingLink: interviewForm.meetingLink,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to schedule interview");
      }

      toast.success("Interview scheduled and candidate notified!");
      setSchedulingAppId(null);
      // Refresh applications to reflect 'interview' stage
      fetchApplications();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreateOffer = async (applicationId) => {
    if (!offerForm.startDate) {
      toast.warning("Please specify a starting date for the offer.");
      return;
    }
    try {
      const res = await fetchWithAuth("/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          salary: Number(offerForm.salary),
          currency: offerForm.currency || "USD",
          startDate: new Date(offerForm.startDate).toISOString(),
          expiresAt: offerForm.expiresAt
            ? new Date(offerForm.expiresAt).toISOString()
            : undefined,
          benefits:
            typeof offerForm.benefits === "string"
              ? offerForm.benefits
                  .split(",")
                  .map((b) => b.trim())
                  .filter(Boolean)
              : offerForm.benefits,
          notes: offerForm.notes || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to extend offer");
      }

      toast.success("Formal job offer extended to candidate! 🎉");
      setOfferAppId(null);
      fetchApplications();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDownloadSecureResume = async (applicationId) => {
    try {
      const res = await fetchWithAuth(`/applyjob/resume/${applicationId}`);
      if (!res.ok) throw new Error("Failed to retrieve resume link");
      const data = await res.json();
      window.open(data.resumeUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleQuickStatusChange = async (newStatus) => {
    try {
      const res = await fetchWithAuth(`/jobs/${job._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to change job status");
      const updated = await res.json();
      toast.success(`Job status changed to ${newStatus.toUpperCase()}`);
      if (onJobUpdated) onJobUpdated(updated);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job vacancy?")) return;
    try {
      const response = await fetchWithAuth(`/jobs/${job._id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Job deleted successfully.");
        if (onJobDeleted) onJobDeleted(job._id);
      } else {
        toast.error("Failed to delete the job.");
      }
    } catch (error) {
      toast.error("Error: Unable to delete the job.");
      console.error("Error:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
        skills: Array.isArray(formData.skills)
          ? formData.skills
          : typeof formData.skills === "string"
          ? formData.skills.split(",").map((s) => s.trim())
          : [],
      };

      const response = await fetchWithAuth(`/jobs/${job._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update job");
      const result = await response.json();
      toast.success("Job updated successfully.");
      setIsEditing(false);
      if (onJobUpdated) onJobUpdated(result);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong updating the job.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const currentStatus = job.status || "draft";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
            <span
              className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                currentStatus === "published"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : currentStatus === "draft"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {currentStatus}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
            <span>Role: {job.role}</span>
            <span>📍 {job.location}</span>
            <span>💼 {job.jobType}</span>
            <span>💰 ${Number(job.salary).toLocaleString()}</span>
            <span>👁️ {job.viewsCount || 0} views</span>
            <span>👥 {job.applicantsCount || 0} applicants</span>
          </div>
        </div>

        {/* Quick Status Toggles */}
        <div className="flex items-center gap-1.5">
          {currentStatus === "draft" && (
            <button
              onClick={() => handleQuickStatusChange("published")}
              className="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
            >
              Publish Job
            </button>
          )}
          {currentStatus === "published" && (
            <button
              onClick={() => handleQuickStatusChange("closed")}
              className="text-xs px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition"
            >
              Close Applications
            </button>
          )}
          {currentStatus === "closed" && (
            <button
              onClick={() => handleQuickStatusChange("published")}
              className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Reopen
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{job.description}</p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 gap-2">
        <button
          onClick={fetchApplications}
          disabled={loadingApps}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
        >
          <span>Review Pipeline</span>
          <span className="bg-blue-800 text-blue-100 px-1.5 py-0.5 rounded-full text-[10px]">
            {job.applicantsCount || 0}
          </span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
          >
            Edit Job
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* APPLICANT PIPELINE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Hiring Pipeline: {job.title}
                </h2>
                <p className="text-xs text-gray-500">
                  Track stages, schedule interviews, view resumes, and evaluate candidates.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {applications.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">
                  No applications received yet for this vacancy.
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-5 border border-gray-200 rounded-xl hover:border-blue-300 transition bg-white shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <h4 className="text-base font-bold text-gray-900">
                          {app.fullname}
                        </h4>
                        <p className="text-xs text-gray-500">
                          📞 {app.phone} • 🎓 {app.education} ({app.course})
                        </p>
                      </div>

                      {/* Stage Selector & Rating */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRateCandidate(app._id, star)}
                              className={`text-lg leading-none ${
                                star <= (app.rating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-200 hover:text-yellow-200"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        {/* Stage Progression Dropdown */}
                        <select
                          value={app.status || "applied"}
                          onChange={(e) => handleStageChange(app._id, e.target.value)}
                          className="text-xs font-bold border border-blue-300 bg-blue-50 text-blue-800 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              Stage: {s.label}
                            </option>
                          ))}
                          <option value="withdrawn" disabled>
                            Withdrawn
                          </option>
                        </select>
                      </div>
                    </div>

                    {app.description && (
                      <p className="text-xs text-gray-600 mt-2.5 italic">
                        &ldquo;{app.description}&rdquo;
                      </p>
                    )}

                    {/* Candidate Actions Bar */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
                      {app.resumeUrl && (
                        <button
                          onClick={() => handleDownloadSecureResume(app._id)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-md transition"
                        >
                          📄 Secure Resume
                        </button>
                      )}

                      <button
                        onClick={() =>
                          setSchedulingAppId(schedulingAppId === app._id ? null : app._id)
                        }
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-md transition"
                      >
                        📅 Schedule Interview
                      </button>

                      <button
                        onClick={() =>
                          setExpandedNotesAppId(
                            expandedNotesAppId === app._id ? null : app._id
                          )
                        }
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-md transition"
                      >
                        📝 Notes ({app.notes?.length || 0})
                      </button>

                      <button
                        onClick={() => {
                          setOfferAppId(offerAppId === app._id ? null : app._id);
                          setSchedulingAppId(null);
                          setExpandedNotesAppId(null);
                        }}
                        className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-md transition"
                      >
                        🤝 Extend Offer
                      </button>
                    </div>

                    {/* INLINE INTERVIEW SCHEDULER */}
                    {schedulingAppId === app._id && (
                      <div className="mt-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
                        <h5 className="text-xs font-bold text-indigo-900">
                          Schedule Interview with {app.fullname}
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Title (e.g. Technical Round)"
                            value={interviewForm.title}
                            onChange={(e) =>
                              setInterviewForm({ ...interviewForm, title: e.target.value })
                            }
                            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                          />
                          <input
                            type="datetime-local"
                            value={interviewForm.scheduledAt}
                            onChange={(e) =>
                              setInterviewForm({
                                ...interviewForm,
                                scheduledAt: e.target.value,
                              })
                            }
                            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                          />
                          <select
                            value={interviewForm.mode}
                            onChange={(e) =>
                              setInterviewForm({ ...interviewForm, mode: e.target.value })
                            }
                            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                          >
                            <option value="remote">Remote (Video Call)</option>
                            <option value="in-person">In-Person</option>
                            <option value="phone">Phone Screen</option>
                          </select>
                          <input
                            type="url"
                            placeholder="Meeting URL (Google Meet, Zoom, etc.)"
                            value={interviewForm.meetingLink}
                            onChange={(e) =>
                              setInterviewForm({
                                ...interviewForm,
                                meetingLink: e.target.value,
                              })
                            }
                            className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSchedulingAppId(null)}
                            className="text-xs px-3 py-1 text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleScheduleInterview(app._id)}
                            className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded"
                          >
                            Confirm Schedule
                          </button>
                        </div>
                      </div>
                    )}

                    {/* INLINE NOTES VIEWER & ADDER */}
                    {expandedNotesAppId === app._id && (
                      <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                        <h5 className="text-xs font-bold text-gray-800">
                          Recruiter Evaluation Notes
                        </h5>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto">
                          {app.notes && app.notes.length > 0 ? (
                            app.notes.map((n, i) => (
                              <div
                                key={i}
                                className="text-xs bg-white p-2 rounded border border-gray-200"
                              >
                                <span className="font-bold text-gray-700">
                                  {n.authorName}:{" "}
                                </span>
                                <span className="text-gray-600">{n.content}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 italic">No notes yet.</p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add evaluation feedback..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="text-xs flex-1 border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddNote(app._id)}
                            className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    )}

                    {/* INLINE FORMAL OFFER EXTENSION */}
                    {offerAppId === app._id && (
                      <div className="mt-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                        <h5 className="text-xs font-bold text-emerald-900">
                          Extend Formal Job Offer to {app.fullname}
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-2xs font-semibold text-gray-700 mb-0.5">
                              Salary ($/year) *
                            </label>
                            <input
                              type="number"
                              min="1000"
                              placeholder="Salary"
                              value={offerForm.salary}
                              onChange={(e) =>
                                setOfferForm({ ...offerForm, salary: e.target.value })
                              }
                              className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-2xs font-semibold text-gray-700 mb-0.5">
                              Start Date *
                            </label>
                            <input
                              type="date"
                              value={offerForm.startDate}
                              onChange={(e) =>
                                setOfferForm({ ...offerForm, startDate: e.target.value })
                              }
                              className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-2xs font-semibold text-gray-700 mb-0.5">
                              Offer Valid Until
                            </label>
                            <input
                              type="date"
                              value={offerForm.expiresAt}
                              onChange={(e) =>
                                setOfferForm({ ...offerForm, expiresAt: e.target.value })
                              }
                              className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-2xs font-semibold text-gray-700 mb-0.5">
                            Benefits & Perks (comma-separated)
                          </label>
                          <input
                            type="text"
                            placeholder="Health, Dental, 401(k), Remote stipend"
                            value={offerForm.benefits}
                            onChange={(e) =>
                              setOfferForm({ ...offerForm, benefits: e.target.value })
                            }
                            className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-2xs font-semibold text-gray-700 mb-0.5">
                            Personalized Welcome Message
                          </label>
                          <input
                            type="text"
                            placeholder="We are excited to invite you to join our growing team!"
                            value={offerForm.notes}
                            onChange={(e) =>
                              setOfferForm({ ...offerForm, notes: e.target.value })
                            }
                            className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setOfferAppId(null)}
                            className="text-xs px-3 py-1 text-gray-500 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCreateOffer(app._id)}
                            className="text-xs px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs"
                          >
                            Send Formal Offer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT JOB MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Job Post</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Salary ($)
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-Site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyJobCard;
