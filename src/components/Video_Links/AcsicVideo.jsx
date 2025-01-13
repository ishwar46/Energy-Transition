import React, { useState } from "react";
import YouTube from "react-youtube";
import { FiPlay } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";

const AcsicVideo = () => {
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoID = "6e_4fCpVvDw";

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
    setIsPlaying(true);
    e.target.playVideo();
  };

  const handleError = () => {
    alert("Failed to load video. Please try again later.");
  };

  return (
    <div className="flex items-center justify-center rounded-lg shadow-lg px-4 py-4 bg-white">
      <div
        className="w-full md:w-9/12 relative"
        style={{ aspectRatio: "16/9" }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <ImSpinner2 className="animate-spin text-4xl text-gray-500" />
          </div>
        )}
        {!isPlaying && !loading && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 cursor-pointer z-10"
            onClick={() => setIsPlaying(true)}
          >
            <FiPlay className="text-6xl text-white" />
          </div>
        )}
        <YouTube
          className="absolute top-0 left-0 w-full h-full"
          videoId={videoID}
          opts={opts}
          onReady={handleReady}
          onPlay={handlePlayVideo}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default AcsicVideo;
