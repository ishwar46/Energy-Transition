import React, { useState } from "react";
import EventDetail from "../components/EventDetail";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const EventCard = ({ event, onEdit, onDelete }) => {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [expandedDetailIndex, setExpandedDetailIndex] = useState(null);

  const toggleCardExpansion = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  const toggleDetailExpansion = (index) => {
    setExpandedDetailIndex(expandedDetailIndex === index ? null : index);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, maxLength)}...`;
  };

  return (
    <div className="relative max-w-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-1xl font-bold text-blue-700">{event.title}</h2>
            <p className="text-gray-600">{event.date}</p>
          </div>
          <button
            onClick={toggleCardExpansion}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {isCardExpanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {isCardExpanded && event.details.length > 0 && (
          <div className="text-gray-600 mt-4">
            {event.details.map((detail, index) => (
              <div key={detail._id} className="mb-4">
                <EventDetail detail={detail} />
                <p className="text-gray-600">
                  <strong>Description:</strong>{" "}
                  {expandedDetailIndex === index
                    ? detail.description
                    : truncateText(detail.description, 100)}
                </p>
                {detail.description.length > 100 && (
                  <button
                    className="text-blue-500 hover:text-blue-700 text-sm"
                    onClick={() => toggleDetailExpansion(index)}
                  >
                    {expandedDetailIndex === index ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            ))}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => onEdit(event)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(event._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
