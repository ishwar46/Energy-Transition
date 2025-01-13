import React from "react";
import { Link } from "react-router-dom";
import "../css/liveStreamButton.css";

const LiveStreamButton = () => {
  return (
    <Link to="/acsiclive" className="live-stream-btn">
      Click Here to View Live Streaming
    </Link>
  );
};

export default LiveStreamButton;
