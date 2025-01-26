import React, { useState, useEffect } from "react";
import { getLiveStreamUrlApi } from "../../apis/Api";
import Lottie from "lottie-react";
import toast from "react-hot-toast";
import loadingAnimation from "../../assets/animations/loading.json";
import "../../css/liveStreamPage.css";
import brandLogo from "../../assets/acsic.png";

const LiveStreamPage = () => {
  const [liveStreamUrl, setLiveStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStreamUrl = async () => {
      try {
        const response = await getLiveStreamUrlApi();
        setLiveStreamUrl(response.data.liveStream.url);
      } catch (error) {
        toast.error("Error fetching live stream URL.");
      } finally {
        setLoading(false);
      }
    };
    fetchLiveStreamUrl();
  }, []);

  return (
    <div className="live-stream-container">
      {/* Brand Logo and Title */}
      <div className="text-center mb-10 ">
        {/* Brand Logo */}
        <img
          src={brandLogo}
          alt="Brand Logo"
          className="mx-auto mb-4 w-40 h-40 object-contain rounded bg-white"
        />

        <h1 className="text-4xl font-bold conference-title mb-2">
          Energy Transition for Resilient and Low Carbon Economy Summit 2025
        </h1>
        <p className="text-xl font-medium live-from">
          We Are Live from Kathmandu, Nepal
        </p>
        {/* Slogan */}
        <p className="text-lg font-semibold text-gray-200 italic">
          Financing Innovations for Economic Growth: "Shaping Innovative Future"
        </p>
      </div>

      {/* Live Stream or Loading Animation */}
      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            className="w-40"
          />
        </div>
      ) : liveStreamUrl ? (
        <div className="live-stream-frame">
          <iframe
            className="w-full h-full rounded-lg shadow-lg"
            src={liveStreamUrl.replace("watch?v=", "embed/")}
            title="Live Stream"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p className="text-center text-xl font-semibold mt-10 no-stream-msg">
          No live stream available at the moment.
        </p>
      )}
    </div>
  );
};

export default LiveStreamPage;
