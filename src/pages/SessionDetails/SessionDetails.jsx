import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useDocumentTitle from "../../components/DocTitle";
import sessions from "../../../src/data/sessions";

const SessionDetails = () => {
  useDocumentTitle("Session Details - Energy Summit 2025");

  const [speakersModalVisible, setSpeakersModalVisible] = useState(false);
  const [selectedSessionSpeakers, setSelectedSessionSpeakers] = useState([]);

  const openSpeakersModal = (speakers) => {
    setSelectedSessionSpeakers(speakers);
    setSpeakersModalVisible(true);
  };

  const closeSpeakersModal = () => {
    setSpeakersModalVisible(false);
    setSelectedSessionSpeakers([]);
  };

  return (
    <>
      <Navbar />
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        {/* Hero Section */}
        <div
          className="text-center bg-gradient-to-r from-blue-700 via-teal-500 to-blue-700 text-white py-12 rounded-lg shadow-lg"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          <h1 className="text-4xl font-extrabold mb-4">Session Details</h1>
          <p className="text-lg font-medium">
            Explore the agenda, speakers, and highlights of Energy Summit 2025.
          </p>
        </div>

        {/* Swiper Slider */}
        <div className="mt-10">
          <Swiper
            modules={[Pagination, EffectCoverflow]}
            pagination={{ clickable: true }}
            effect="coverflow"
            centeredSlides
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 30 },
              768: { slidesPerView: 2, spaceBetween: 40 },
              1024: { slidesPerView: 3, spaceBetween: 50 },
            }}
            loop
            className="rounded-lg shadow-lg"
          >
            {sessions.map((session, index) => (
              <SwiperSlide
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-blue-800 mb-4">
                  {session.title}
                </h3>
                <p className="text-md font-semibold text-gray-600 mb-4">
                  Time: {session.time}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  {session.program.map((item, i) => (
                    <li key={i} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => openSpeakersModal(session.details)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Show All Speakers
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Speakers Modal */}
      {speakersModalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-lg relative">
            <button
              onClick={closeSpeakersModal}
              className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
            >
              ✕
            </button>
            <h4 className="text-2xl font-bold text-center mb-6">
              Speakers Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {selectedSessionSpeakers.map((speaker, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                  />
                  <h5 className="text-md font-semibold text-center text-blue-800">
                    {speaker.name}
                  </h5>
                  <p className="text-sm text-center text-gray-600">
                    {speaker.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default SessionDetails;
