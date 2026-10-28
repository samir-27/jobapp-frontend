import { useNavigate } from 'react-router-dom';

const TopCompanyCard = ({ company }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/comp-detail/${company?._id}`);
  };

  return (
    <div
      className="flex items-center p-3 mx-4 md:mx-0 shadow-sm bg-white border border-gray-200 rounded-xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <img 
        src={company?.logo || "https://cdn-icons-png.flaticon.com/512/3237/3237472.png"} 
        alt={company?.name || "Company"} 
        className="h-16 w-16 object-contain rounded-lg p-1 bg-gray-50 border border-gray-100 shrink-0"
      />
      <h3 className="text-base font-bold text-gray-800 ml-3 truncate">
        {company?.name || "Partner Company"}
      </h3>
    </div>
  );
};

export default TopCompanyCard;
