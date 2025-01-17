import React, { useState } from "react";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useDocumentTitle from "../../components/DocTitle";
import QRCode from "qrcode.react";
import userimg from "../../assets/images/logo.jpg";

const sessions = [
  {
    title: "Opening Session",
    time: "9:00 - 10:30",
    program: [
      "Registration",
      "Call on Dias",
      "Welcome and Program Objective by Dr. Narayan Prasad Adhikari",
      "Program Inauguration by Hon'ble Minister",
      "Keynote Presentation by Prof. Dr. Shobhakar Dhakal",
      "Launching of Nepal Solar Thermal Roadmap Development",
      "Remarks by Dr. Pema Gyamtsho, Ms. Gauri Singh, and other dignitaries",
      "Closing Remarks and Vote of Thanks by Mr. Nawa Raj Dhakal",
    ],
    details: [
      {
        name: "Session Chair",
        role: "Nawa Raj Dhakal, AEPC-ED, Chairperson",
        image: userimg,
      },
      {
        name: "Chief Guest",
        role: "Mr. Dipak Khadka, Hon'ble Minister, MoEWRI",
        image: userimg,
      },
      {
        name: "Special Guest",
        role: "Dr. Ram Prasad Dhital, ERC, Chairperson",
        image: userimg,
      },
      {
        name: "Keynote",
        role: "Energy Transition for Resilient and Low Carbon Economy by Prof. Dr. Shobhakar Dhakal",
        image: userimg,
      },
    ],
  },
  {
    title:
      "Session 1: Energy Transition - Sectoral Needs, Opportunities, and Challenges",
    time: "10:45 - 12:15",
    program: [
      "Keynote: Energy Transition in Nepalese Context by Dr. Shree Raj Shakya",
      "Energy Transition Initiatives under Energy Development Framework",
      "Energy Transition in Nepalese Power Sector",
      "Energy Transition in Industrial and Transport Sector",
      "Energy Transition in Agricultural Sector",
      "Energy Transition in Households Sector",
      "Private Sector Perspectives on Energy Transition",
    ],
    details: [
      {
        name: "Session Chair",
        role: "Mr. Sandip Kumar Dev, Joint Secretary, MoEWRI",
        image: userimg,
      },
      {
        name: "Keynote",
        role: "Energy Transition in Nepalese Context by Dr. Shree Raj Shakya",
        image: userimg,
      },
      {
        name: "S1",
        role: "Energy Development Framework by MoEWRI Representative",
        image: userimg,
      },
      {
        name: "S2",
        role: "Power Sector by NEA Representative",
        image: userimg,
      },
    ],
  },
  {
    title:
      "Session 2: Energy Transition - Towards Achieving Net Zero and Resilient Economy",
    time: "10:45 - 12:15",
    program: [
      "Keynote: Global and Regional Initiatives for Net Zero Transition by Dr. Kavita Rai",
      "Nepal’s Climate Change Programs and Projects for Net Zero and Climate Resilience",
      "Nepal’s Green Taxonomy and its Interlinkages for Net Zero and Resilient Economy",
      "Energy Transition Agenda in Nepal’s NDC, Implementation Strategies for Meeting NDC and Net Zero",
      "Bridging Gaps for Achieving National NDC through Carbon Markets",
      "Powering People and Planet through Clean Energy",
      "Role of Climate Adaptation Projects for Net Zero Transition and Resilient Economy",
    ],
    details: [
      {
        name: "Session Chair",
        role: "Dr. Maheshwar Dhakal, Joint Secretary, CCMD Chief, MoFE",
        image: userimg,
      },
      {
        name: "Keynote",
        role: "Global and Regional Initiatives for Net Zero Transition by Dr. Kavita Rai",
        image: userimg,
      },
      {
        name: "Speaker",
        role: "Nepal’s Climate Change Programs and Projects by Mr. Naresh Sharma",
        image: userimg,
      },
      {
        name: "Speaker",
        role: "Nepal’s Green Taxonomy by NRB Representative",
        image: userimg,
      },
    ],
  },
  {
    title: "Session 3: Investment & Climate Finance for Energy Transition",
    time: "13:30 - 15:00",
    program: [
      "Keynote: Recent Trends of Development and Climate Financing by Mr. Manjeet Dhakal",
      "Nepal’s Overall Energy and Climate Financing Overview",
      "World Bank’s Current and Future Investment Portfolio in Energy and Climate Sector",
      "ADB’s Current and Future Investment Portfolio in Energy and Climate Sector",
      "Domestic Financing for Energy Transition by Nepalese Banking and Financial Institutes",
      "Private Sectors Perspectives on Financing of Nepalese Renewable Energy",
    ],
    details: [
      {
        name: "Session Chair",
        role: "Mr. Dhani Ram Sharma, Joint Secretary, MoF",
        image: userimg,
      },
      {
        name: "Keynote",
        role: "Recent Trends of Development and Climate Financing by Mr. Manjeet Dhakal",
        image: userimg,
      },
      {
        name: "Speaker",
        role: "Nepal’s Overall Energy and Climate Financing Overview",
        image: userimg,
      },
      {
        name: "Speaker",
        role: "World Bank Portfolio by WB Representative",
        image: userimg,
      },
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
                {session.program.map((item, i) => (
                  <li key={i} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Speakers:
                </h4>
                <ul className="list-none pl-0 space-y-4">
                  {session.details.map((detail, i) => (
                    <li key={i} className="flex items-center space-x-4">
                      <img
                        src={detail.image}
                        alt={detail.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                      />
                      <div>
                        <p className="text-md font-semibold text-gray-700">
                          {detail.name}
                        </p>
                        <p className="text-sm text-gray-500">{detail.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
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
                value={`${
                  window.location.origin
                }/questions-form?session=${encodeURIComponent(
                  currentSession.title
                )}`}
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
