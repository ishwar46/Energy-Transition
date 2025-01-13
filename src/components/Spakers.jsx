import React from "react";
import "../css/animations.css";
import Navbar from "./Navbar";
import ComingSoon from "./ComingSoon";

const Speakers = () => {
  return (
    <>
      <Navbar />
      <div className="Accomodation container px-5 mx-auto mt-10">
        <div
          className="text-3xl font-bold text-blue-800 pt-5 text-center"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          Speakers
          <ComingSoon />
        </div>
      </div>
      {/* <div className="mt-5 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-8 mb-10">
          {speakers.map((speaker, index) => (
            <div
              key={index}
              className="max-w-sm rounded-lg overflow-hidden shadow-lg transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl bg-white hover:bg-blue-50"
              style={{
                animation: "slideUp 0.8s ease-out forwards",
                animationDelay: `${index * 100}ms`,
              }}
            >
              <img
                className="w-full object-cover h-48 transition duration-500 ease-in-out transform hover:scale-110 hover:opacity-90"
                src={speaker.img}
                alt={speaker.name}
                aria-label={`Image of speaker ${speaker.name}`}
              />
              <div className="p-4 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:text-blue-800">
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {speaker.name}
                </div>
                <div className="text-gray-700">
                  {speaker.title} at {speaker.organization}
                </div>
                <div className="text-gray-600 italic mb-3">
                  Topic: {speaker.topic}
                </div>
              </div>
            </div>
          ))}
        </div> */}
    </>
  );
};

export default Speakers;
