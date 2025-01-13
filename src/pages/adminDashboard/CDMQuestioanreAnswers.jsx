/* eslint-disable react/jsx-pascal-case */
import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/animations/answers.json";
import pdfFile from "../../assets/ACSIC_36_CDM Questionnaire _Detailed_Report_Final.pdf";
import logo from "../../assets/acsic.png";

function CdmQuestionnaireAnswers() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const openPdf = () => {
    window.open(pdfFile, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4 md:p-6">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center max-w-4xl w-full">
        <img
          src={logo}
          alt="Brand Logo"
          className="mx-auto mb-6 h-16 w-auto md:h-20"
        />{" "}
        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4 md:mb-6">
          HI, HERE ARE THE DETAILED REPORT ON THE CHIEF DELEGATES' MEETING
          QUESTIONNAIRE RESULTS 2024
        </h1>
        <div className="mb-4 md:mb-6">
          <Lottie
            options={defaultOptions}
            height={300}
            width={300}
            className="mx-auto"
          />
        </div>
        <button
          onClick={openPdf}
          className="bg-green-800 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Open PDF
        </button>
      </div>
    </div>
  );
}

export default CdmQuestionnaireAnswers;
