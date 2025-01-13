import React, { useState } from "react";

const events = [
  // {
  //   year: 2022,
  //   country: "India",
  //   organization: "ICG",
  //   title: "Expanding Financial Frontiers",
  // },
  // {
  //   year: 2021,
  //   country: "Thailand",
  //   organization: "Thai Credit",
  //   title: "Innovation in Guarantee",
  // },
  // {
  //   year: 2020,
  //   country: "Malaysia",
  //   organization: "Credit Malaysia",
  //   title: "Post-Pandemic Recovery",
  // },
  // {
  //   year: 2019,
  //   country: "Nepal",
  //   organization: "DCGF",
  //   title: "Sustainability and Finance",
  // },
  // {
  //   year: 2019,
  //   country: "Nepal",
  //   organization: "DCGF",
  //   title: "Sustainability and Finance",
  // },
  // {
  //   year: 2019,
  //   country: "Nepal",
  //   organization: "DCGF",
  //   title: "Sustainability and Finance",
  // },
];

const HistorySection = () => {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div className="history container px-5 mx-auto mt-10 overflow-hidden">
      <div className="text-2xl font-bold text-blue-800 text-center">
        HISTORY OF ACSIC
      </div>
      <div className="text-1xl font-bold text-green-800 text-center mb-5">
        Reflecting on Past Events
      </div>
      <div className="text-gray-900 text-justify mt-5 mb-5">
        In an effort to advance financial cooperation and regional growth,
        ACSIC, which was founded in 1987, has brought together 19 credit
        guarantee organizations from 14 Asian nations. Every year, the annual
        ACSIC Conference is organized by one or more ACSIC member institutions.
        It serves as a forum for policymakers and industry professionals to
        share information and perspectives on important subjects pertaining to
        financial stability and credit guarantees. To advance its goal of
        promoting sustainable economic growth and development in Asia, ACSIC
        provides training programs in addition to the conference to increase the
        ability and knowledge of its members.
      </div>
      <div className="flex overflow-x-auto py-2">
        {events.map((event, index) => (
          <div
            key={index}
            className="min-w-max mx-4"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <div
              className={`p-4 bg-white shadow-lg rounded-lg ${
                hoverIndex === index ? "ring-4 ring-blue-300" : ""
              }`}
            >
              {/* <img
                src={`https://source.unsplash.com/random/300x200?conference&sig=${index}`}
                alt="Random"
                className="mb-3 w-full h-auto rounded"
              /> */}
              <h3 className="text-lg font-bold text-blue-800">
                {event.year} - {event.country}
              </h3>
              <p className="text-gray-800">{event.organization}</p>
              <p className="text-gray-600">{event.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;
