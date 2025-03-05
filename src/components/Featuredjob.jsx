import FeaturedJobCard from "./FeaturedJobCard"

const Featuredjob = () => {
  return (
    <div className="py-10 bg-indigo-100">
        <div className="container mx-auto">
        <h1 className="text-black text-4xl font-bold">Featured job</h1>
        <div className="flex grid-cols-3 gap-5">
        <FeaturedJobCard />
        <FeaturedJobCard />
        <FeaturedJobCard />
        </div>
        </div>
    </div>
  )
}

export default Featuredjob