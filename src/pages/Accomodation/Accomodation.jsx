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
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        {/* Hero Section */}
        <div
          className="text-center bg-gradient-to-r from-blue-700 via-teal-500 to-blue-700 text-white py-12 rounded-lg shadow-lg"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          <h1 className="text-4xl font-extrabold mb-4">Venue</h1>
          <p className="text-lg font-medium">
            Discover our event locations and accommodations for Energy Summit
            2025.
          </p>
        </div>

        {/* Venue Section */}
        <div className="container px-5 mx-auto mt-10">
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
                      src={`https://api-energy.onrender.com/${image}`}
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
      </div>
      <Footer />
    </>
  );
};

export default Accomodation;
