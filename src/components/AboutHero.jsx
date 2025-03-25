import React from 'react';

const AboutHero = () => {
  return (
    <section 
    className="relative w-full h-screen flex items-center justify-center text-center text-white bg-cover bg-center" 
    style={{ backgroundImage: "url('https://img.freepik.com/free-photo/guy-shows-document-girl-group-young-freelancers-office-have-conversation-working_146671-13569.jpg?t=st=1741758412~exp=1741762012~hmac=dd66bdb7386be859ccc4b801974c53b40dfc660f644f7f2b060f7b1c6b9ac969&w=1060')" }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-70"></div>
    <div className="relative z-10 max-w-3xl px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Path to Progress and Growth</h1>
      <p className="text-lg md:text-xl mb-8">
        Join us as we continue our journey of innovation and development. Our commitment to progress and growth drives us to create impactful solutions that shape the future of our industry.
      </p>
      <div className="flex justify-center space-x-4">
        <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded text-lg">View Companies</button>
        <button className="bg-gray-200 text-gray-900 hover:bg-gray-300 px-6 py-3 rounded text-lg">View Job Seekers</button>
      </div>
    </div>
  </section>
  );
};

export default AboutHero;
