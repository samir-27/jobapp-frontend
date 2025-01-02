import React from "react";

const Home = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <header className="relative">
        <img
          src="https://www.simplilearn.com/ice9/free_resources_article_thumb/Top_11_Highest_Salary_Jobs_in_India_to_Watch_Out_For_in_2022.jpg"
          alt="Job search"
          className="w-full h-112 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-65 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-lg sm:text-xl mb-6">
            Discover thousands of opportunities in top industries.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
            <input
              type="text"
              placeholder="Job title or keyword"
              className="flex-1 px-4 py-3 rounded-md text-black outline-none"
            />
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-600 transition">
              Search Jobs
            </button>
          </form>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
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
