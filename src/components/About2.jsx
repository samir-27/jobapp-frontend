const About2 = () => {
  return (
    <div>
      <div   className="container mx-auto">
        <div   className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div   className="text-center md:text-left mb-12 md:mb-0 flex flex-col justify-center">
                <h1   className="text-4xl font-bold mb-4">Our core mission</h1>
                <p   className="text-lg mb-6">
                    At the heart of everything we do is a commitment to excellence, innovation, and integrity. Our core mission is to deliver exceptional value to our customers while driving sustainable growth and making a positive impact on the world.
                </p>
                <ul   className="list-disc list-inside text-left mx-auto md:mx-0 max-w-2xl">
                    <li>Deliver exceptional value to our customers.</li>
                    <li>Drive innovation and continuous improvement.</li>
                    <li>Foster a culture of integrity and transparency.</li>
                    <li>Promote sustainable practices and growth.</li>
                </ul>
            </div>
            <div   className="flex justify-center">
                <img alt="Two men in a business meeting, discussing over a laptop"   className="rounded-lg shadow-lg h-96 w-full object-cover" height="400" src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66c43831462845475c2d7704_vision-01.avif"/>
            </div>
            <div   className="flex justify-center">
                <img alt="A group of people in a meeting, with a woman presenting in front of a whiteboard"   className="rounded-lg shadow-lg  h-96 w-full object-cover" height="400" src="https://cdn.prod.website-files.com/66b757e42412d2f5e0906c3d/66c438319d796978ec1f4909_mission-01.avif" />
            </div>
            <div   className="text-center md:text-left mt-12 md:mt-0 flex flex-col justify-center">
                <h2   className="text-4xl font-bold mb-4">Vision &amp; values</h2>
                <p   className="text-lg mb-6">
                    Our vision is to lead purposefully, inspiring innovation and excellence in everything we do. Guided by our core values, we strive to create a positive impact on our industry, our customers, and the world.
                </p>
                <ul   className="list-disc list-inside text-left mx-auto md:mx-0 max-w-2xl">
                    <li>Lead with innovation and excellence.</li>
                    <li>Empower communities for a sustainable future.</li>
                    <li>Revolutionize our industry with technology.</li>
                    <li>Inspire change and drive progress.</li>
                    <li>Improve lives and shape a better tomorrow.</li>
                </ul>
            </div>
        </div>
    </div>
    </div>
  )
}

export default About2
