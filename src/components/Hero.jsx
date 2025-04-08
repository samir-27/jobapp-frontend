import { useNavigate } from "react-router-dom"

const Hero = () => {
    const navigate = useNavigate()
    const handleClik = () => {
        navigate("/jobs")
    }

    return (
        <div className="min-h-screen flex items-center bg-white">
        <div className="container mx-auto flex flex-col-reverse md:flex-row px-4 md:px-0">
          
          {/* Text Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold my-4">
              Unlock d<span className="text-blue-500">oo</span>rs to new
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">opportunities</h1>
            <p className="my-6 text-gray-600 text-base sm:text-lg md:pr-20">
              Discover countless opportunities and connect with top employers. Start your journey toward a fulfilling career today. Connect with employers who value your unique talents and aspirations.
            </p>
            <button
              onClick={handleClik}
              className="w-fit px-8 py-4 text-lg font-bold text-white tracking-wide bg-blue-500 rounded-full transition-all duration-300 ease-in-out hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Find all Jobs
            </button>
          </div>
      
          {/* Image Grid Section */}
          <div className="w-full md:w-1/2 grid grid-cols-3 gap-2 mb-8 md:mb-0 h-92">
            <div className="flex justify-center items-center">
              <img
                src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66bae5c7e54cdc65719ba140_hero-03.avif"
                className="rounded-full w-24 sm:w-32 md:w-full h-auto object-cover mt-4"
                alt=""
              />
            </div>
            <div className="flex justify-center items-center">
              <img
                src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66bae83fe8f487da2a990ee7_decoration-03.svg"
                className="w-10 sm:w-12 md:w-full"
                alt=""
              />
            </div>
            <div className="flex justify-center items-center">
              <img
                src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66bae5c7ee7f9fa6efcfa1f7_hero-02.avif"
                className="rounded-full w-24 sm:w-32 md:w-full h-auto object-cover mt-4"
                alt=""
              />
            </div>
            <div className="flex justify-center items-center">
              <img
                src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66bae818f1012d546f1f1264_decoration-02.svg"
                className="w-10 sm:w-12 md:w-full"
                alt=""
              />
            </div>
            <div className="flex justify-center items-center">
              <img
                src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66bae5c7e8f487da2a96abcd_hero-01.avif"
                className="rounded-full w-24 sm:w-32 md:w-full h-auto object-cover mb-4"
                alt=""
              />
            </div>
            <div className="flex justify-center items-center">
              <img
                src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66bae81a970af5e30ebd7230_decoration-01.svg"
                className="w-10 sm:w-12 md:w-full"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      
    )
}

export default Hero
