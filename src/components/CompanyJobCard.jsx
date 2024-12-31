import { useState } from "react";
import { toast } from "react-toastify";

const CompanyJobCard = ({ job }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: job.title,
        description: job.description,
        role: job.role,
        skills: job.skills || [],
        salary: job.salary,
        experience: job.experience,
        location: job.location,
        companyName: job.companyName,
        jobType: job.jobType,
        responsibilities: job.responsibilities || [],
        requirements: job.requirements || [],
        niceToHave: job.niceToHave || [],
    });

    const [skillInputValue, setSkillInputValue] = useState("");
    const [requirementInputValue, setRequirementInputValue] = useState("");
    const [responsibilityInputValue, setResponsibilityInputValue] = useState("");
    const [niceToHaveInputValue, setNiceToHaveInputValue] = useState("");

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/jobs/${job._id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Job deleted successfully.");
            } else {
                toast.error("Failed to delete the job.");
            }
        } catch (error) {
            toast.error("Error: Unable to delete the job.");
            console.error("Error:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/jobs/${job._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            toast.success("Job updated successfully.");
            setIsEditing(false); // Close form on success
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddSkill = () => {
        if (skillInputValue.trim() !== "") {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, skillInputValue.trim()],
            }));
            setSkillInputValue("");
        }
    };

    const handleAddRequirement = () => {
        if (requirementInputValue.trim() !== "") {
            setFormData((prev) => ({
                ...prev,
                requirements: [...prev.requirements, requirementInputValue.trim()],
            }));
            setRequirementInputValue("");
        }
    };

    const handleAddResponsibility = () => {
        if (responsibilityInputValue.trim() !== "") {
            setFormData((prev) => ({
                ...prev,
                responsibilities: [...prev.responsibilities, responsibilityInputValue.trim()],
            }));
            setResponsibilityInputValue("");
        }
    };

    const handleAddNiceToHave = () => {
        if (niceToHaveInputValue.trim() !== "") {
            setFormData((prev) => ({
                ...prev,
                niceToHave: [...prev.niceToHave, niceToHaveInputValue.trim()],
            }));
            setNiceToHaveInputValue("");
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 m-2">
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <p className="text-gray-600 mt-2">{job.description}</p>
            <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-gray-700">Salary: ${job.salary}</span>
                <span className="ml-4 text-sm font-medium text-gray-700">Experience: {job.experience}</span>
                <span className="ml-4 text-sm font-medium text-gray-700">Company: {job.companyName}</span>
            </div>
            <div className="flex gap-5">
                <button
                    onClick={handleDelete}
                    className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500"
                >
                    Delete
                </button>
                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-400"
                >
                    Update
                </button>
            </div>
            {isEditing && (
                <form onSubmit={handleUpdate} className="mt-6">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
                        <input
                            type="text"
                            id="salary"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                        <input
                            type="text"
                            id="role"
                            name="eolw"
                            value={formData.role}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
                        <select
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select...</option>
                            <option value="fresher">Fresher</option>
                            <option value="1-3years">1-3 years</option>
                            <option value="3-5years">3-5 years</option>
                            <option value="5-10years">5-10 years</option>
                            <option value="10-20years">10-20 years</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <select
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select...</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="on-site">On-site</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">Job Type</label>
                        <select
                            id="jobType"
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select...</option>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 px-6 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-400"
                    >
                        Save
                    </button>
                </form>
            )}
        </div>
    );
};

export default CompanyJobCard;