import React from "react";
import Lottie from "react-lottie";
import animationData from "../assets/animations/comingsoon.json";

const ComingSoon = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center h-auto min-h-screen py-20">
      <div className="w-64 h-64">
        <Lottie options={defaultOptions} height={300} width={300} />
      </div>
      <p className="text-gray-600 mt-2 animate-pulse">
        We will update this section soon. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;
