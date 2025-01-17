import React, { useState } from "react";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useDocumentTitle from "../../components/DocTitle";
import QRCode from "qrcode.react";

const sessions = [
  {
    title: "Opening Session",
    time: "9:00 - 10:30",
    details: [
      { name: "Session Chair", role: "Nawa Raj Dhakal, AEPC-ED, Chairperson" },
      {
        name: "Chief Guest",
        role: "Mr. Dipak Khadka, Hon'ble Minister, MoEWRI",
      },
      {
        name: "Special Guest",
        role: "Dr. Ram Prasad Dhital, ERC, Chairperson",
      },
      {
        name: "Keynote",
        role: "Energy Transition for Resilient and Low Carbon Economy by Prof. Dr. Shobhakar Dhakal (TBC)",
      },
    ],
  },
  {
    title:
      "Session 1: Energy Transition - Sectoral Needs, Opportunities, and Challenges",
    time: "10:45 - 12:15",
    details: [
      {
        name: "Session Chair",
        role: "Mr. Sandip Kumar Dev, Joint Secretary, MoEWRI",
      },
      {
        name: "Keynote",
        role: "Energy Transition in Nepalese Context by Dr. Shree Raj Shakya",
      },
      {
        name: "S1",
        role: "Energy Development Framework by MoEWRI Representative",
      },
      { name: "S2", role: "Power Sector by NEA Representative" },
    ],
  },
  {
    title: "Networking Lunch",
    time: "12:15 - 13:30",
    details: [
      { name: "Observation", role: "Project Showcasing and Networking" },
    ],
  },
  {
    title: "Session 3: Investment & Climate Finance",
    time: "13:30 - 15:00",
    details: [
      {
        name: "Session Chair",
        role: "Mr. Dhani Ram Sharma, Joint Secretary, MoF",
      },
      {
        name: "Keynote",
        role: "Trends in Climate Financing by Mr. Manjeet Dhakal",
      },
      { name: "S1", role: "Energy Financing Overview by MoF Representative" },
      { name: "S2", role: "World Bank Portfolio by WB Representative (TBC)" },
    ],
  },
];

const SessionDetails = () => {
  useDocumentTitle("Session Details - Energy Summit 2025");
  const [qrVisible, setQrVisible] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  const handleQrClick = (session) => {
    setCurrentSession(session);
    setQrVisible(true);
  };

  const closeQrPopup = () => {
    setQrVisible(false);
    setCurrentSession(null);
  };

  return (
    <>
      <Navbar />
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        <div
          className="text-4xl font-bold text-blue-800 text-center mb-10"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          Session Details
        </div>

        <div className="space-y-8">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 text-left transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ animation: "slideUp 0.8s ease-out forwards" }}
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                {session.title}
              </h3>
              <p className="text-md font-semibold text-gray-600 mb-4">
                Time: {session.time}
              </p>
              <ul className="list-disc pl-5 space-y-2">
                {session.details.map((detail, i) => (
                  <li key={i} className="text-gray-700">
                    <strong>{detail.name}:</strong> {detail.role}
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-800 transition duration-300"
                onClick={() => handleQrClick(session)}
              >
                View QR Code
              </button>
            </div>
          ))}
        </div>

        {qrVisible && currentSession && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 flex flex-col items-center text-center relative">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                {currentSession.title}
              </h3>
              <QRCode
                className="mx-auto"
                value={currentSession.title}
                size={200}
              />
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-800 transition duration-300"
                onClick={closeQrPopup}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SessionDetails;
