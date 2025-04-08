import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import CompanyJobCard from '../components/CompanyJobCard';
import CompanyDetailCard from '../components/CompanyDetailCard';

const CompanyDetail = () => {
  const { id } = useParams();
  const [companyDetails, setCompanyDetails] = React.useState({});
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`http://localhost:3000/jobs/company/${id}`);
      const data = await response.json();
      console.log("job data:", data)
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  useEffect(() => {
    fetchJobs();
  },);

  const fetchCompanyDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/companies/${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCompanyDetails(data);
      // console.log(data);
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };
  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  return (
    <div className='bg-blue-50 h-screen flex  p-6'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full '>

        <div className='border p-5 w-2/3'>

          <div className='flex items-center gap-10 mb-6'>
            <img src={companyDetails.logo} alt="Company Logo" className='w-32 h-32' />
            <div>
              <h2 className='text-3xl font-bold text-blue-600 mb-2'>{companyDetails.name}</h2>
              <p className='text-lg italic text-gray-700 mb-2'>{companyDetails.slogan}</p>
            </div>
          </div>
          <div className=''>

            <p className='text-lg text-gray-800 mb-1'><span className='font-semibold'>Company Size:</span> {companyDetails.companySize} Employees</p>
            <p className='text-lg text-gray-800 mb-4'><span className='font-semibold'>Location:</span> {companyDetails.city}, {companyDetails.country}</p>
            <p className='text-md text-gray-600'>{companyDetails.description}</p>
          </div>
        </div>
        <h1 className='text-2xl py-5'>Posted jobs</h1>
        <div className="">
          <div className="w-full">
            <div className="grid grid-cols-3 gap-10">
              {jobs.map((job) => (
                <CompanyDetailCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CompanyDetail
