import React from "react";
import Slider from "react-slick";
import img1 from "../assets/images/mem1.png";
import img2 from "../assets/images/mem2.png";
import img3 from "../assets/images/mem3.png";
import img4 from "../assets/images/mem4.png";
import img5 from "../assets/images/mem5.png";
import img6 from "../assets/images/mem6.png";
import img7 from "../assets/images/mem7.png";
import img8 from "../assets/images/mem8.png";
import img9 from "../assets/images/mem9.png";
import img10 from "../assets/images/mem10.png";
import img11 from "../assets/images/mem11.png";
import img12 from "../assets/images/mem12.jpg";
import img13 from "../assets/images/mem13.png";
import img14 from "../assets/images/mem14.png";
import img15 from "../assets/images/mem15.png";
import img16 from "../assets/images/mem16.png";
import img17 from "../assets/images/mem17.png";
import img18 from "../assets/images/mem18.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  cssEase: "linear",
};

const Member = () => {
  return (
    <div className="p-5">
      <Slider {...settings}>
        {[img1, img2, img3, img4, img5, img6, img7, img8].map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`Member ${index + 1}`}
              className="h-[50px] w-fit"
            />
          </div>
        ))}
      </Slider>
      <br />
      <br />

      <Slider {...settings}>
        {[
          img9,
          img10,
          img11,
          img12,
          img13,
          img14,
          img15,
          img16,
          img17,
          img18,
        ].map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`Member ${index + 9}`}
              className="h-[50px] w-fit"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Member;
