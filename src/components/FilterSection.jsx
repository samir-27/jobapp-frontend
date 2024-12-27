import { useState } from "react";

const FilterSection = ({ setFilters }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState([0, 100000]);
  const [experience, setExperience] = useState("");

  const handleFilterChange = () => {
    setFilters({
      title,
      location,
      salary,
      experience,
    });
  };

  const handleSalaryChange = (index, value) => {
    const updatedSalary = [...salary];
    updatedSalary[index] = value;
    setSalary(updatedSalary);
  };

  return (
    <div className="border border-gray-200 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Job Title
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search job title"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search location"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
          Salary Range
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            id="salary-min"
            className="w-full"
            min="0"
            max="100000"
            step="1000"
            value={salary[0]}
            onChange={(e) => handleSalaryChange(0, +e.target.value)}
          />
        </div>
        <div className="mt-2">
          ${salary[0]} - ${salary[1]}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
          Experience
        </label>
        <select
          id="experience"
          className="mt-1 p-2 w-full border border-gray-300 rounded"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">Select experience level</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
        </select>
      </div>
      <button
        onClick={handleFilterChange}
        className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSection;