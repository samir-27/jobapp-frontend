import React, { useEffect, useState } from 'react'
import CompanyCard from '../components/CompanyCard';

const Companies = () => {
    const [companies, setCompanies ] = useState([]);
     const fetchJobs = async () => {
        try {
          const response = await fetch(`http://localhost:3000/companies`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
        //   console.log(data);
          setCompanies(data);
        } catch (error) {
          console.error("Error fetching jobs:", error);
        }
      };
      useEffect(() => {
        fetchJobs();
       });
  return (
    <div className='bg-blue-50 min-h-screen'>
      <div className="container mx-auto py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
    </div>
  )
}

export default Companies
