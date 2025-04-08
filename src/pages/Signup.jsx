import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Bgimg from "../assets/loginpng.png";
import { signup, Placeholder } from "../utils/common.js";

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        fullname: '',
        phone: '',
        education: '',
        course: '',
        address: '',
        city: '',
        pincode: '',
        state: ''
    });
    const [errors, setErrors] = useState({});

    const validateField = (id, value) => {
        let error = "";
        if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Invalid email format";
        }
        if (id === "password" && !/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)) {
            error = "Password must be at least 8 characters long and include at least one letter and one number";
        }
        setErrors({ ...errors, [id]: error });
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        validateField(id, value);
    };

    const validateStep = () => {
        if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
            toast.error("Name, Email, and Password are required.");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Signup failed.");
                return;
            }
            toast.success("Signup successful!");
            navigate("/signin");
        } catch (error) {
            toast.error(`Something went wrong: ${error.message || "Try again later."}`);
        }
    };

    return (
        <div className="bg-white flex justify-center items-center h-screen">
            <div className="w-1/2 hidden lg:block bg-blue-500 h-full">
                <img src={Bgimg} className="object-cover w-full h-full" />
            </div>
            <div className="p-10 w-full flex justify-center lg:w-1/2">
                <div className="bg-white p-10 rounded-lg shadow-xl border w-full max-w-md">
                    <h2 className="text-3xl font-bold text-blue-500 text-center mb-6">Sign Up</h2>
                    <form>
                        {step === 1 && (
                            <>
                                <div className="mb-6">
                                    <label className="block font-medium">Name</label>
                                    <input type="text" id="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" />
                                </div>
                                <div className="mb-6">
                                    <label className="block font-medium">Email</label>
                                    <input type="email" id="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                                <div className="mb-6">
                                    <label className="block font-medium">Password</label>
                                    <input type="password" id="password" value={formData.password} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" />
                              
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="mb-6">
                                    <label className="block font-medium">Full Name</label>
                                    <input type="text" id="fullname" value={formData.fullname} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" />
                                </div>
                                <div className="mb-6">
                                    <label className="block font-medium">Phone</label>
                                    <input type="text" id="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" />
                                </div>
                                <div className="mb-6">
                                    <label className="block font-medium" htmlFor="education">Education</label>
                                    <select
                                        id="education"
                                        value={formData.education}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none"
                                        name="education"
                                    >
                                        <option value="" disabled>Select education level</option>
                                        <option value="diploma">Diploma</option>
                                        <option value="graduation">Graduation</option>
                                        <option value="post-graduation">Post-Graduation</option>
                                    </select>
                                </div>

                                <div className="mb-6">
                                    <label className="block font-medium">Course</label>
                                    <input type="text" id="course" value={formData.course} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" />
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div className="mb-6">
                                    <label className="block font-medium">Address</label>
                                    <input type="text" id="address" value={formData.address} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" />
                                </div>
                                <div className="mb-6">
                                    <label className="block font-medium">Pincode</label>
                                    <input type="text" id="pincode" value={formData.pincode} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" />
                                </div>
                                <div className="mb-6">
                                    <label className="block font-medium">city</label>
                                    <input type="text" id="city" value={formData.city} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" />
                                </div>
                                <div className="mb-6">
                                    <label className="block font-medium">State</label>
                                    <input type="text" id="state" value={formData.state} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:border-blue-500 focus:outline-none" />
                                </div>
                            </>
                        )}

                        <div className="flex justify-between mt-6">
                            {step > 1 && <button type="button" onClick={handleBack} className="px-6 py-2 bg-gray-300 rounded-lg">Back</button>}
                            {step < 3 && <button type="button" onClick={handleNext} className="px-6 py-2 bg-blue-500 text-white rounded-lg">Next</button>}
                            {step === 3 && <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-green-500 text-white rounded-lg">Submit</button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;