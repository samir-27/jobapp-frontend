import React from 'react';
import { IoIosPeople } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const CompanyCard = ({ company }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/comp-detail/${company._id}`);   
    }
  return (
<div className="rounded-3xl p-6 shadow-lg bg-white cursor-pointer" onClick={handleClick}>
  <div className="flex items-center mb-4">
    <img src={company.logo} alt={company.name} className="w-24 h-24 rounded-full object-cover shadow-md" />
    <div className="ml-4">
      <h2 className="text-2xl  text-blue-500 font-bold">{company.name}</h2>
      <p className="text-sm text-gray-700 italic">{company.slogan}</p>
    </div>
  </div>
  <div className="mt-4">
    <p className="text-lg font-semibold flex items-center gap-2 mb-25"><IoIosPeople className='text-blue-500' size={25} /><span className="font-normal">{company.companySize} Employees</span></p>
    <p className="text-lg font-semibold flex items-center gap-2"><FaLocationDot className='text-blue-500' size={25}  /> <span className="font-normal">{company.city}</span></p>
  </div>
</div>
  );
};

export default CompanyCard;
