import React from "react";
import Slider from "react-slick";
import img1 from "../assets/supporters/icimod.svg";
import img2 from "../assets/supporters/world-bank-logo.png";
import img3 from "../assets/supporters/UKaid.svg.png";
import img4 from "../assets/supporters/nrep.jpg";
import img5 from "../assets/supporters/giz.jpg";
import img6 from "../assets/supporters/recon.png";
import img7 from "../assets/supporters/adb.png";
import img8 from "../assets/images/leologo.png";
import img9 from "../assets/images/leologo.png";
import img10 from "../assets/images/leologo.png";
import img11 from "../assets/images/leologo.png";
import img12 from "../assets/images/leologo.png";
import img13 from "../assets/images/leologo.png";
import img14 from "../assets/images/leologo.png";
import img15 from "../assets/images/leologo.png";
import img16 from "../assets/images/leologo.png";
import img17 from "../assets/images/leologo.png";
import img18 from "../assets/images/leologo.png";
import img19 from "../assets/images/leologo.png";
import img20 from "../assets/images/leologo.png";
import img21 from "../assets/images/leologo.png";
import img23 from "../assets/images/leologo.png";
import img24 from "../assets/images/leologo.png";
import img25 from "../assets/images/leologo.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Supporters = () => {
  // List of 25 distinct supporter logos
  const supporters = [
    { id: 1, src: img1, alt: "Supporter 1" },
    { id: 2, src: img2, alt: "Supporter 2" },
    { id: 3, src: img3, alt: "Supporter 3" },
    { id: 4, src: img4, alt: "Supporter 4" },
    { id: 5, src: img5, alt: "Supporter 5" },
    { id: 6, src: img6, alt: "Supporter 1" },
    { id: 7, src: img7, alt: "Supporter 2" },
    { id: 8, src: img3, alt: "Supporter 3" },
    { id: 9, src: img4, alt: "Supporter 4" },
    { id: 10, src: img5, alt: "Supporter 5" },
    { id: 11, src: img1, alt: "Supporter 1" },
    { id: 12, src: img2, alt: "Supporter 2" },
    { id: 13, src: img3, alt: "Supporter 3" },
    { id: 14, src: img4, alt: "Supporter 4" },
    { id: 15, src: img5, alt: "Supporter 5" },
    { id: 16, src: img1, alt: "Supporter 1" },
    { id: 17, src: img2, alt: "Supporter 2" },
    { id: 18, src: img3, alt: "Supporter 3" },
    { id: 19, src: img4, alt: "Supporter 4" },
    { id: 20, src: img5, alt: "Supporter 5" },
    { id: 21, src: img1, alt: "Supporter 1" },
    { id: 22, src: img2, alt: "Supporter 2" },
    { id: 23, src: img3, alt: "Supporter 3" },
    { id: 24, src: img4, alt: "Supporter 4" },
    { id: 25, src: img5, alt: "Supporter 5" },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "20px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          centerPadding: "10px",
        },
      },
    ],
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <div className="mt-0 px-2 sm:px-4 py-10">
      <h1 className="font-semibold text-green-700 text-2xl md:text-3xl text-center mb-2">
        We are Supported By
      </h1>
      <p className="text-center text-gray-600 text-sm md:text-base mb-8">
        Our supporters include some of the most esteemed organizations.
      </p>
      <div className="max-w-full mx-auto">
        <Slider {...sliderSettings}>
          {supporters.map((supporter) => (
            <div
              key={supporter.id}
              className="flex items-center justify-center p-2"
            >
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-4 flex items-center justify-center w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
                <img
                  src={supporter.src}
                  alt={supporter.alt}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Supporters;
