import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/api";
import { FaLock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to reset password");
      }

      setSuccess(true);
      toast.success("Password updated successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <FaExclamationTriangle className="mx-auto text-4xl text-amber-500 mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-xs text-gray-500 mb-6">
            The password reset link is invalid or has expired. Please request a new link from the sign-in page.
          </p>
          <Link
            to="/signin"
            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center text-xl mb-3">
            <FaLock />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
          <p className="text-xs text-gray-500 mt-1">
            Choose a secure password for your recruitment portal account.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
              <FaCheckCircle className="mx-auto text-3xl text-emerald-500 mb-2" />
              <strong>Password Reset Successful!</strong>
              <p className="mt-1">
                Your credentials have been securely updated. You can now log into your account.
              </p>
            </div>
            <button
              onClick={() => navigate("/signin")}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                New Password (minimum 8 characters)
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition disabled:opacity-50"
            >
              {submitting ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
