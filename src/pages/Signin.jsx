import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Bgimg from "../assets/loginpng.png";
import { Login, Placeholder } from "../utils/common";
import { jwtDecode } from "jwt-decode";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [activeTab, setActiveTab] = useState("user");

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
      const url = activeTab === "company" ? "http://localhost:3000/companies/signin" : "http://localhost:3000/users/signin";
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
        localStorage.setItem("authToken", token);
        localStorage.setItem("role", role);

        toast.success("Login successful!");
        navigate(role === "user" ? "/" : "/company");
      } else {
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error(`Something went wrong: ${error.message || "Please try again later."}`);
    }
  };

  return (
    <div className="bg-white flex justify-center items-center">
      <div className="w-1/2 hidden lg:block bg-blue-500 h-screen">
        <img src="https://img.freepik.com/free-photo/positive-business-executives-laughing-while-reading-contract_1262-18019.jpg?t=st=1743082276~exp=1743085876~hmac=dd7c103203899dff6702513513bb00d0aed37b4edc6a31a1b07f0203fd2d664b&w=996" className="object-cover h-full" />
      </div>
      <div className="p-10 w-full flex justify-center lg:w-1/2">
        <div className="bg-white p-10 rounded-lg shadow-xl border w-full max-w-md">
          <h2 className="text-3xl font-bold text-blue-500 text-center mb-6">Sign In</h2>
          <div className="flex justify-around mb-6 gap-2">
            <button 
              className={`px-4 py-2 rounded-lg w-1/2 ${activeTab === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
              onClick={() => setActiveTab("user")}
            >
              User
            </button>
            <button 
              className={`px-4 py-2 rounded-lg w-1/2 ${activeTab === "company" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
              onClick={() => setActiveTab("company")}
            >
              Company
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block font-medium">Email</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" 
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium">Password</label>
              <input 
                type="password" 
                id="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" 
              />
            </div>
            <p className="pb-2 text-center">
              Haven't created an account? 
              <span className="text-blue-500 font-bold cursor-pointer" onClick={() => activeTab=="user"? navigate("/signup"): navigate ("/company/signup")}>
                Sign Up
              </span>
            </p>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
