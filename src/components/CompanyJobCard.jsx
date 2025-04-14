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
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    onClick={handleDelete}
                    className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-500 transition"
                >
                    Delete
                </button>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
                >
                    Update
                </button>
                <button
                    onClick={fetchApplications}
                    className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
                >
                    View Applications
                </button>
            </div>
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-2xl relative p-6">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">

                            <form onSubmit={handleUpdate} className="mt-6">
                                <div className="mb-4">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="mt-1 block w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                {/* <div className="mb-4">
                        <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div> */}
                                <div className="mb-4">
                                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
                                    <select
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Full-Time">Full-Time</option>
                                        <option value="Part-Time">Part-Time</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                                <div className="flex justify-between mt-4 space-x-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>


                            </form>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto relative p-6">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Applications</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-red-500 text-2xl font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        {applications.length > 0 ? (
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div
                                        key={app._id}
                                        className="bg-blue-100 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                            <p><span className="font-medium text-gray-700">Name:</span> {app.fullname}</p>
                                            <p><span className="font-medium text-gray-700">Phone:</span> {app.phone}</p>
                                            <p><span className="font-medium text-gray-700">Course:</span> {app.course}</p>
                                            <p><span className="font-medium text-gray-700">Education:</span> {app.education}</p>
                                            <p><span className="font-medium text-gray-700">Description:</span> {app.description}</p>
                                            <p className="md:col-span-2">
                                                <span className="font-medium text-gray-700">Resume:</span>{' '}
                                                <a
                                                    href={app.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Download Resume
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No applications found.</p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default CompanyJobCard;
