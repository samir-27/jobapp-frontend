import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const CompanyMyProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    slogan: '',
    description: '',
    address: '',
    city: '',
    companySize: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      try {
        const response = await fetch(`http://localhost:3000/companies/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch company data');
        }

        const companyData = await response.json();
        setFormData({
          name: companyData.name,
          email: companyData.email,
          slogan: companyData.slogan || '',
          description: companyData.description || '',
          address: companyData.address || '',
          city: companyData.city || '',
          companySize: companyData.companySize || '',
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load company data');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const response = await fetch(`http://localhost:3000/companies/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mx-auto mt-5">
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Company Name</label>
            <input type="text" name="name" value={formData.name} readOnly className="w-full px-3 py-2 border bg-gray-100 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input type="email" name="email" value={formData.email} readOnly className="w-full px-3 py-2 border bg-gray-100 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Slogan</label>
            <input type="text" name="slogan" value={formData.slogan} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Company Size</label>
            <input type="text" name="companySize" value={formData.companySize} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyMyProfile;