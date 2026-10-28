import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CompanyDetailCard from '../components/CompanyDetailCard';
import { API_BASE_URL } from '../utils/api';

const CompanyDetail = () => {
  const { id } = useParams();
  const [companyDetails, setCompanyDetails] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        const [compRes, jobsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/companies/${id}`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/jobs/company/${id}`, { signal: controller.signal }),
        ]);

        if (!compRes.ok) throw new Error('Failed to fetch company details');
        const compData = await compRes.json();
        const jobsData = jobsRes.ok ? await jobsRes.json() : [];

        if (isMounted) {
          setCompanyDetails(compData);
          setJobs(Array.isArray(jobsData) ? jobsData : []);
          setError(null);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Error fetching company details:', err);
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return <div className="bg-blue-50 min-h-screen p-6 text-center text-gray-600">Loading company details...</div>;
  }

  if (error) {
    return <div className="bg-blue-50 min-h-screen p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-blue-50 min-h-screen flex p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full">
        <div className="border p-5 w-full lg:w-2/3 rounded-lg mb-6">
          <div className="flex items-center gap-10 mb-6">
            <img src={companyDetails.logo} alt="Company Logo" className="w-32 h-32 object-contain" />
            <div>
              <h2 className="text-3xl font-bold text-blue-600 mb-2">{companyDetails.name}</h2>
              <p className="text-lg italic text-gray-700 mb-2">{companyDetails.slogan}</p>
            </div>
          </div>
          <div>
            <p className="text-lg text-gray-800 mb-1">
              <span className="font-semibold">Company Size:</span> {companyDetails.companySize} Employees
            </p>
            <p className="text-lg text-gray-800 mb-4">
              <span className="font-semibold">Location:</span> {companyDetails.city}{companyDetails.address ? `, ${companyDetails.address}` : ''}
            </p>
            <p className="text-md text-gray-600">{companyDetails.description}</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold py-5">Posted jobs</h1>
        <div>
          {jobs.length === 0 ? (
            <div className="text-gray-500">No jobs posted yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <CompanyDetailCard key={job._id || job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
