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
    image: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);

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
        console.log(userData)
        setFormData({
          name: userData.name,
          email: userData.email,
          fullname: userData.fullname || '',
          phone: userData.phone || '',
          address: userData.address || '',
          education: userData.education || '',
          course: userData.course || '',
          image: userData.profileImg || '',
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

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
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
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

      console.log("Profile updated successfully");
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Something went wrong");
    }
  };


  return (
    <div className="mx-auto mt-5">
      <div className="bg-white rounded-lg ">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
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
          {/* <div>
            <label className="block text-sm font-medium text-gray-600">Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 border rounded-lg" />
            {formData.image && (
              <img src={formData.image} alt="Profile" className="mt-2 w-32 h-32 rounded-lg object-cover" />
            )}
          </div> */}
          {/* User Name & Email - Readonly */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Address</label>
            <textarea
              type="textarea"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your address"
            />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

            <div className=''>
              <label className="block text-sm font-medium text-gray-600">Pin Code</label>
              <input
                type="text"
                name="pincode"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your pin code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">City</label>
              <input
                type="text"
                name="city"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">State</label>
              <input
                type="text"
                name="state"

                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your State"
              />
            </div>
          </div>

          {/* Education & Course */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Education</label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your course"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>

  );
};

export default MyProfile;
