import { useEffect, useState } from "react";
import img1 from "../assets/acsic.png";

export function RandomImage() {
  const images = [img1];
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setSelectedImage(images[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <img
      src={selectedImage}
      alt="Random display"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
