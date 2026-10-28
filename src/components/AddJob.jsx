import { useState } from 'react';
import { toast } from 'react-toastify';
import { fetchWithAuth } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AddJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('remote');
  const [jobType, setJobType] = useState('Full-Time');
  const [experience, setExperience] = useState('1-3years');
  const [status] = useState('draft'); // 'draft' | 'published'

  const [skills, setSkills] = useState([]);
  const [skillInputValue, setSkillInputValue] = useState('');
  const [requirements, setRequirements] = useState([]);
  const [requirementInputValue, setRequirementInputValue] = useState('');
  const [responsibilities, setResponsibilities] = useState([]);
  const [responsibilityInputValue, setResponsibilityInputValue] = useState('');
  const [niceToHave, setNiceToHave] = useState([]);
  const [niceToHaveInputValue, setNiceToHaveInputValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddSkill = () => {
    if (skillInputValue.trim() && !skills.includes(skillInputValue.trim())) {
      setSkills([...skills, skillInputValue.trim()]);
      setSkillInputValue('');
    }
  };

  const handleAddRequirement = () => {
    if (requirementInputValue.trim()) {
      setRequirements([...requirements, requirementInputValue.trim()]);
      setRequirementInputValue('');
    }
  };

  const handleAddResponsibility = () => {
    if (responsibilityInputValue.trim()) {
      setResponsibilities([...responsibilities, responsibilityInputValue.trim()]);
      setResponsibilityInputValue('');
    }
  };

  const handleAddNiceToHave = () => {
    if (niceToHaveInputValue.trim()) {
      setNiceToHave([...niceToHave, niceToHaveInputValue.trim()]);
      setNiceToHaveInputValue('');
    }
  };

  const handleSubmit = async (submitStatus) => {
    if (!title || !description || !role || !salary || !location || !experience) {
      toast.error('Please fill in all required job fields.');
      return;
    }

    const payload = {
      title,
      description,
      role,
      skills: skills.length > 0 ? skills : ['General'],
      salary: Number(salary),
      experience,
      location,
      jobType: jobType || 'Full-Time',
      status: submitStatus || status,
      responsibilities: responsibilities.length > 0 ? responsibilities : ['Core responsibilities as per job description'],
      requirements: requirements.length > 0 ? requirements : ['Relevant professional experience'],
      niceToHave,
    };

    try {
      setSubmitting(true);
      const response = await fetchWithAuth('/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to create job');
      }

      toast.success(
        submitStatus === 'published'
          ? 'Job published to candidate marketplace!'
          : 'Job saved as draft successfully!'
      );
      navigate('/company/postedjobs');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(error.message || 'Something went wrong creating the job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Vacancy</h1>
          <p className="text-sm text-gray-500 mt-1">
            Post an opening to attract candidates or save as a draft to finish later.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Role Category *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Development"
                className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Annual Salary ($) *
              </label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. 130000"
                className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                min={10000}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Experience Level *
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="fresher">Fresher / Graduate</option>
                <option value="1-3years">1 - 3 years</option>
                <option value="3-5years">3 - 5 years</option>
                <option value="5-10years">5 - 10 years</option>
                <option value="10-20years">10+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Location Mode *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Employment Type *
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Job Description *
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive overview of role, team mission, and qualifications..."
                className="border border-gray-300 rounded-lg p-3 w-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Required Technical Skills
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInputValue}
                  onChange={(e) => setSkillInputValue(e.target.value)}
                  placeholder="e.g. React, NestJS, AWS"
                  className="border border-gray-300 rounded-lg p-2 text-sm flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}
                      className="ml-1 text-blue-500 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Responsibilities
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={responsibilityInputValue}
                  onChange={(e) => setResponsibilityInputValue(e.target.value)}
                  placeholder="e.g. Lead architecture discussions for high-throughput microservices"
                  className="border border-gray-300 rounded-lg p-2 text-sm flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddResponsibility}
                  className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1">
                {responsibilities.map((r, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                    <span>• {r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Requirements
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={requirementInputValue}
                  onChange={(e) => setRequirementInputValue(e.target.value)}
                  placeholder="e.g. 3+ years experience with NestJS and MongoDB"
                  className="border border-gray-300 rounded-lg p-2 text-sm flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1">
                {requirements.map((req, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                    <span>• {req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice to have */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Nice-to-Have
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={niceToHaveInputValue}
                  onChange={(e) => setNiceToHaveInputValue(e.target.value)}
                  placeholder="e.g. Experience with Kubernetes and CI/CD"
                  className="border border-gray-300 rounded-lg p-2 text-sm flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddNiceToHave}
                  className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-lg"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1">
                {niceToHave.map((nth, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                    <span>• {nth}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons: Draft or Publish */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('draft')}
              className="px-5 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('published')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish Vacancy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJob;
