import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/api";
import TopCompanyCard from "./TopCompanyCard";

const TopCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/companies`);
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        const data = await response.json();
        setCompanies(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error("Error fetching top companies:", error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const safeCompanies = Array.isArray(companies) ? companies : [];

  if (loading) {
    return <div className="py-8 text-center text-gray-400">Loading top employer partners...</div>;
  }

  if (safeCompanies.length === 0) {
    return null; // Don't show empty block if no companies yet
  }

  return (
    <div className="py-12 cursor-pointer bg-white">
      <div className="mx-auto container">
        <h2 className="text-4xl font-bold pb-10 mx-4 md:mx-0 text-gray-900">
          Top Companies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {safeCompanies.map((company) => (
            <TopCompanyCard key={company._id || company.id} company={company} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCompanies;
