import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const decodeToken = jwtDecode(authToken);
  const userID = decodeToken.id;

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    address: "",
    education: "diploma",
    course: "",
    jobId: id,
    userId: userID,
  });

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/jobs/${id}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetail();
  }, [id]);

  const handleApplyNow = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/applyjob/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Application submitted successfully!");
        setIsModalOpen(false);
        setFormData({
          fullname: "",
          phone: "",
          address: "",
          education: "diploma",
          course: "",
          jobId: id,
          userId: userID,
        });
      } else {
        toast.error("Failed to submit application. Try again.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (!job) {
    return <div>Loading job details...</div>;
  }

  return (
    <div className="p-8 border-t-0 border-2">
      <div className="flex pb-4">
        <div>
          <img
            className="rounded-full w-14 h-14 object-cover"
            src="https://bookface-images.s3.amazonaws.com/small_logos/5a28987b3e1b3effc2a33ce770fc25f4424fc775.png"
            alt=""
          />
        </div>
        <div className="my-auto px-2">
          <h1 className="text-2xl"> {job.companyName}</h1>
        </div>
      </div>
      <div>
        <div className="border border-gray-300 rounded-md p-3 mt-3 lg:w-2/3">
          <div className="pb-2">
            <h1 className="text-xl">{job.role}</h1>
            <p className="font-bold text-lg">${job.salary}</p>
          </div>
          <div className="flex py-2 pb-5 border-b">
            <div>
              <h2 className="font-bold">Location</h2>
              <h2>{job.location}</h2>
            </div>
            <div className="mx-4">
              <h2 className="font-bold">Job-Type</h2>
              <h2>{job.jobType}</h2>
            </div>
            <div>
              <h2 className="font-bold">Experience</h2>
              <h2>{job.experience}</h2>
            </div>
          </div>
          <button
            onClick={handleApplyNow}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Apply Now
          </button>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Apply for {job.role}</h2>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
              />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
              ></textarea>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
              >
                <option value="diploma">Diploma</option>
                <option value="graduation">Graduation</option>
                <option value="post-graduation">Post-Graduation</option>
              </select>
              <input
                type="text"
                name="course"
                placeholder="Course"
                value={formData.course}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <h1 className="text-2xl my-6">About The Role</h1>
      <p>{job.description}</p>
      <div>
        <h1 className="text-xl font-semibold my-4 text-indigo-500 uppercase">
          Skills:
        </h1>
        <ul className="list-disc pl-5">
          {job.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobDetailPage;
