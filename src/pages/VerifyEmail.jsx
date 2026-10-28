import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Missing verification token.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Email verification failed or token expired.");
        }
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMessage(err.message);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h2 className="text-xl font-bold text-gray-900">Verifying Your Email...</h2>
            <p className="text-xs text-gray-500">Please wait while we validate your activation token.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl">
              <FaCheckCircle />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="text-xs text-gray-600">
              Your email address has been verified successfully. Your account is fully active and ready to use.
            </p>
            <div className="pt-2">
              <Link
                to="/signin"
                className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition"
              >
                Sign In to Your Account
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-2xl">
              <FaExclamationCircle />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-xs text-rose-600 font-medium">
              {errorMessage || "The verification link is invalid or has expired."}
            </p>
            <div className="pt-2">
              <Link
                to="/signin"
                className="inline-block px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-xl transition"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
