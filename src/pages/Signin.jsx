import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Bgimg from "../assets/loginpng.png";
import { Login, Placeholder } from "../utils/common"
import { jwtDecode } from "jwt-decode";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    try {
      const url = type === "company" ? "http://localhost:3000/companies/signin" : "http://localhost:3000/users/signin";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const decodedToken = jwtDecode(token);
        const role = decodedToken.type;
        console.log(`Token: ${token}, Role: ${role}`);
      
        localStorage.setItem("authToken", token);
        localStorage.setItem("role", role);
      
        toast.success("Login successful!");
        if(role=="user"){
          navigate("/home");
        }else{
          navigate("/company")
        }

      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }

    } catch (error) {
      console.error("Error during login:", error);
      toast.error(`Something went wrong: ${error.message || "Please try again later."}`);
    }
  };


  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="bg-indigo-50 flex justify-center items-center">
      {/* Image Section */}
      <div className="w-1/2 h-screen hidden lg:block bg-indigo-100">
        <img
          src={Bgimg}
          alt="Illustration"
          className="object-contain w-full h-full"
        />
      </div>

      {/* Form Section */}
      <div className="p-8 w-full flex justify-center lg:w-1/2">
        <div className="bg-white p-8 rounded-lg shadow-xl border max-w-sm w-full">
          <h2 className="text-2xl font-bold text-black text-center mb-6">Login</h2>
          <form>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {Login.email}            </label>
              <input
                type="email"
                id="email"
                placeholder={Placeholder.email}
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-400 focus:border-indigo-500 focus:outline-none rounded-md shadow-sm text-gray-900"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {Login.password}
              </label>
              <input
                type="password"
                id="password"
                placeholder={Placeholder.password}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border-2 border-gray-400 focus:border-indigo-500 focus:outline-none rounded-md shadow-sm text-gray-900"
                required
              />
            </div>

            {/* Signup Redirect */}
            <p className="pb-2">
              Haven&apos;t created an account?{" "}
              <span
                className="text-indigo-500 font-bold cursor-pointer"
                onClick={handleSignupRedirect}
              >
                Sign Up
              </span>
            </p>

            {/* Submit Button */}
            <div className="flex gap-5">

            <button
              type="button"
              onClick={(e) => {
                
                handleSubmit(e, "user");
              }}
              className="w-1/2 bg-indigo-700   text-white py-2 rounded-md hover:bg-indigo-800 shadow-md transition"
              >
              User Sign In
            </button>
            <button
              type="button"
              onClick={(e) => {
                handleSubmit(e, "company");
              
              }}
              className="w-1/2 bg-green-700 text-white py-2 rounded-md hover:bg-green-800 shadow-md transition"
              >
              Company Sign In
            </button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;