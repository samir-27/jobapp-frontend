import { useState, useEffect } from 'react';
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import { useSearchParams } from 'react-router-dom';

const AccordionComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [skillsArray, setSkillsArray] = useState([]);
  
  const filters = [
    {
      id: 'location',
      name: 'Location',
      options: [
        { value: 'remote', label: 'Remote' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'location', label: 'Location' },
      ],
    },
    {
      id: 'jobType',
      name: 'Job Type',
      options: [
        { value: 'Part-Time', label: 'Part Time' },
        { value: 'Full-Time', label: 'Full Time' },
        { value: 'Contract', label: 'Contract' }
      ],
    },
    {
      id: 'experience',
      name: 'Experience',
      options: [
        { value: 'fresher', label: 'Fresher' },
        { value: '1-3years', label: '1 to 3 years' },
        { value: '3-5years', label: '3 to 5 years' },
        { value: '5-10years', label: '5 to 10 years' },
        { value: '10-20years', label: '10 to 20 years' },
      ],
    },
  ];

  const handleFilterChange = (filterId, optionValue) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterId]: optionValue,
    }));
  };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() !== '') {
      setSkillsArray((prevSkills) => [...prevSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleSkillRemove = (skill) => {
    setSkillsArray((prevSkills) => prevSkills.filter((s) => s !== skill));
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setSkillsArray([]);
    
    // Remove all search params
    const keysToRemove = Array.from(searchParams.keys());
    keysToRemove.forEach((key) => searchParams.delete(key));
  
    setSearchParams(searchParams); // Update the search params state
  };

  useEffect(() => {
    if (skillsArray.length > 0) {
      searchParams.set('skills', skillsArray.join(','));
    } else {
      searchParams.delete('skills');
    }

    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key]) {
        searchParams.set(key, selectedFilters[key]);
      } else {
        searchParams.delete(key);
      }
    });

    setSearchParams(searchParams);
  }, [skillsArray, selectedFilters, searchParams, setSearchParams]);

  const AccordionItem = ({ header, children }) => (
    <Item
      header={() => <>{header}</>}
      className="mb-2"
      buttonProps={{
        className: () =>
          `flex w-full p-4 text-left bg-slate-100 hover:bg-slate-200 text-lg font-bold rounded-md`,
      }}
      contentProps={{
        className: "transition-height duration-200 ease-out",
      }}
      panelProps={{ className: "p-4" }}
    >
      {children}
    </Item>
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="text-lg font-bold">Job Title</label>
        <input
          type="text"
          name="title"
          value={selectedFilters.title || ''}
          onChange={(e) => handleFilterChange('title', e.target.value)}
          placeholder="Search by job title"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="text-lg font-bold">Skills</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={skillInput}
            onChange={handleSkillInputChange}
            placeholder="Search by skills"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            className="bg-indigo-500 text-white px-4 rounded-md"
            onClick={handleSkillAdd}
          >
            Add
          </button>
        </div>
        <div className="mt-2">
          {skillsArray.map((skill) => (
            <span
              key={skill}
              className="bg-indigo-200  border-2 px-2 py-1 rounded-full text-sm mr-2"
            >
              {skill}
              <button
                className="ml-1 "
                onClick={() => handleSkillRemove(skill)}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <Accordion>
        {filters.map((filter) => (
          <AccordionItem key={filter.id} header={filter.name} >
            <div className="flex flex-col space-y-2">
              {filter.options.map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={filter.id}
                    value={option.value}
                    checked={selectedFilters[filter.id] === option.value}
                    onChange={() => handleFilterChange(filter.id, option.value)}
                    className="form-radio"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
      <button
        className="bg-indigo-500 p-2 rounded-md text-white font-semibold w-full"
        onClick={handleClearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default AccordionComponent;
