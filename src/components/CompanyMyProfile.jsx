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
    image: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
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
          image: companyData.logo || '',
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
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    let imageUrl = formData.image;
    
    if (selectedImage) {
      const imageData = new FormData();
      imageData.append("file", selectedImage);
      imageData.append("upload_preset", "profileimages");

      try {
        const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/ddc3h3udr/image/upload", {
          method: "POST",
          body: imageData,
        });
       const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.secure_url;
        console.log("Cloudinary Image URL:", imageUrl);
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image");
        return;
      }
    }

    const finalData = { ...formData, image: imageUrl };
    console.log("Final Data Sent to Backend:", finalData);


    try {
      const response = await fetch(`http://localhost:3000/companies/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
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
      <div className="rounded-lg ">
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            {selectedImage ? (
              <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="mt-2 w-32 h-32 rounded-full object-cover" />
            ) : formData.image ? (
              <img src={formData.image} alt="Profile" className="mt-2 w-32 h-32 rounded-full object-cover" />
            ) : (
              <p className="text-gray-500 mt-2">No image uploaded</p>
            )}
            <label className="block text-sm font-medium text-gray-600">Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 border rounded-lg" />

            {/* Show Selected Image Preview or Existing Profile Image */}
          </div>
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
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyMyProfile;