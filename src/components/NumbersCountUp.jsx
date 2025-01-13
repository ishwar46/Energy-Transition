import React from "react";
import CountUp from "react-countup";

const AnimatedNumbers = () => {
  return (
    <div className="grid lg:grid-cols-4 mg:grid-cols-6 gap-5 mt-10">
      <div className="">
        <div className="text-3xl font-bold text-green-800">
          <CountUp end={13} duration={5} suffix="+" />
        </div>
        <div className="text-blue-800 font-bold">Countries</div>
      </div>
      <div className="">
        <div className="text-3xl font-bold text-green-800">
          <CountUp end={19} duration={5} suffix="+" />
        </div>
        <div className="text-blue-800 font-bold">Institutions</div>
      </div>
      <div className="">
        <div className="text-3xl font-bold text-green-800">
          <CountUp end={36} duration={5} />
        </div>
        <div className="text-blue-800 font-bold">Years of Collaboration</div>
      </div>
    </div>
  );
};

export default AnimatedNumbers;
