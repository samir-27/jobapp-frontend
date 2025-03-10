import React from 'react'

const AboutHero = () => {
  return (
<div className="container mx-auto flex justify-center items-center h-92vh">
      <div className="h-96 w-full relative">
        <div className="child absolute inset-0 m-auto h-56 w-7/12 px-20">
          <h1 className="text-center font-bold text-6xl py-5">Our path to progress and growth</h1>
          <p className="text-center">
            Join us as we continue our journey of innovation and development. Our commitment to progress and growth drives us to create impactful solutions that shape the future of our industry.
          </p>
        </div>

        {/* Image Animations on Scroll */}
        <div className="w-60 absolute -bottom-40 left-52 motion-safe:animate-[scrollEffect_3s_ease-in-out_infinite]">
          <img className="rounded-3xl" src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66c42d0f0777abd1e1afea64_about-05.avif" alt="" />
        </div>
        <div className="w-44 absolute -top-36 left-64 motion-safe:animate-[scrollEffect_3s_ease-in-out_infinite]">
          <img className="rounded-3xl" src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66c42d0f0e625168648e377f_about-03.avif" alt="" />
        </div>
        <div className="w-72 absolute top-28 left-0 motion-safe:animate-[scrollEffect_3s_ease-in-out_infinite]">
          <img className="rounded-3xl" src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66c42da795f67677f2bfcf5d_about-06.avif" alt="" />
        </div>
        <div className="w-72 absolute -top-28 right-4 motion-safe:animate-[scrollEffect_3s_ease-in-out_infinite]">
          <img className="rounded-3xl" src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66c438319d796978ec1f4909_mission-01-p-500.avif" alt="" />
        </div>
        <div className="w-60 absolute -bottom-28 right-40 motion-safe:animate-[scrollEffect_3s_ease-in-out_infinite]">
          <img className="rounded-3xl" src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66c42d0f32324b40f83423c3_about-04.avif" alt="" />
        </div>
      </div>

      {/* Tailwind Keyframes */}
      <style>
        {`
          @keyframes scrollEffect {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.92); }
          }
          `}
      </style>
    </div>
  )
}

export default AboutHero
