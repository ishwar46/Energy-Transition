import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import Confetti from "react-confetti";
import Lottie from "react-lottie";
import moment from "moment-timezone";
import animationData from "../assets/animations/hourglass.json";

const CountdownTimer = () => {
  const [daysLeft, setDaysLeft] = useState(0);
  const [isCountdownOver, setIsCountdownOver] = useState(false);

  useEffect(() => {
    const eventDate = moment.tz("2024-09-21 17:00", "Asia/Kathmandu").valueOf();

    const calculateDaysLeft = () => {
      const now = moment().tz("Asia/Kathmandu").valueOf();
      const difference = eventDate - now;

      if (difference > 0) {
        setDaysLeft(Math.floor(difference / (1000 * 60 * 60 * 24)));
      } else {
        setDaysLeft(0);
        setIsCountdownOver(true);
      }
    };

    const timer = setInterval(calculateDaysLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Draggable>
      <div className="fixed top-1/2 right-2 sm:right-5 transform -translate-y-1/2 bg-transparent p-3 sm:p-4 rounded-md shadow-xl border border-gray-200 w-56 sm:w-64 z-50 cursor-move flex flex-col items-center justify-center space-y-2 sm:space-y-3">
        {isCountdownOver ? (
          <>
            <Confetti width={window.innerWidth} height={window.innerHeight} />
            <div>
              <h1 className="text-sm sm:text-lg font-bold text-green-600 text-center">
                Welcome to the 36th ACSIC Conference! Let's Begin!
              </h1>
            </div>
          </>
        ) : (
          <>
            <Lottie options={defaultOptions} height={40} width={40} />
            <div className="text-center">
              <p className="text-sm sm:text-lg font-semibold text-white">
                {daysLeft} Days To Go
              </p>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
};

export default CountdownTimer;
