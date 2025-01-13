import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const CarouselSpeaker = () => {
  const carouselOptions = {
    loop: true,
    margin: 10,
    nav: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplaySpeed: 800,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  };

  return (
    <OwlCarousel {...carouselOptions}>
      <div className="item"></div>
      <div className="item">
        <h4>2</h4>
      </div>
      <div className="item">
        <h4>3</h4>
      </div>
    </OwlCarousel>
  );
};

export default CarouselSpeaker;
