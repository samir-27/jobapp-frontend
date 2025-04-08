import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopCompanyCard = ({ company }) => {
      const navigate = useNavigate();
      const handleClick = () => {
          navigate(`/comp-detail/${company._id}`);
      }
  return (
    <div className="flex items-center p-2 mx-4 md:mx-0 shadow-md bg-white border transition-transform duration-300 hover:scale-105 hover:shadow-lg" onClick={handleClick}>
      <img 
        src={company.logo} 
        alt={company.name} 
        className="h-20 w-20 object-cover"
      />
      <h3 className="text-lg font-semibold text-gray-800 ml-4">{company.name}</h3>
    </div>
  );
};

export default TopCompanyCard;
