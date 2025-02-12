import React from "react";
import Hero from "../components/Hero";

const Home = () => {
  return (
    <div className="">
       <Hero />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Choose Get Placed?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-indigo-100 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Trusted Companies</h3>
              <p className="text-gray-600">
                Partnering with top organizations to bring you the best
                opportunities.
              </p>
            </div>
            <div className="bg-indigo-100 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Diverse Opportunities</h3>
              <p className="text-gray-600">
                Jobs across industries for all experience levels.
              </p>
            </div>
            <div className="bg-indigo-100 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Easy to Use</h3>
              <p className="text-gray-600">
                Search, apply, and manage applications seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
