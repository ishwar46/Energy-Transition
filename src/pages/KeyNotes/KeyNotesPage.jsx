import React from "react";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import logo from "../../assets/acsic.png";
import keynotePdfDay2 from "../../assets/pdf/Acsic Day-2 highlights session wise.pdf";
import keynotePdfDay3 from "../../assets/pdf/Day3_Key_High_Lights_compressed.pdf";
import keynotePdfDay4 from "../../assets/pdf/Session_10th.pdf";
import { FaHandPointRight } from "react-icons/fa";
import useDocumentTitle from "../../components/DocTitle";

const Keynotes = () => {
  const openPdfDay2 = () => {
    window.open(keynotePdfDay2, "_blank");
  };

  const openPdfDay3 = () => {
    window.open(keynotePdfDay3, "_blank");
  };

  const openPdfDay4 = () => {
    window.open(keynotePdfDay4, "_blank");
  };

  useDocumentTitle("Key-Highlights - ACSIC Conference");

  return (
    <>
      <Navbar />
      <div className="relative container mx-auto px-4 mt-10 mb-10">
        <div
          className="absolute inset-0 flex justify-center items-center"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            opacity: 0.1,
            zIndex: 0,
          }}
        ></div>

        <div
          className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-bold text-blue-800 text-center"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          Key Highlights
        </div>

        <div className="relative z-10 mt-8">
          {/* Day 2 PDF */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
            <FaHandPointRight className="text-green-600 h-6 w-6 md:h-8 md:w-8" />
            <h1
              className="relative z-10 text-lg md:text-xl lg:text-2xl font-bold text-blue-600 cursor-pointer underline"
              style={{ animation: "fadeIn 1s ease-out" }}
              onClick={openPdfDay2}
            >
              Click here to view the Day 2 Key Highlights
            </h1>
          </div>

          {/* Day 3 PDF */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
            <FaHandPointRight className="text-green-600 h-6 w-6 md:h-8 md:w-8" />
            <h1
              className="relative z-10 text-lg md:text-xl lg:text-2xl font-bold text-blue-600 cursor-pointer underline"
              style={{ animation: "fadeIn 1s ease-out" }}
              onClick={openPdfDay3}
            >
              Click here to view the Day 3 Key Highlights
            </h1>
          </div>
        </div>

          {/* Day 4 PDF */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
            <FaHandPointRight className="text-green-600 h-6 w-6 md:h-8 md:w-8" />
            <h1
              className="relative z-10 text-lg md:text-xl lg:text-2xl font-bold text-blue-600 cursor-pointer underline"
              style={{ animation: "fadeIn 1s ease-out" }}
              onClick={openPdfDay4}
            >
              Click here to view the Day 4 Key Highlights
            </h1>
          </div>
      </div>
    </>
  );
};

export default Keynotes;
