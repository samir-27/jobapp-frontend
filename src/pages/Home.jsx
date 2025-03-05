import React from "react";
import Hero from "../components/Hero";
import Featuredjob from "../components/Featuredjob";

const Home = () => {

  return (
    <div className="">
      <Hero />
      <div className="bg-black w-full">
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-4xl font-bold pb-7">Why Choose Us</h1>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow shadow-indigo-200">
              <img src="https://cdn-icons-png.flaticon.com/128/8358/8358886.png" className="h-16 w-16 mb-4" alt="" />
              <h3 className="text-2xl text-white font-bold mb-4">Trusted Companies</h3>
              <p className="text-gray-300">
                Partnering with top organizations to bring you the best
                opportunities.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow shadow-indigo-200">
            <img src="https://cdn-icons-png.flaticon.com/128/9750/9750874.png" className="h-16 w-16 mb-4" alt="" />
              <h3 className="text-2xl text-white font-bold mb-4">Diverse Opportunities</h3>
              <p className="text-gray-300">
                Jobs across industries for all experience levels.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow shadow-indigo-200">
            <img src="https://cdn-icons-png.flaticon.com/128/6180/6180406.png" className="h-16 w-16 mb-4" alt="" />
              <h3 className="text-2xl text-white font-bold mb-4">Easy to Use</h3>
              <p className="text-gray-300">
                Search, apply, and manage applications seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Featuredjob />
    </div>
  );
};

export default Home;
