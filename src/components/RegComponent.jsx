import React from "react";
import Draggable from "react-draggable";

const RegistrationNotification = () => {
  return (
    <Draggable
      bounds="parent"
      handle=".handle"
      defaultPosition={{ x: 0, y: 0 }}
    >
      <div className="fixed bottom-5 right-5 sm:right-10 bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 p-3 sm:p-4 rounded-md shadow-xl border border-teal-200 w-56 sm:w-64 z-50 cursor-move flex flex-col items-center justify-center space-y-2 sm:space-y-3 handle">
        <h1 className="text-center text-white font-bold text-sm sm:text-sm">
          📢 Registration for 36th ACSIC Conference
        </h1>
        <p className="text-center text-white text-sm sm:text-md">
          📍 Venue: Megha Malhar Hall - Pre-function area.
        </p>
      </div>
    </Draggable>
  );
};

export default RegistrationNotification;
