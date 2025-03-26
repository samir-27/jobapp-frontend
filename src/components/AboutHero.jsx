import React from 'react';

const AboutHero = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://videos.pexels.com/video-files/6248612/6248612-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Our Path to Progress and Growth
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Join us as we continue our journey of innovation and development. Our commitment to progress and growth drives us to create impactful solutions that shape the future of our industry.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;

