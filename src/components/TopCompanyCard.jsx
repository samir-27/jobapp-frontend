import React from 'react'

const TopCompanyCard = ({ company }) => {
    console.log(company)
    return (
<div className="border p-6 rounded-lg shadow-lg flex flex-col transition-transform transform hover:scale-105">
    <div className='flex gap-5 items-center pb-3'>


  <img src={company.logo} alt={company.name} className="h-24 w-24 object-cover rounded-full my-auto border-4 border-indigo-100" />

  <div>
  <h3 className="text-2xl font-bold text-gray-800">{company.name}</h3>
  <p className="text-gray-500 text-sm italic">{company.slogan}</p>
  </div>
    </div>
  <p className="text-gray-600 mt-2">{company.description}</p>
  <div className="mt-4 text-sm text-gray-700">
    <p><strong>Address:</strong> {company.address}, {company.city}</p>
    <p><strong>Company Size:</strong> {company.companySize}</p>
    <p><strong>Email:</strong> <a href={`mailto:${company.email}`} className="text-blue-500 hover:underline">{company.email}</a></p>
  </div>
</div>
    );
  };

export default TopCompanyCard
