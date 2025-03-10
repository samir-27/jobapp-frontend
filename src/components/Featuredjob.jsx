import FeaturedJobCard from "./FeaturedJobCard"

const Featuredjob = () => {
  return (
    <div className="bg-indigo-100">
        <div className="container mx-auto">
        <h1 className="text-black text-4xl font-bold py-10">Featured job</h1>
        <div className="grid grid-cols-2 gap-x-40 gap-y-10">
        <FeaturedJobCard />
        <FeaturedJobCard />
        <FeaturedJobCard />
        <FeaturedJobCard />
        <FeaturedJobCard />
        <FeaturedJobCard />
        </div>
        <div>
        <button className="relative w-52 px-8 py-4 my-10 text-lg font-bold text-white tracking-wide bg-indigo-500 rounded-full">
                       Find all Jobs
                    </button>
        </div>
        </div>
    </div>
  )
}

export default Featuredjob