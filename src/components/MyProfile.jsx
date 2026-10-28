import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "../utils/api";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'personal' | 'resume' | 'security'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // User entity state
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    fullname: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    education: "",
    course: "",
    profileImg: "",
  });

  // Profile entity state (/profiles/me)
  const [profileData, setProfileData] = useState({
    headline: "",
    bio: "",
    skills: [],
    workPreference: "any",
    expectedSalary: "",
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
    },
    resumeUrl: "",
    resumeOriginalName: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("authToken");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch {
      // Ignore
    }
  }

  const loadAllData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const [userRes, profileRes] = await Promise.all([
        fetchWithAuth(`/users/${userId}`),
        fetchWithAuth(`/profiles/me`),
      ]);

      if (userRes.ok) {
        const u = await userRes.json();
        setUserData({
          name: u.name || "",
          email: u.email || "",
          fullname: u.fullname || "",
          phone: u.phone || "",
          address: u.address || "",
          city: u.city || "",
          pincode: u.pincode || "",
          state: u.state || "",
          education: u.education || "",
          course: u.course || "",
          profileImg: u.profileImg || "",
        });
      }

      if (profileRes.ok) {
        const p = await profileRes.json();
        setProfileData({
          headline: p.headline || "",
          bio: p.bio || "",
          skills: Array.isArray(p.skills) ? p.skills : [],
          workPreference: p.workPreference || "any",
          expectedSalary: p.expectedSalary || "",
          socialLinks: {
            linkedin: p.socialLinks?.linkedin || "",
            github: p.socialLinks?.github || "",
            portfolio: p.socialLinks?.portfolio || "",
          },
          resumeUrl: p.resumeUrl || "",
          resumeOriginalName: p.resumeOriginalName || "",
        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handle skill addition
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !profileData.skills.includes(trimmed)) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Save Professional Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        headline: profileData.headline,
        bio: profileData.bio,
        skills: profileData.skills,
        workPreference: profileData.workPreference,
        expectedSalary: profileData.expectedSalary
          ? Number(profileData.expectedSalary)
          : undefined,
        socialLinks: profileData.socialLinks,
      };

      const res = await fetchWithAuth("/profiles/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
      }

      toast.success("Professional profile updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Save Personal Details
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Strip non-whitelisted fields so contact update payload has only allowed fields
      const contactPayload = { ...userData };
      delete contactPayload.email;
      delete contactPayload.profileImg;
      delete contactPayload._id;
      delete contactPayload.id;

      const res = await fetchWithAuth(`/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update personal details");
      }

      toast.success("Personal information updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle Profile Image Upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Profile photo must be less than 5MB.");
      return;
    }

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("profileImg", file);

      const res = await fetchWithAuth(`/users/${userId}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to upload profile photo");
      }

      const updated = await res.json();
      setUserData((prev) => ({
        ...prev,
        profileImg: updated.profileImg,
      }));
      toast.success("Profile photo updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle Resume Upload
  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.warning("Please choose a PDF, DOC, or DOCX resume file first");
      return;
    }

    try {
      setUploadingResume(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const res = await fetchWithAuth("/profiles/resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to upload resume");
      }

      const updated = await res.json();
      setProfileData((prev) => ({
        ...prev,
        resumeUrl: updated.resumeUrl,
        resumeOriginalName: updated.resumeOriginalName || resumeFile.name,
      }));
      setResumeFile(null);
      toast.success("Resume uploaded and secured successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploadingResume(false);
    }
  };

  // Handle Password Change
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setSaving(true);
      const res = await fetchWithAuth(`/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          password: passwords.newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Password update failed");
      }

      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      {/* Profile Header Card */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 mb-6">
        <div className="relative group shrink-0">
          <img
            src={userData.profileImg || "https://i.pinimg.com/564x/05/5a/91/055a91979264664a1ee12b9453610d82.jpg"}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-sm"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white text-2xs opacity-0 group-hover:opacity-100 transition cursor-pointer font-bold text-center p-1"
          >
            <span className="text-base">📷</span>
            <span>{uploadingAvatar ? "Uploading..." : "Change Photo"}</span>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploadingAvatar}
            onChange={handleProfileImageUpload}
          />
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {userData.fullname || userData.name || "Candidate Name"}
          </h2>
          <p className="text-sm font-medium text-blue-600 mt-0.5">
            {profileData.headline || "No professional headline added yet"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {userData.email} {userData.city ? `• 📍 ${userData.city}, ${userData.state}` : ""}
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === "profile"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Professional Summary & Skills
        </button>
        <button
          onClick={() => setActiveTab("resume")}
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === "resume"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Resume Attachment
        </button>
        <button
          onClick={() => setActiveTab("personal")}
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === "personal"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Personal & Contact Details
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
            activeTab === "security"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Account Security
        </button>
      </div>

      {/* TAB 1: Professional Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              value={profileData.headline}
              onChange={(e) =>
                setProfileData({ ...profileData, headline: e.target.value })
              }
              placeholder="e.g. Senior Frontend Engineer | React & TypeScript"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              maxLength={150}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              About & Executive Bio
            </label>
            <textarea
              rows={4}
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              placeholder="Brief summary of your professional expertise, leadership, and accomplishments..."
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              maxLength={2000}
            />
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Core Skills & Technologies
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. Node.js, Docker, MongoDB)"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profileData.skills.length === 0 ? (
                <span className="text-xs text-gray-400 italic">
                  No skills listed. Adding skills improves candidate job matching.
                </span>
              ) : (
                profileData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-500 hover:text-red-500 font-bold ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Work Preference
              </label>
              <select
                value={profileData.workPreference}
                onChange={(e) =>
                  setProfileData({ ...profileData, workPreference: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="any">Any Work Mode</option>
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Expected Annual Salary ($)
              </label>
              <input
                type="number"
                value={profileData.expectedSalary}
                onChange={(e) =>
                  setProfileData({ ...profileData, expectedSalary: e.target.value })
                }
                placeholder="e.g. 120000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                min={0}
              />
            </div>
          </div>

          {/* Social / Portfolio Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={profileData.socialLinks.linkedin}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    socialLinks: {
                      ...profileData.socialLinks,
                      linkedin: e.target.value,
                    },
                  })
                }
                placeholder="https://linkedin.com/in/..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={profileData.socialLinks.github}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    socialLinks: {
                      ...profileData.socialLinks,
                      github: e.target.value,
                    },
                  })
                }
                placeholder="https://github.com/..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Portfolio / Website
              </label>
              <input
                type="url"
                value={profileData.socialLinks.portfolio}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    socialLinks: {
                      ...profileData.socialLinks,
                      portfolio: e.target.value,
                    },
                  })
                }
                placeholder="https://myportfolio.dev"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Professional Profile"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Resume Manager */}
      {activeTab === "resume" && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <h4 className="text-sm font-bold text-blue-900">
                Primary Candidate Resume
              </h4>
              <p className="text-xs text-blue-700 mt-0.5">
                Uploaded resumes are stored in authenticated Cloudinary storage and made available securely to recruiters when you apply.
              </p>
            </div>
          </div>

          {profileData.resumeUrl ? (
            <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {profileData.resumeOriginalName || "Current Candidate Resume.pdf"}
                </p>
                <p className="text-xs text-green-600 font-medium mt-0.5">
                  ✓ Resume active on profile
                </p>
              </div>

              <a
                href={profileData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
              >
                View / Download
              </a>
            </div>
          ) : (
            <div className="p-6 border border-dashed border-gray-300 rounded-xl text-center text-gray-500 text-sm">
              No resume currently attached to your profile.
            </div>
          )}

          <form onSubmit={handleUploadResume} className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Upload New Resume (PDF, DOC, DOCX up to 10MB)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={!resumeFile || uploadingResume}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition disabled:opacity-50"
            >
              {uploadingResume ? "Uploading to Cloudinary..." : "Upload & Save Resume"}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Personal & Contact */}
      {activeTab === "personal" && (
        <form onSubmit={handleSavePersonal} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Username / Display Name
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                value={userData.fullname}
                onChange={(e) =>
                  setUserData({ ...userData, fullname: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-3 py-2 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone Number (10 digits)
              </label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                maxLength={10}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={userData.city}
                onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                State / Province
              </label>
              <input
                type="text"
                value={userData.state}
                onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Pincode / Postal
              </label>
              <input
                type="text"
                value={userData.pincode}
                onChange={(e) =>
                  setUserData({ ...userData, pincode: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                maxLength={6}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Contact Info"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: Security */}
      {activeTab === "security" && (
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              New Password (min. 8 characters)
            </label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default MyProfile;
