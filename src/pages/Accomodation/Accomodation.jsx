import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getAllVenue } from "../../apis/Api";
import NoDataFound from "../../components/NoDataFound";

const Accomodation = () => {
  const [allVenue, setAllVenue] = useState([]);

  useEffect(() => {
    fetchallVenue();
  }, []);

  const fetchallVenue = async () => {
    try {
      const res = await getAllVenue();
      if (res.status === 200 || res.status === 201) {
        setAllVenue(res.data.allVenue);
        console.log(res.data.allVenue);
      }
    } catch (error) {
      console.log(`Error while fetching all Venue ${error}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="Accomodation container px-5 mx-auto mt-10">
        <div
          className="text-3xl font-bold text-blue-800 pt-5 text-center"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          Venue
        </div>
        {allVenue.length > 0 ? (
          allVenue.map((venue) => (
            <div key={venue._id} className="venue-card mb-8">
              <h2 className="text-2xl font-semibold text-green-800 text-center mb-5">
                {venue.title}
              </h2>

              {/* Image grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {venue.venueimage.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={`https://energy-transition-api.onrender.com/${image}`}
                    alt={`Venue ${imgIndex + 1}`}
                    className="mx-auto rounded-lg"
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
              <p className="text-lg text-gray-700 text-justify">
                {venue.description}
              </p>
              <p className="text-lg text-gray-700 mt-5">
                Address: {venue.address}
              </p>

              <p className="text-lg text-gray-700">
                Website:{" "}
                <a
                  href={venue.webLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {venue.webLink}
                </a>
              </p>
            </div>
          ))
        ) : (
          <>
            <NoDataFound />
            <div className="text-center text-xl font-bold text-red-500">
              No data available
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Accomodation;
