import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ApplyJobCard from "./ApplyJobCard";

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const authToken = localStorage.getItem("authToken");
  const decodeToken = jwtDecode(authToken);
  const userID = decodeToken.id;

  useEffect(() => {
    fetch(`http://localhost:3000/users/${userID}`)
      .then((res) => res.json())
      .then((user) => {
        if (user.appliedJobs?.length) {
          return Promise.all(
            user.appliedJobs.map((id) =>
              fetch(`http://localhost:3000/jobs/${id}`).then((res) => res.json())
            )
          );
        }
        return [];
      })
      .then(setJobs);
  }, [userID]);

  return (
<div className="min-h-screen">
  {jobs.length === 0 ? (
    <div className="text-center text-gray-600 text-lg mt-10">
      You haven't applied to any jobs yet.
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {jobs.map((job) => (
        <ApplyJobCard key={job._id} job={job} />
      ))}
    </div>
  )}
</div>

  );
};

export default AppliedJobs;
