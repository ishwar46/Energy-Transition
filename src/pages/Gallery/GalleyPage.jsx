import React, { useState } from "react";
import "../../css/animations.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import img1 from "../../assets/images/limited.jpeg";
import momo from "../../assets/images/momo.jpeg";
import past1 from "../../assets/images/past2.jpeg";
import past2 from "../../assets/images/past.jpeg";
import past3 from "../../assets/images/past3.jpeg";
import past4 from "../../assets/images/past4.jpeg";
import past5 from "../../assets/images/past5.jpeg";
import bone from "../../assets/images/bone.jpeg";
import nepali from "../../assets/images/nepali.jpeg";
import safari from "../../assets/images/safari.jpeg";
import leoe from "../../assets/images/2025.jpeg";
import rhitu from "../../assets/images/rhitu.jpg";
import leoOlympics from "../../assets/images/leoOlympics.jpg";
import ctv from "../../assets/images/ctv.jpg";

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("current");

  const currentEventImages = [
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: past4,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: rhitu,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: past5,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: img1,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: ctv,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: momo,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: safari,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: leoOlympics,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: bone,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: nepali,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: past3,
    },
  ];
  
  const pastEventImages = [
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: past1,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: past2,
    },
    {
      title: "Crown The Vision",
      description: "Crown The Vision",
      src: leoe,
    },

  ];

  // const openModal = (image) => {
  //   setSelectedImage(image);
  // };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const renderImageSection = (images) => (
    <div className="container mx-auto px-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              alt={image.title}
              className="block w-full h-auto object-cover rounded-lg transition duration-500 transform hover:scale-110"
              src={image.src}
              style={{ aspectRatio: "1 / 1" }}
              loading="lazy"
            />
            <div
              // onClick={() => openModal(image)}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500 cursor-pointer"
            >
              <p className="text-white text-lg px-4 text-center">
                {image.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        <div className="text-3xl font-bold text-blue-800 pt-5 text-center">
          Gallery
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mt-8">
          <button
            className={`px-6 py-2 font-semibold text-lg ${
              activeTab === "current"
                ? "text-blue-800 border-b-2 border-blue-800"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("current")}
          >
            Glimpses of Excitement: Youth Camp 2025
          </button>
          <button
            className={`px-6 py-2 font-semibold text-lg ${
              activeTab === "past"
                ? "text-blue-800 border-b-2 border-blue-800"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Our Journey of Service: Highlights from Past
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "current" 
          ? renderImageSection(currentEventImages)
          : renderImageSection(pastEventImages)}
      </div>

      <Footer />

      {selectedImage && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-4 border-b border-solid border-gray-200 rounded-t">
                  <h3 className="text-xl font-semibold text-black">
                    {selectedImage.title}
                  </h3>
                  <button
                    className="text-gray-600 hover:text-gray-900 text-xl"
                    onClick={closeModal}
                  >
                    &times;
                  </button>
                </div>
                <div className="relative p-4 flex-auto overflow-y-auto max-h-96">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {selectedImage.description}
                  </p>
                </div>
                <div className="flex items-center justify-end p-4 border-t border-solid border-gray-200 rounded-b">
                  <button
                    className="bg-red-500 text-white font-bold text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
};

export default GallerySection;
