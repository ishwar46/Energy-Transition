import React from "react";
import ComingSoon from "../../components/ComingSoon";
import Navbar from "../../components/Navbar";

const ComingSoonReg = () => {
  return (
    <>
      <Navbar />
      <div className="Accomodation container px-5 mx-auto mt-10">
        <div
          className="text-3xl font-bold text-blue-800 pt-5 text-center"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          Registration Form
          <ComingSoon />
        </div>
      </div>
    </>
  );
};

export default ComingSoonReg;
