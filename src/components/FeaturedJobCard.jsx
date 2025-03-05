const FeaturedJobCard = () => {
  return (
    <div>
        <div className="flex items-center bg-white p-5 gap-5 rounded">
            <img className="" src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c5f/66bf2b9a2ff5d8f19427f6db_job-07.svg" alt="" />
            <div>
                <h1 className="text-xl font-bold">Full Stack Developer</h1>
                <div className="flex py-2 gap-5">
                    <div className="flex gap-2">
                    <img src="https://cdn-icons-png.flaticon.com/128/639/639343.png" className="h-5 w-5" alt="" /><h1> 3 - 5 years</h1>
                    </div>
                    <div className="flex gap-2">
                    <img src="https://cdn-icons-png.flaticon.com/128/3135/3135679.png" className="h-5 w-5" alt="" /><h1> 3k$ - 5k$ USD</h1>
                    </div>
                    <div className="flex gap-2">
                    <img src="https://cdn-icons-png.flaticon.com/128/535/535137.png" className="h-5 w-5" alt="" /><h1> 3 - 5 years</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FeaturedJobCard
