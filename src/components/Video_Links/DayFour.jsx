import React, { useState } from "react";
import YouTube from "react-youtube";
import { ImSpinner2 } from "react-icons/im";

const DayFour = () => {
  const [loading, setLoading] = useState(true);

  const videoID = "VU9xNm7_gHE";

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 1,
    },
  };

  const handleReady = (e) => {
    setLoading(false);
  };

  const handlePlayVideo = (e) => {
    // setIsPlaying(true);
    e.target.playVideo();
  };

  const handleError = () => {
    alert("Failed to load video. Please try again later.");
  };

  return (
    <div className="w-full " style={{ aspectRatio: "16/9" }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <ImSpinner2 className="animate-spin text-4xl text-gray-500" />
        </div>
      )}
      <YouTube
        className="w-full h-full"
        videoId={videoID}
        opts={opts}
        onReady={handleReady}
        onPlay={handlePlayVideo}
        onError={handleError}
      />
    </div>
  );
};

export default DayFour;
