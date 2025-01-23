import React, { useState, useEffect, useCallback } from "react";
import { getEventPdfsApi } from "../../apis/Api";
import toast from "react-hot-toast";
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

  const [pdfs, setPdfs] = useState([]);
  const [speakersModalVisible, setSpeakersModalVisible] = useState(false);
  const [selectedSessionSpeakers, setSelectedSessionSpeakers] = useState([]);

  // Fetch PDFs from API
  const fetchPdfs = useCallback(async () => {
    try {
      const response = await getEventPdfsApi();
      if (response.data.success) {
        setPdfs(response.data.files);
      } else {
        toast.error("Failed to fetch PDFs.");
      }
    } catch (error) {
      toast.error("Error fetching PDFs.");
      console.error("Error fetching PDFs:", error);
    }
  }, []);

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  // Open Speakers Modal
  const openSpeakersModal = (speakers) => {
    setSelectedSessionSpeakers(speakers);
    setSpeakersModalVisible(true);
  };

  // Close Speakers Modal
  const closeSpeakersModal = () => {
    setSpeakersModalVisible(false);
    setSelectedSessionSpeakers([]);
  };

  return (
    <>
      <Navbar />
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center bg-gradient-to-r from-blue-700 via-teal-500 to-blue-700 text-white py-12 rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold mb-4">Session Details</h1>
          <p className="text-lg font-medium">
            Explore the agenda, speakers, and highlights of Energy Summit 2025.
          </p>
        </div>

        {/* Swiper Section */}
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
                className="group bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-lg shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                {/* Session Title */}
                <h3 className="text-md text-blue-800 mb-2 text-center">
                  {session.title}
                </h3>

                {/* Separator */}
                <div className="w-10 mx-auto border-b-2 border-blue-500 mb-4"></div>

                {/* Session Time */}
                <p className="text-xs text-gray-600 text-center mb-4">
                  <span className="font-bold text-blue-600">Time:</span>{" "}
                  {session.time}
                </p>

                {/* Program List */}
                <div className="overflow-y-auto max-h-40 px-2">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {session.program.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Show All Speakers Button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => openSpeakersModal(session.details)}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-teal-600 transition"
                  >
                    Show Guest/Speakers
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* PDF Section */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Download Session Details
          </h2>
          <div className="space-y-6">
            {pdfs.map((pdf) => (
              <div key={pdf} className="">
                <div className="flex space-x-4">
                  {/* Download PDF Button */}
                  <a
                    href={`https://energy-transition-api.onrender.com/public/uploads/eventPdfs/${pdf}`}
                    download
                    className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Speakers Modal */}
      {speakersModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh] w-11/12 max-w-4xl p-8 mt-4 mb-4">
            {/* Close Button */}
            <button
              onClick={closeSpeakersModal}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              ✕
            </button>

            {/* Modal Title */}
            <h4 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Guest/Speaker Details
            </h4>

            {/* Speaker Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {selectedSessionSpeakers.map((speaker, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-5 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-lg object-cover mb-4 transition-transform transform group-hover:scale-110"
                  />
                  {/* Name */}
                  <h5 className="text-sm font-normal text-blue-800 text-center">
                    {speaker.name}
                  </h5>
                  {/* Role */}
                  <p className="text-xs text-gray-600 text-center mt-2 italic">
                    {speaker.role}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer or Extra Info */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Energy Transition for Resilient and Low Carbon Economy Summit
                2025.
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default SessionDetails;
