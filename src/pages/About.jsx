import About2 from "../components/About2";
import AboutHero from "../components/AboutHero";

const About = () => {
  const SmallCard = ({ number, text }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">{number}</h1>
        <h2 className="text-gray-600">{text}</h2>
      </div>
    );
  };

  return (
    <>
    <div className="bg-blue-50">

      <AboutHero />
      <div className="grid grid-cols-4 gap-6 container mx-auto py-10">
        <SmallCard number="100+" text="Registered" />
        <SmallCard number="50+" text="Active Users" />
        <SmallCard number="10+" text="New Members" />
        <SmallCard number="500+" text="Total Posts" />
      </div>
      <About2 />
    </div>
    </>
  );
};

export default About;
