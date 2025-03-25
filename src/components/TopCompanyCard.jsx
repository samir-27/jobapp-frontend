import React from 'react';

const TopCompanyCard = ({ company }) => {
  return (
    <div className="flex items-center p-2 w-80 rounded-full shadow-md bg-white border transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <img 
        src={company.logo} 
        alt={company.name} 
        className="h-20 w-20 object-cover rounded-full"
      />
      <h3 className="text-lg font-semibold text-gray-800 ml-4">{company.name}</h3>
    </div>
  );
};

export default TopCompanyCard;
