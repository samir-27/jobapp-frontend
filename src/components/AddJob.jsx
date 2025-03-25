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
  const [requirementInputValue, setRequirementInputValue] = useState('')
  const [responsibilityInputValue, setResponsibilityInputValue] = useState('')
  const [niceToHaveInputValue, setNiceToHaveInputValue] = useState('')
  const [skillInputValue, setSkillInputValue] = useState('')
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
<div className="p-6 container mx-auto">
  <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg border shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
    <h2 className="text-2xl font-bold text-blue-500 mb-6 md:col-span-2">Add Job</h2>

    <input type="text" id="title" onChange={handleTitleChange} value={title} placeholder="Enter Title" className="border p-2 rounded w-full" />
    <input type="text" id="description" onChange={handleDescriptionChange} value={description} placeholder="Enter Description" className="border p-2 rounded w-full" />
    <input type="text" id="role" onChange={handleRoleChange} value={role} placeholder="Enter Role" className="border p-2 rounded w-full" />
    <input type="text" id="salary" onChange={handleSalaryChange} value={salary} placeholder="Enter Salary" className="border p-2 rounded w-full" />
    <select id="experience" value={experience} onChange={handleExperienceChange} className="border p-2 rounded w-full">
      <option value="">Select Experience...</option>
      <option value="fresher">Fresher</option>
      <option value="1-3years">1-3 years</option>
      <option value="3-5years">3-5 years</option>
      <option value="5-10years">5-10 years</option>
      <option value="10-20years">10-20 years</option>
    </select>
    <select id="location" value={location} onChange={handleLocationChange} className="border p-2 rounded w-full">
      <option value="">Select Location...</option>
      <option value="remote">Remote</option>
      <option value="hybrid">Hybrid</option>
      <option value="on-site">On-site</option>
    </select>
    <select id="jobType" value={jobType} onChange={handleJobTypeChange} className="border p-2 rounded w-full">
      <option value="">Select Job Type...</option>
      <option value="Full-Time">Full-Time</option>
      <option value="Part-Time">Part-Time</option>
      <option value="Contract">Contract</option>
    </select>

    <div className="md:col-span-2">
      <label className="block font-medium">Skills</label>
      <div className="flex items-center">
        <input type="text" id="skills" value={skillInputValue} onChange={handleSkillInputChange} placeholder="Enter skill" className="border p-2 rounded-l w-full" />
        <button type="button" onClick={handleAddSkill} className="px-4 py-2 bg-blue-500 text-white rounded-r">Add</button>
      </div>
      <ul className="mt-2">{skills.map((skill, index) => (<li key={index} className="text-sm">{skill}</li>))}</ul>
    </div>

    <div className="md:col-span-2">
      <label className="block font-medium">Requirements</label>
      <div className="flex items-center">
        <input type="text" id="requirements" value={requirementInputValue} onChange={handleRequirementInputChange} placeholder="Enter requirement" className="border p-2 rounded-l w-full" />
        <button type="button" onClick={handleAddRequirement} className="px-4 py-2 bg-blue-500 text-white rounded-r">Add</button>
      </div>
      <ul className="mt-2">{requirements.map((req, index) => (<li key={index} className="text-sm">{req}</li>))}</ul>
    </div>

    <div className="md:col-span-2">
      <label className="block font-medium">Responsibilities</label>
      <div className="flex items-center">
        <input type="text" id="responsibilities" value={responsibilityInputValue} onChange={handleResponsibilityInputChange} placeholder="Enter responsibility" className="border p-2 rounded-l w-full" />
        <button type="button" onClick={handleAddResponsibility} className="px-4 py-2 bg-blue-500 text-white rounded-r">Add</button>
      </div>
      <ul className="mt-2">{responsibilities.map((resp, index) => (<li key={index} className="text-sm">{resp}</li>))}</ul>
    </div>

    <div className="md:col-span-2">
      <label className="block font-medium">Nice-to-Have</label>
      <div className="flex items-center">
        <input type="text" id="niceToHave" value={niceToHaveInputValue} onChange={handleNiceToHaveInputChange} placeholder="Enter nice-to-have" className="border p-2 rounded-l w-full" />
        <button type="button" onClick={handleAddNiceToHave} className="px-4 py-2 bg-blue-500 text-white rounded-r">Add</button>
      </div>
      <ul className="mt-2">{niceToHave.map((niceTo, index) => (<li key={index} className="text-sm">{niceTo}</li>))}</ul>
    </div>

    <button type="submit" className="md:col-span-2 w-full px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600">Submit</button>
  </form>
</div>


  );
};

export default FormExample;
