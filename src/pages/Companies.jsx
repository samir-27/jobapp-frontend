import { useEffect, useState } from 'react';
import CompanyCard from '../components/CompanyCard';
import { API_BASE_URL } from '../utils/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/companies`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        const data = await response.json();
        if (isMounted) {
          setCompanies(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Error fetching companies:', err);
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCompanies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto py-10">
        {loading && <div className="text-center py-8 text-gray-600">Loading companies...</div>}
        {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
        {!loading && !error && companies.length === 0 && (
          <div className="text-center py-8 text-gray-600">No companies found.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {companies.map((company) => (
            <CompanyCard key={company._id || company.id} company={company} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
