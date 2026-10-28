import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "../utils/api";
import { toast } from "react-toastify";
import { FaBuilding, FaCamera, FaLock } from "react-icons/fa";

const CompanyMyProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    slogan: "",
    description: "",
    address: "",
    city: "",
    companySize: "",
    logo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("authToken");
  let companyId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      companyId = decoded.id;
    } catch {
      companyId = null;
    }
  }

  const fetchCompanyData = useCallback(async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const res = await fetchWithAuth(`/companies/${companyId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch employer profile");
      }
      const data = await res.json();
      setFormData({
        name: data.name || "",
        email: data.email || "",
        slogan: data.slogan || "",
        description: data.description || "",
        address: data.address || "",
        city: data.city || "",
        companySize: data.companySize || "",
        logo: data.logo || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load company profile");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // Direct backend logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Logo image must be less than 5MB.");
      return;
    }

    try {
      setUploadingLogo(true);
      const uploadData = new FormData();
      uploadData.append("logo", file);

      const res = await fetchWithAuth(`/companies/${companyId}`, {
        method: "PATCH",
        body: uploadData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update company logo");
      }

      const updated = await res.json();
      setFormData((prev) => ({ ...prev, logo: updated.logo }));
      toast.success("Company logo updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId) return;

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        slogan: formData.slogan,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        companySize: formData.companySize,
      };

      const res = await fetchWithAuth(`/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save company information");
      }

      toast.success("Company profile details updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast.warning("Please enter your current password.");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.warning("New password must be at least 8 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetchWithAuth(`/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          password: passwords.newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update password");
      }

      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully!");
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

  const defaultLogo = "https://cdn-icons-png.flaticon.com/512/3237/3237472.png";

  return (
    <div className="space-y-8">
      {/* Header Profile Card */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
        <div className="relative group shrink-0">
          <img
            src={formData.logo || defaultLogo}
            alt="Company Logo"
            className="w-24 h-24 rounded-2xl object-contain p-2 bg-gray-50 border-2 border-gray-200 shadow-xs"
          />
          <label
            htmlFor="company-logo-upload"
            className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col items-center justify-center text-white text-2xs opacity-0 group-hover:opacity-100 transition cursor-pointer font-bold text-center p-1"
          >
            <FaCamera className="text-base mb-0.5" />
            <span>{uploadingLogo ? "Uploading..." : "Change Logo"}</span>
          </label>
          <input
            id="company-logo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploadingLogo}
            onChange={handleLogoUpload}
          />
        </div>

        <div className="text-center sm:text-left flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {formData.name || "Company Name"}
          </h2>
          <p className="text-sm font-medium text-blue-600 mt-0.5">
            {formData.slogan || "Employer Workspace"}
          </p>
          <p className="text-xs text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
            <FaBuilding className="text-gray-400" />
            <span>{formData.email}</span>
            {formData.city && <span>• 📍 {formData.city}</span>}
          </p>
        </div>
      </div>

      {/* Main Details Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Work Email (Account ID)
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full text-xs border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Company Slogan / Tagline
          </label>
          <input
            type="text"
            name="slogan"
            value={formData.slogan}
            onChange={handleChange}
            placeholder="e.g. Innovating the future of cloud computing"
            className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Company Description & Mission
          </label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Introduce your organization to prospective candidates..."
            className="w-full text-xs border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Headquarters Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Tech Blvd"
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="San Francisco"
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Company Size
            </label>
            <select
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none bg-white"
            >
              <option value="">Select Company Size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition disabled:opacity-50 shadow-xs"
          >
            {saving ? "Saving Changes..." : "Save Company Profile"}
          </button>
        </div>
      </form>

      {/* Password Management */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
          <FaLock className="text-gray-400" /> Update Password
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Ensure your account stays protected by using a strong password.
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              New Password (min 8 characters)
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyMyProfile;
