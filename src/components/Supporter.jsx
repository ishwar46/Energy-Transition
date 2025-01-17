import React from "react";
import Slider from "react-slick";
import img1 from "../assets/supporters/icimod.svg";
import img2 from "../assets/supporters/world-bank-logo.png";
import img3 from "../assets/supporters/UKaid.svg.png";
import img4 from "../assets/supporters/nrep.jpg";
import img5 from "../assets/supporters/giz.jpg";
import img6 from "../assets/images/leologo.png";
import img7 from "../assets/images/leologo.png";
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
    { id: 6, src: img1, alt: "Supporter 1" },
    { id: 7, src: img2, alt: "Supporter 2" },
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
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="py-16 px-8 bg-gray-50">
      <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
        Our Supporters
      </h2>
      <Slider {...sliderSettings}>
        {supporters.map((supporter) => (
          <div
            key={supporter.id}
            className="flex items-center justify-center p-4"
          >
            <img
              src={supporter.src}
              alt={supporter.alt}
              className="object-contain w-full h-20 transition-transform duration-300 transform hover:scale-110"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Supporters;
