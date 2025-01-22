import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../css/homepage.css";
import cover1 from "../../assets/images/bannerenergy.jpg";
import Snowfall from "react-snowfall";
import Supporters from "../../components/Supporter";

const HomePage = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Snowfall Effect */}
      <Snowfall
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
        }}
        snowflakeCount={200}
        speed={[0.5, 3.0]}
        wind={[-1.0, 2.0]}
        radius={[0.5, 2.0]}
        color="white"
        snowflakeFactory={(defaultProps) => (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "white",
              boxShadow: "0 0 3px 1px white",
            }}
          />
        )}
      />

      {/* Banner Section */}
      <div className="relative w-full">
        <div
          className="relative w-full"
          style={{
            height: "100vh",
          }}
        >
          <img
            src={cover1}
            className="object-cover w-full h-full"
            alt="Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 z-10" />
          <div className="absolute inset-0 flex flex-col justify-center items-center z-20 text-center text-white px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-wide">
              Energy Transition for Resilient and Low Carbon Economy Summit 2025
            </h1>
            <p className="mt-4 text-xl md:text-3xl font-light tracking-wider">
              Organized By:{" "}
              <span className="font-medium">
                Alternative Energy Promotion Center
              </span>
            </p>
            <button
              className="mt-8 bg-gradient-to-r from-[#FF5733] to-[#FF8C00] text-white text-lg font-bold py-3 px-10 rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Register Here
            </button>
          </div>
        </div>
      </div>

      {/* Supporters Section */}
      <div
        className="bg-[#f4f8fa]"
        style={{ marginTop: "-1px", paddingTop: "20px" }}
      >
        <Supporters />
      </div>

      {/* Footer */}
      <div className="bg-[#0060df] p-5 w-full">
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
