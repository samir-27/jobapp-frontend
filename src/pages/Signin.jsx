import { useState } from "react";
import { API_BASE_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [activeTab, setActiveTab] = useState("user");
  const [submitting, setSubmitting] = useState(false);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSending, setForgotSending] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // Use standard auth/login endpoint or role-specific signin
      const url =
        activeTab === "company"
          ? `${API_BASE_URL}/companies/signin`
          : `${API_BASE_URL}/users/signin`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        const token = data.token || data.accessToken;
        const decodedToken = jwtDecode(token);
        const role = decodedToken.type || decodedToken.role || activeTab;

        localStorage.setItem("authToken", token);
        localStorage.setItem("role", role);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        toast.success("Login successful!");
        navigate(role === "user" ? "/" : "/company/postedjobs");
      } else {
        toast.error(data.message || "Login failed. Please verify your credentials.");
      }
    } catch (error) {
      toast.error(`Something went wrong: ${error.message || "Please try again later."}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.warning("Please enter your account email address.");
      return;
    }

    try {
      setForgotSending(true);
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail.trim().toLowerCase(),
          accountType: activeTab,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to process password reset request");
      }

      setForgotSent(true);
      toast.success("Password reset instructions dispatched!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setForgotSending(false);
    }
  };

  return (
    <div className="bg-white flex justify-center items-center min-h-[85vh]">
      <div className="w-1/2 hidden lg:block bg-blue-500 h-screen">
        <img
          src="https://img.freepik.com/free-photo/positive-business-executives-laughing-while-reading-contract_1262-18019.jpg?t=st=1743082276~exp=1743085876~hmac=dd7c103203899dff6702513513bb00d0aed37b4edc6a31a1b07f0203fd2d664b&w=996"
          alt="Recruitment Portal"
          className="object-cover h-full w-full"
        />
      </div>

      <div className="p-10 w-full flex justify-center lg:w-1/2">
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-500 text-center mb-6">
            Sign in to access your recruitment portal
          </p>

          <div className="flex justify-around mb-6 gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-semibold rounded-lg w-1/2 transition ${
                activeTab === "user"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("user")}
            >
              Candidate
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-semibold rounded-lg w-1/2 transition ${
                activeTab === "company"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("company")}
            >
              Employer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="name@example.com"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotSent(false);
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50 shadow-xs"
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>

            <p className="pt-2 text-center text-xs text-gray-600">
              Haven&apos;t created an account yet?{" "}
              <button
                type="button"
                className="text-blue-600 font-bold hover:underline"
                onClick={() =>
                  navigate(activeTab === "user" ? "/signup" : "/company/signup")
                }
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Reset Your Password
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter your registered email address and we will dispatch a secure link to reset your account credentials.
            </p>

            {forgotSent ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs leading-relaxed">
                  ✓ If an account is registered with <strong>{forgotEmail}</strong>, you will receive an email shortly with instructions to reset your password.
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Account Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs text-gray-600 hover:text-gray-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotSending}
                    className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {forgotSending ? "Dispatching Link..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
