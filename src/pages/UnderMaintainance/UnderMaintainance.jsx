import React, { useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/animations/under_main.json";

const UnderMaintenance = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const parallaxElements = document.querySelectorAll(".parallax");
      parallaxElements.forEach((element) => {
        const speed = element.getAttribute("data-speed");
        const yPos = window.pageYOffset * speed;
        element.style.transform = `translateY(${yPos}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden animate-gradient">
      {/* SVG Wave Background */}
      <div className="absolute bottom-0 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="fill-current text-white opacity-20"
        >
          <path
            fillOpacity="1"
            d="M0,224L80,218.7C160,213,320,203,480,213.3C640,224,800,256,960,240C1120,224,1280,160,1360,128L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Parallax Animated Background Elements */}
      <div
        className="absolute w-72 h-72 bg-blue-400 opacity-30 rounded-full filter blur-2xl parallax"
        data-speed="0.2"
      ></div>
      <div
        className="absolute w-96 h-96 bg-purple-400 opacity-20 rounded-full filter blur-2xl parallax"
        data-speed="0.5"
      ></div>
      <div
        className="absolute w-64 h-64 bg-pink-400 opacity-30 rounded-full filter blur-2xl parallax"
        data-speed="0.3"
      ></div>

      <div className="relative bg-white rounded-lg shadow-lg p-8 text-center max-w-lg mx-4 z-10">
        <Lottie options={defaultOptions} height={300} width={300} />
        <h1 className="text-4xl font-extrabold text-gray-900 mt-6 animate-fadeInUp">
          We'll Be Right Back!
        </h1>
        <p className="text-lg text-gray-600 mt-4 animate-fadeInUp delay-1s">
          We're currently performing some maintenance to improve your
          experience. Please check back soon!
        </p>
        <button className="mt-6 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 animate-bounce">
          CONTACT SUPPORT
        </button>
      </div>
    </div>
  );
};

export default UnderMaintenance;
