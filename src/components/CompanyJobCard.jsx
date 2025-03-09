import { useState } from "react";
import { toast } from "react-toastify";

const CompanyJobCard = ({ job }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [applications, setApplications] = useState([]);

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

    const fetchApplications = async () => {
        try {
            const response = await fetch(`http://localhost:3000/applyjob/job/${job._id}`);
            console.log(response);
            if (!response.ok) throw new Error("Failed to fetch applications");
            const data = await response.json();
            console.log(data);
            setApplications(data);
            setIsModalOpen(true);
        } catch (error) {
            toast.error("Error fetching applications");
        }
    };


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
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
            <h3 className="text-2xl font-semibold text-gray-900">{job.title}</h3>
            <p className="text-gray-700 mt-2">{job.description}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-gray-600 text-sm">
                <span className="flex items-center gap-1 font-medium">
                    💰 Salary: <span className="text-gray-800">${job.salary}</span>
                </span>
                <span className="flex items-center gap-1 font-medium">
                    🏆 Experience: <span className="text-gray-800">{job.experience}</span>
                </span>
                <span className="flex items-center gap-1 font-medium">
                    🏢 Company: <span className="text-gray-800">{job.companyName}</span>
                </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    onClick={handleDelete}
                    className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition"
                >
                    Delete
                </button>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition"
                >
                    Update
                </button>
                <button
                    onClick={fetchApplications}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
                >
                    View Applications
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-xl font-bold mb-4">Applications</h2>
                        <button className="text-gray-600" onClick={() => setIsModalOpen(false)}>✕</button>
                        {applications.length > 0 ? (
                            applications.map((app) => (
                                <div key={app._id} className="p-4 border-b border-gray-300">
                                    <p><strong>Name:</strong> {app.fullname}</p>
                                    <p><strong>Phone:</strong> {app.phone}</p>
                                    <p><strong>Course:</strong> {app.course}</p>
                                    <p><strong>Education:</strong> {app.education}</p>
                                    <p><strong>Resume:</strong> <a href={app.resumeUrl} className="text-blue-500" target="_blank">View</a></p>
                                </div>
                            ))
                        ) : (
                            <p>No applications found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyJobCard;
