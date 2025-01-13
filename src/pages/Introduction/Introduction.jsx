import React from "react";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useDocumentTitle from "../../components/DocTitle";
import logo from "../../assets/images/leologo.png";

const Introduction = () => {
  useDocumentTitle("Introduction - International Youth Camp 2025");

  return (
    <>
      <Navbar />
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-10 max-w-5xl">
        {/* Background Logo */}
        <div
          className="absolute inset-0 flex justify-center items-center opacity-10 z-0"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
          }}
        ></div>

        {/* Page Title */}
        <div
          className="relative z-10 text-4xl font-bold text-blue-800 pt-5 text-center mb-10"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          International Youth Camp 2025
        </div>

        {/* Introduction Paragraphs */}
        <div
          className="relative z-10 text-lg text-gray-700 text-justify mx-auto mb-10 leading-relaxed"
          style={{
            animation: "slideUp 0.8s ease-out forwards",
          }}
        >
          <p className="mb-6">
            The International Youth Camp 2025, hosted by Leo District Council
            325 L Nepal under the auspices of Lions Club International District
            325 L Nepal, is a culture designed to unite young leaders from
            around the globe to experience Nepal’s rich cultural heritage,
            diverse landscapes, and get involved in the enduring spirit of
            community service. This flagship event provides a dynamic platform
            for leadership development, cultural exchange, and social
            responsibility, allowing participants to grow both personally and
            professionally.
          </p>
          <p className="mb-6">
            Participants in this immersive camp will engage in workshops that
            focus on essential skills like leadership, public speaking,
            entrepreneurship, and personal growth, empowering them to thrive in
            today’s interconnected world. In addition to skill-building, the
            camp will include team-building challenges and activities that
            promote resilience, collaboration, and creative problem-solving.
            Through these activities, young leaders will have the chance to
            develop strong bonds, fostering mutual respect and a global network
            of friendships.
          </p>
          <p>
            A core emphasis of the camp is also social commitment, with
            participants encouraged to collaborate in community service
            initiatives amongst the participating Leo Clubs. Beyond skill
            development, the camp fosters a vibrant environment of
            cross-cultural networking, understanding and unity, enabling
            participants to experience the unique cultural diversity of Nepal
            and engage with local communities. The International Youth Camp 2025
            thus aligns seamlessly with the mission of Lions Club International
            by encouraging youth empowerment and global awareness. As
            participants leave with strengthened leadership abilities, a
            commitment to service, and lifelong friendships, they will carry
            forward the values of empathy, responsibility, and a passion for
            positive change in their communities and beyond.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10 relative z-10">
          <a
            href="/register"
            className="inline-block py-3 px-6 bg-green-700 text-white rounded hover:bg-blue-900 transition-colors cursor-pointer text-lg font-semibold shadow-lg"
          >
            Register for the Camp
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Introduction;
