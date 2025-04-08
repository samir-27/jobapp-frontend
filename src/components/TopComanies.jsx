import React, { useEffect, useState } from 'react';
import TopCompanyCard from './TopCompanyCard';

const TopCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('http://localhost:3000/companies');
                if (!response.ok) {
                    throw new Error('Failed to fetch companies');
                }
                const data = await response.json();
                setCompanies(data.slice(0, 6)); // Select top 6 companies
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className='py-12 cursor-pointer bg-white'>
            <div className=' mx-auto container'>

                <h1 className='text-4xl font-bold pb-10 mx-4 md:mx-0'>Top Companies</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4   gap-4 ">
                    {companies.map((company) => (
                        <TopCompanyCard key={company.id} company={company} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopCompanies;