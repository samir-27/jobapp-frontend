import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { toast } from 'react-toastify';

const FormExample = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState('');
  const [requirementInputValue,setRequirementInputValue]=useState('')
  const [responsibilityInputValue,setResponsibilityInputValue]=useState('')
  const [niceToHaveInputValue,setNiceToHaveInputValue]=useState('')
  const [skillInputValue,setSkillInputValue]=useState('')
  const [requirements, setRequirements] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);
  const [niceToHave, setNiceToHave] = useState([]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSalaryChange = (e) => {
    setSalary(e.target.value);
  };

  const handleCompanyChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
  };

  const handleSkillInputChange = (e) => {
    setSkillInputValue(e.target.value);
  }

  const handleRequirementInputChange = (e) => {
    setRequirementInputValue(e.target.value);
  };
  const handleResponsibilityInputChange = (e) => {
    setResponsibilityInputValue(e.target.value);
  };
  const handleNiceToHaveInputChange = (e) => {
    setNiceToHaveInputValue(e.target.value);
  };

  const handleAddSkill = () => {
    if (skillInputValue.trim()) {
      setSkills([...skills, skillInputValue]);
      setSkillInputValue('');
    }
  };

  const handleAddRequirement = () => {
    if (requirementInputValue.trim()) {
      setRequirements([...requirements, requirementInputValue]);
      setRequirementInputValue('');
    }
  };

  const handleAddResponsibility = () => {
    if (responsibilityInputValue.trim()) {
      setResponsibilities([...responsibilities, responsibilityInputValue]);
      setResponsibilityInputValue('');
    }
  };

  const handleAddNiceToHave = () => {
    if (niceToHaveInputValue.trim()) {
      setNiceToHave([...niceToHave, niceToHaveInputValue]);
      setNiceToHaveInputValue('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      description,
      role,
      skills,
      salary,
      experience,
      location,
      companyName,
      jobType,
      responsibilities,
      requirements,
      niceToHave,
    };
    const token = localStorage.getItem("authToken")
    const decodedToken = jwtDecode(token);
    // console.log("decoded",decodedToken.id)
    const ComId = decodedToken.id;
    try {
      const response = await fetch(`http://localhost:3000/jobs?companyId=${ComId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok'); 
      }

      const result = await response.json();
      toast.success("job created successfully")
    } catch (error) {
      console.error('Error:', error);
      toast.error("something went wrong")
    }
  };

  return (
    <div className="bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-indigo-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-indigo-500 mb-6">Add Job</h2>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            onChange={handleTitleChange}
            value={title}
            placeholder="Enter Title"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            id="description"
            onChange={handleDescriptionChange}
            value={description}
            placeholder="Enter Description"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            id="role"
            onChange={handleRoleChange}
            value={role}
            placeholder="Enter Role"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
          <input
            type="text"
            id="salary"
            onChange={handleSalaryChange}
            value={salary}
            placeholder="Enter Salary"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            id="company"
            onChange={handleCompanyChange}
            value={companyName}
            placeholder="Enter Company Name"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
          <select
            id="experience"
            value={experience}
            onChange={handleExperienceChange}
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
            value={location}
            onChange={handleLocationChange}
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
            value={jobType}
            onChange={handleJobTypeChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select...</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Skills Input */}
        <div className="mb-4">
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Add Skills</label>
          <div className="flex items-center">
            <input
              type="text"
              id="skills"
              value={skillInputValue}
              onChange={handleSkillInputChange}
              placeholder="Enter skill"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="mt-1 px-4 py-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600"
            >
              Add
            </button>
          </div>
          <ul className="mt-2">
            {skills.map((skill, index) => (
              <li key={index} className="text-sm text-gray-700">
                {skill}
              </li>
            ))}
          </ul>
        </div>

 
        <div className="mb-4">
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Add Requirements</label>
          <div className="flex items-center">
            <input
              type="text"
              id="requirements"
              value={requirementInputValue}
              onChange={handleRequirementInputChange}
              placeholder="Enter requirement"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddRequirement}
              className="mt-1 px-4 py-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600"
            >
              Add
            </button>
          </div>
          <ul className="mt-2">
            {requirements.map((req, index) => (
              <li key={index} className="text-sm text-gray-700">
                {req}
              </li>
            ))}
          </ul>
        </div>


        <div className="mb-4">
          <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700">Add Responsibilities</label>
          <div className="flex items-center">
            <input
              type="text"
              id="responsibilities"
              value={responsibilityInputValue}
              onChange={handleResponsibilityInputChange}
              placeholder="Enter responsibility"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddResponsibility}
              className="mt-1 px-4 py-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600"
            >
              Add
            </button>
          </div>
          <ul className="mt-2">
            {responsibilities.map((resp, index) => (
              <li key={index} className="text-sm text-gray-700">
                {resp}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <label htmlFor="niceToHave" className="block text-sm font-medium text-gray-700">Add Nice-to-Have</label>
          <div className="flex items-center">
            <input
              type="text"
              id="niceToHave"
              value={niceToHaveInputValue}
              onChange={handleNiceToHaveInputChange}
              placeholder="Enter nice-to-have"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddNiceToHave}
              className="mt-1 px-4 py-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600"
            >
              Add
            </button>
          </div>
          <ul className="mt-2">
            {niceToHave.map((niceTo, index) => (
              <li key={index} className="text-sm text-gray-700">
                {niceTo}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormExample;
