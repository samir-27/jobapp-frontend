import React from "react";
import Hero from "../components/Hero";
import Featuredjob from "../components/Featuredjob";
import TopCompanies from "../components/TopComanies";
import Reviews from "../components/Reviews";

const Home = () => {
const Cards = () => {
 return (
  <div className="w-full ">
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center">
            <h1 className=" text-4xl font-bold pb-7">Why Choose Us</h1>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
  <div className="p-6 rounded-lg border shadow-md bg-white transition-transform duration-300 hover:scale-105 hover:shadow-lg">
    <img src="https://cdn-icons-png.flaticon.com/128/8358/8358886.png" className="h-16 w-16 mb-4" alt="" />
    <h3 className="text-2xl font-bold mb-4">Trusted Companies</h3>
    <p className="text-gray-600">
      Partnering with top organizations to bring you the best opportunities.
    </p>
  </div>
  <div className="p-6 rounded-lg border shadow-md bg-white transition-transform duration-300 hover:scale-105 hover:shadow-lg">
    <img src="https://cdn-icons-png.flaticon.com/128/9750/9750874.png" className="h-16 w-16 mb-4" alt="" />
    <h3 className="text-2xl font-bold mb-4">Diverse Opportunities</h3>
    <p className="text-gray-600">
      Jobs across industries for all experience levels.
    </p>
  </div>
  <div className="p-6 rounded-lg border shadow-md bg-white transition-transform duration-300 hover:scale-105 hover:shadow-lg">
    <img src="https://cdn-icons-png.flaticon.com/128/6180/6180406.png" className="h-16 w-16 mb-4" alt="" />
    <h3 className="text-2xl font-bold mb-4">Easy to Use</h3>
    <p className="text-gray-600">
      Search, apply, and manage applications seamlessly.
    </p>
  </div>
</div>

        </div>
      </div>
 )
}
  return (
    <div className="bg-blue-50">
      <Hero />
      <Cards />
      <TopCompanies />
      <Featuredjob />
      <Reviews />
    </div>
  );
};

export default Home;
