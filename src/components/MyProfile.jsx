import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fullname: '',
    phone: '',
    address: '',
    education: '',
    course: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
       const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user data');
        }

        const userData = await response.json();
        setFormData({
          name: userData.name,
          email: userData.email,
          fullname: userData.fullname || '',
          phone: userData.phone || '',
          address: userData.address || '',
          education: userData.education || '',
          course: userData.course || '',
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load user data');
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

  const token = localStorage.getItem("authToken");

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    console.log("fetch user",response)

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }

    toast.success("Profile updated successfully");
  } catch (error) {
    console.error('Error:', error);
    toast.error("Something went wrong");
  }
};

return (
  <div className="">
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
      <div>
  <label className="block text-sm font-medium text-gray-600">User Name</label>
  <input
    type="text"
    name="name"
    value={formData.name}
    readOnly
    className="w-full px-3 py-2 border bg-gray-100 rounded-lg focus:outline-none"
    placeholder="User name"
  />
</div>
<div>
  <label className="block text-sm font-medium text-gray-600">Email</label>
  <input
    type="email"
    name="email"
    value={formData.email}
    readOnly
    className="w-full px-3 py-2 border bg-gray-100 rounded-lg focus:outline-none"
    placeholder="Email address"
  />
</div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter your address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Education</label>
          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          >
            <option value="">Select Education</option>
            <option value="diploma">Diploma</option>
            <option value="graduation">Graduation</option>
            <option value="post-graduation">Post-Graduation</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter your course"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  </div>
);
};

export default MyProfile;
