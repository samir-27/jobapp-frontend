import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE_URL, fetchWithAuth } from "../utils/api";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaTimes,
  FaUser,
  FaPhone,
  FaGraduationCap,
  FaPaperPlane,
} from "react-icons/fa";

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Resume selection mode: 'existing' | 'upload'
  const [resumeMode, setResumeMode] = useState("existing");
  const [existingResumeInfo, setExistingResumeInfo] = useState(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    education: "graduation",
    course: "",
    description: "",
    resumeFile: null,
  });

  // Fetch job details
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
        if (!response.ok) throw new Error("Job not found");
        const data = await response.json();
        setJob(data);

        // Record a view count asynchronously
        fetch(`${API_BASE_URL}/jobs/${id}/view`, { method: "POST" }).catch(() => {});
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Could not load job vacancy details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  // Check if candidate already applied & pre-fetch profile
  const loadCandidateProfile = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");
    if (!token || role !== "user") return;

    try {
      let candidateUserId = "";
      try {
        const decoded = jwtDecode(token);
        candidateUserId = decoded.id;
      } catch {
        return;
      }

      // Check existing application status for this job
      const appsRes = await fetchWithAuth(`/applyjob/user/${candidateUserId}`);
      if (appsRes.ok) {
        const apps = await appsRes.json();
        const applied = Array.isArray(apps) && apps.some((a) => (a.jobId?._id || a.jobId) === id);
        if (applied) {
          setHasApplied(true);
        }
      }

      // Fetch user personal data + candidate profile
      const [userRes, profileRes] = await Promise.all([
        fetchWithAuth(`/users/${candidateUserId}`),
        fetchWithAuth(`/profiles/me`),
      ]);

      let userData = {};
      let profileData = {};

      if (userRes.ok) {
        userData = await userRes.json();
      }
      if (profileRes.ok) {
        profileData = await profileRes.json();
      }

      const candidateName = userData.fullname || userData.name || "";
      const candidateEmail = userData.email || "";
      const candidatePhone = userData.phone || "";
      const candidateEdu = userData.education || "graduation";
      const candidateCourse = userData.course || "";
      const candidatePitch = profileData.bio || profileData.headline || "";

      setFormData((prev) => ({
        ...prev,
        fullname: candidateName,
        email: candidateEmail,
        phone: candidatePhone,
        education: candidateEdu,
        course: candidateCourse,
        description: candidatePitch,
      }));

      if (profileData.resumeUrl) {
        setExistingResumeInfo({
          url: profileData.resumeUrl,
          name: profileData.resumeOriginalName || "Profile_Resume.pdf",
        });
        setResumeMode("existing");
      } else {
        setResumeMode("upload");
      }

      if (candidateName || candidatePhone) {
        setIsAutoFilled(true);
      }
    } catch (err) {
      console.warn("Could not prefill candidate profile:", err);
    }
  }, [id]);

  useEffect(() => {
    loadCandidateProfile();
  }, [loadCandidateProfile]);

  const handleOpenApplyModal = async () => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    if (!token) {
      toast.info("Please sign in as a job seeker to apply for this vacancy.");
      navigate("/signin");
      return;
    }

    if (role === "company") {
      toast.warning("Employers cannot apply to job vacancies.");
      return;
    }

    if (hasApplied) {
      toast.info("You have already applied for this vacancy.");
      return;
    }

    // Refresh candidate profile & resume right before opening modal
    await loadCandidateProfile();
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("Resume file size must be less than 5MB.");
        return;
      }
      setFormData((prev) => ({ ...prev, resumeFile: file }));
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();

    if (!formData.fullname.trim()) {
      toast.warning("Please provide your full legal name.");
      return;
    }

    if (!formData.phone.trim() || !/^[0-9]{10}$/.test(formData.phone.trim())) {
      toast.warning("Please provide a valid 10-digit phone number.");
      return;
    }

    if (!formData.course.trim()) {
      toast.warning("Please specify your course / field of study.");
      return;
    }

    if (resumeMode === "upload" && !formData.resumeFile) {
      toast.warning("Please upload a resume file (PDF or DOCX).");
      return;
    }

    if (resumeMode === "existing" && !existingResumeInfo?.url) {
      toast.warning("No profile resume found. Please upload a resume file.");
      return;
    }

    try {
      setSubmitting(true);
      const dataPayload = new FormData();
      dataPayload.append("jobId", id);
      dataPayload.append("fullname", formData.fullname.trim());
      dataPayload.append("phone", formData.phone.trim());
      dataPayload.append("education", formData.education);
      dataPayload.append("course", formData.course.trim());
      dataPayload.append("description", formData.description.trim());

      if (resumeMode === "upload" && formData.resumeFile) {
        dataPayload.append("resume", formData.resumeFile);
      } else if (resumeMode === "existing" && existingResumeInfo?.url) {
        dataPayload.append("resumeUrl", existingResumeInfo.url);
      }

      const response = await fetchWithAuth("/applyjob/create", {
        method: "POST",
        body: dataPayload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      toast.success("Application submitted successfully! Recruiter has been notified. 🎉");
      setHasApplied(true);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Failed to submit application. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-gray-500">Loading vacancy details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Job Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">The requested vacancy is not available.</p>
        <Link
          to="/jobs"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-xs"
        >
          Browse All Vacancies
        </Link>
      </div>
    );
  }

  const companyLogo =
    job.company?.logo || "https://cdn-icons-png.flaticon.com/512/3237/3237472.png";
  const companyName = job.company?.name || "Hiring Partner";

  return (
    <div className="bg-slate-50 py-10 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Main Job Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <img
                className="w-16 h-16 rounded-xl object-contain p-2 bg-gray-50 border border-gray-100 shrink-0"
                src={companyLogo}
                alt={companyName}
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {job.title}
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                  <FaBuilding className="text-gray-400" />
                  <span className="font-semibold text-gray-800">{companyName}</span>
                  {job.company?.city && <span>• {job.company.city}</span>}
                </p>
              </div>
            </div>

            <div>
              {hasApplied ? (
                <div className="px-5 py-2.5 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-600" /> Application Submitted
                </div>
              ) : (
                <button
                  onClick={handleOpenApplyModal}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <FaPaperPlane /> Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-gray-100 text-xs">
            <div className="flex items-center gap-2.5 text-gray-700">
              <FaDollarSign className="text-emerald-500 text-base" />
              <div>
                <span className="text-gray-400 block text-2xs uppercase font-bold">Salary</span>
                <span className="font-bold text-gray-900">${Number(job.salary || 0).toLocaleString()} / yr</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-gray-700">
              <FaMapMarkerAlt className="text-blue-500 text-base" />
              <div>
                <span className="text-gray-400 block text-2xs uppercase font-bold">Location</span>
                <span className="font-bold text-gray-900 capitalize">{job.location || "Remote"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-gray-700">
              <FaBriefcase className="text-indigo-500 text-base" />
              <div>
                <span className="text-gray-400 block text-2xs uppercase font-bold">Employment</span>
                <span className="font-bold text-gray-900">{job.jobType || "Full-Time"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-gray-700">
              <FaClock className="text-amber-500 text-base" />
              <div>
                <span className="text-gray-400 block text-2xs uppercase font-bold">Experience</span>
                <span className="font-bold text-gray-900 capitalize">{job.experience || "Fresher"}</span>
              </div>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="pt-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Role Overview</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {Array.isArray(job.skills) && job.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Key Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-semibold border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Core Responsibilities
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(job.requirements) && job.requirements.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Candidate Qualifications & Requirements
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AUTO-FILLED APPLICATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Apply for {job.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Application will be directly submitted to {companyName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Auto-fill notification badge */}
            {isAutoFilled && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs text-blue-800">
                <FaCheckCircle className="text-blue-600 shrink-0 text-sm" />
                <span>
                  <strong>Auto-filled from your profile.</strong> You can review or modify any details before submitting.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <FaUser className="text-gray-400 text-2xs" /> Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <FaPhone className="text-gray-400 text-2xs" /> Phone (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Education Level & Degree/Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <FaGraduationCap className="text-gray-400 text-2xs" /> Highest Education *
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none bg-white"
                  >
                    <option value="diploma">Diploma</option>
                    <option value="graduation">Graduation (Bachelor&apos;s)</option>
                    <option value="post-graduation">Post-Graduation (Master&apos;s / PhD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Degree / Course Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Resume Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Resume Attachment *
                </label>

                {existingResumeInfo ? (
                  <div className="space-y-2 border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="resumeChoice"
                        checked={resumeMode === "existing"}
                        onChange={() => setResumeMode("existing")}
                        className="text-blue-600"
                      />
                      <span className="font-semibold text-gray-800">
                        Use profile resume:
                      </span>
                      <span className="text-blue-600 font-mono text-2xs flex items-center gap-1">
                        <FaFileAlt /> {existingResumeInfo.name}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="resumeChoice"
                        checked={resumeMode === "upload"}
                        onChange={() => setResumeMode("upload")}
                        className="text-blue-600"
                      />
                      <span className="font-semibold text-gray-800">
                        Upload a different resume for this application
                      </span>
                    </label>

                    {resumeMode === "upload" && (
                      <div className="pt-2">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-lg p-2"
                    />
                    <p className="text-2xs text-gray-400 mt-1">
                      Upload PDF, DOC, or DOCX document up to 5MB.
                    </p>
                  </div>
                )}
              </div>

              {/* Pitch / Cover Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cover Note / Pitch to Recruiter (Optional)
                </label>
                <textarea
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Share a brief overview of why you are a strong fit for this opportunity..."
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center gap-2 shadow-xs"
                >
                  {submitting ? (
                    <>Submitting Application...</>
                  ) : (
                    <>
                      <FaPaperPlane /> Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
