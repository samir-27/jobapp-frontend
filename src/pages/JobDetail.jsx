import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/jobs/${id}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetail();
  }, [id]);
  console.log(job);
  if (!job) {
    return <div>Loading job details...</div>;
  }
  const handleApplyNow = () => {

  };

  return (
    <div className="py-8">
      <div className="flex pb-4">
        <div>
          <img className="rounded-full w-14 h-14 object-cover" src="https://bookface-images.s3.amazonaws.com/small_logos/5a28987b3e1b3effc2a33ce770fc25f4424fc775.png" alt="" />
        </div>
        <div className="my-auto px-2">
          <h1 className="text-2xl">  {job.companyName}</h1>
        </div>
      </div>
      <div>
        <div className="border border-gray-300  rounded-md p-3 mt-3 lg:w-2/3 ">
          <div className="pb-2">
            <h1 className="text-xl">{job.role}</h1>
            <p className="font-bold text-lg">${job.salary}</p>
          </div>
          <div className="flex py-2 pb-5 border-b">
            <div className="">
              <h2 className="font-bold">Location</h2>
              <h2 className="">{job.location}</h2>
            </div>
            <div className="mx-4">
              <h2 className="font-bold">Job-Type</h2>
              <h2 className="">{job.jobType}</h2>
            </div>
            <div className="">
              <h2 className="font-bold">Experience</h2>
              <h2 className="">{job.experience}</h2>
            </div>
          </div>
          {/* <div className="py-3">
            <h2 className="font-bold">Skills</h2>
            {job.skills.map((skill, index) => (
              <h2 key={index} className="">{skill}</h2>
            ))}
          </div> */}
          <button
            onClick={handleApplyNow}
            className="mt-4  px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Apply Now
          </button>
        </div>
      </div>
      <h1 className="text-2xl my-6">About The Role</h1>
      <p>{job.description}</p>
      <div>
        <h1 className="text-xl font-semibold my-4 text-indigo-500 uppercase">Skills:</h1>
        <ul className="list-disc pl-5">
        {job.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <div>
        <h1 className="text-xl font-semibold my-4 text-indigo-500 uppercase">Responsibilities:</h1>
        <ul className="list-disc pl-5">
          {job.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </div>
      <div>
        <h1 className="text-xl font-semibold my-4 text-indigo-500 uppercase">Requirements:</h1>
        <ul className="list-disc pl-5">
          {job.requirements.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </div>
      <div>
        <h1 className="text-xl font-semibold my-4 text-indigo-500 uppercase">Nice to Have:</h1>
        <ul className="list-disc pl-5">
          {job.niceToHave.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default JobDetailPage;
