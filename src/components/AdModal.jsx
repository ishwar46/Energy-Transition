// AdModal.js
import React, { useState, useEffect } from "react";
import adImage from "../assets/images/app ads.png";
import qrCode from "../assets/images/qr.gif";

const AdModal = ({ onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(8);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onClose();
    }
  }, [secondsLeft, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg text-center max-w-lg">
        <p className="text-lg font-bold mb-4 text-blue-800">
          The 36th ACSIC Conference Mobile App is Live Now!
        </p>

        {/* Image Section */}
        <div className="flex justify-center items-center mb-4">
          <img
            src={adImage}
            alt="Ad"
            className="w-full max-w-md md:max-w-lg h-auto"
          />
        </div>

        {/* QR Code and Text Section */}
        <div className="flex flex-col items-center mb-4">
          <img src={qrCode} alt="QR Code" className="w-24 h-auto mb-2" />
          <p className="text-md font-semibold text-gray-700">
            Scan the QR code to download the app!
          </p>
        </div>

        {/* Skip Ad and Close Ad Buttons */}
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mb-2"
        >
          Skip ({secondsLeft})
        </button>
        <br />
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Close Ad
        </button>
      </div>
    </div>
  );
};

export default AdModal;
