import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Slider from "react-slick";
import "../../css/homepage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cover1 from "../../assets/images/banner1.jpg";
import cover2 from "../../assets/images/banner1.jpg";
import Snowfall from "react-snowfall";

const HomePage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <>
      <Navbar />

      <div className="relative">
        <Snowfall
          // Positioning & z-index, so it covers the entire screen:
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
          }}
          // Increase the number of snowflakes:
          snowflakeCount={200}
          // Speed range ([min, max]) so some flakes fall fast, some slow:
          speed={[0.5, 3.0]}
          // Wind range ([min, max]) so flakes drift sideways:
          wind={[-1.0, 2.0]}
          // Vary the flake radius:
          radius={[0.5, 2.0]}
          // Color the flakes:
          color="white"
          snowflakeFactory={(defaultProps) => {
            return (
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "white",
                  boxShadow: "0 0 3px 1px white",
                }}
              />
            );
          }}
        />

        <Slider {...sliderSettings} className="relative overflow-hidden">
          {[cover1, cover2].map((image, index) => (
            <div key={index} className="relative h-[calc(100vh-112px)]">
              <img
                src={image}
                className="object-cover w-full h-full"
                alt={`slide-${index}`}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 z-10" />
              {/* Overlay Text */}
              <div className="absolute inset-0 flex flex-col justify-center items-center z-20 text-center text-white px-6">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-wide">
                  Energy Transition for Resilient and Low Carbon Economy Summit
                  2025
                </h1>
                <p className="mt-4 text-xl md:text-3xl font-light tracking-wider">
                  Organized By:{" "}
                  <span className="font-medium">
                    Alternative Energy Promotion Center
                  </span>
                </p>

                {/* Register Button */}
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
          ))}
        </Slider>
      </div>

      <div className="bg-[#001942] p-5 w-full">
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
