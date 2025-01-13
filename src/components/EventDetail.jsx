import React from "react";

const EventDetail = ({ detail }) => (
  <div className="border-t border-gray-200 py-2">
    <p className="text-sm font-semibold">
      <strong>Subtitle:</strong> {detail.subtitle}
    </p>
    <p className="text-sm">
      <strong>Time:</strong> {detail.time}
    </p>
    <p className="text-sm">
      <strong>Venue:</strong> {detail.venue}
    </p>
    <p className="text-sm">
      <strong>Description:</strong> {detail.description}
    </p>
  </div>
);

export default EventDetail;
