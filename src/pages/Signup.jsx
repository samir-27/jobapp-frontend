import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Bgimg from "../assets/loginpng.png";
import { signup, Placeholder } from "../utils/common.js";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
 
 
    const handleSubmit = async (e, type) => {
        e.preventDefault();
        try {
            const url = type === "company"
                ? 'http://localhost:3000/companies/signup'
                : 'http://localhost:3000/users/signup';

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (!response.ok) {
                if (data.message?.includes("E11000 duplicate key error")) {
                    toast.error("Username or email already exists. Please try a different one.");
                } else {
                    toast.error(data.message || "Signup failed. Please try again.");
                }
                return;
            }

            toast.success(data.message);
            navigate("/signin");
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error(`Something went wrong: ${error.message || "Please try again later."}`);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };
    

    const handleSignin = () => {
        navigate('/signin');
        setFormData({ username: '', name: '', email: '', password: '' });

    };

    return (
        <div>
            <div className="bg-indigo-50 flex justify-center items-center border">
                {/* Image Section */}
                <div className="w-1/2 h-92vh hidden lg:block bg-indigo-100">
                    <img
                        src={Bgimg}
                        className="object-contain w-full h-full"
                    />
                </div>
                {/* Form Section */}
                <div className="p-8 w-full flex justify-center lg:w-1/2">
                    <div className="bg-white p-8 rounded-lg shadow-xl border b max-w-sm w-full">
                        <h2 className="text-2xl font-bold text-black text-center mb-6">Sign Up</h2>
                        <form>
                            {/* <div className="mb-4">
                                <label
                                    htmlFor={isCompany ? "name" : "username"}
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    {signup.name}
                                </label>
                                <input
                                    type="text"
                                    id={isCompany ? "name" : "username"}
                                    name={isCompany ? "name" : "username"}
                                    placeholder={Placeholder.name}
                                    className="w-full px-4 py-2 border-2 border-gray-400 focus:border-indigo-500 focus:outline-none rounded-md shadow-sm text-gray-900"
                                    value={isCompany ? formData.name : formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div> */}
                            <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                {signup.name}
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder={Placeholder.name}
                                className="w-full px-4 py-2 border-2 border-gray-400 focus:border-indigo-500 focus:outline-none rounded-md shadow-sm text-gray-900"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {/* {console.log(isCompany)}
                        {isCompany ? <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                {signup.name}
                            </label>
                           { console.log("second",isCompany)}
                           { console.log("third",formData)}
                            <input
                                type="text"
                                id="name"
                                placeholder={Placeholder.name}
                                className="w-full px-4 py-2 border-2 border-gray-400 focus:border-indigo-500 focus:outline-none rounded-md shadow-sm text-gray-900"
                             
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>:
                        <div className="mb-4">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {signup.name}
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder={Placeholder.name}
                            className="w-full px-4 py-2 border-2 border-gray-400 focus:border-indigo-500 focus:outline-none rounded-md shadow-sm text-gray-900"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                        }
      */}
                         

                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    {signup.email}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder={Placeholder.email}
                                    className="w-full px-4 py-2 border-2 border-gray-400 focus:border-indigo-500 focus:outline-none rounded-md shadow-sm text-gray-900"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    {signup.password}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder={Placeholder.password}
                                    className="w-full px-4 py-2 border-2 border-gray-400 focus:border-indigo-500 focus:outline-none rounded-md shadow-sm text-gray-900"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <p className="pb-2">
                                Already have an account?{" "}
                                <span className="text-indigo-500 font-bold cursor-pointer" onClick={handleSignin}>
                                    Sign In
                                </span>
                            </p>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                      
                                        handleSubmit(e, "user");
                                    }}
                                    className="w-1/2 bg-indigo-700      text-white py-2 rounded-md hover:bg-indigo-800 shadow-md transition"
                                >
                                    User Sign Up
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                   
                                        handleSubmit(e, "company");
                                    }}
                                    className="w-1/2 bg-green-700 text-white py-2 rounded-md hover:bg-green-800 shadow-md transition"
                                >
                                    Company Sign Up
                                </button>


                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
