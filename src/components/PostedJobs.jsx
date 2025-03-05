import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import CompanyJobCard from "./CompanyJobCard";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

    const token = localStorage.getItem("authToken")
    const decodedToken = jwtDecode(token);
    // console.log("decoded",decodedToken.id)
    const ComId = decodedToken.id;
   
    // console.log("token from company page",token)

  const fetchJobs = async () => {
    try {
      const response = await fetch(`http://localhost:3000/jobs/company/${ComId}`);
      const data = await response.json();
      // console.log("job data:",data)
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  useEffect(() => {
    fetchJobs();
  },);

  return (
    <div className="p-3">
      <div className="flex sm:flex-row gap-10 flex-col">
        <div className="w-full">
          <div className="">
            {jobs.map((job) => (
              <CompanyJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
