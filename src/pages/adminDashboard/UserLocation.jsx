import React, { useEffect, useState } from "react";
import { getallUserAccordingToLocation } from "../../apis/Api";
import { FaEye } from "react-icons/fa";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Pagination, Stack } from "@mui/material";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/loading.json";
import toast from "react-hot-toast";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import useDocumentTitle from "../../components/DocTitle";

const UserLocation = () => {
  useDocumentTitle("Track Journey- Uranus Event Management");

  const [allUserLocation, setAllUserLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(15);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    getAllUserLocation();
  }, []);

  const getAllUserLocation = async () => {
    setIsLoading(true);
    try {
      const res = await getallUserAccordingToLocation();
      if (res.status === 200 || res.status === 201) {
        setAllUserLocation(res.data.users);
      }
    } catch (error) {
      console.error(`Error fetching all Users ${error}`);
      toast.error("Error fetching users.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = allUserLocation.filter(
    (user) =>
      user.personalInformation?.fullName?.firstName
        ?.toLowerCase()
        .includes(nameFilter.toLowerCase()) ||
      user.personalInformation?.fullName?.lastName
        ?.toLowerCase()
        .includes(nameFilter.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  const openModal = (user) => {
    setSelectedMessage(user);
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-3">
        Track Journey
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      ) : (
        <div className="flex flex-col bg-transparent items-center justify-center mb-5">
          <div className="w-full max-w bg-transparent p-5 rounded-lg shadow-lg">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-transparent border text-gray-600">
                <thead className="bg-[#3051A0] border-b text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">SN</th>
                    <th className="py-3 px-6 text-left">Full Name</th>
                    <th className="py-3 px-6 text-left">Location</th>
                    <th className="py-3 px-6 text-left">Additional Notes</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => {
                      const hasLocation =
                        user.locationHistory && user.locationHistory.length > 0;
                      const hasAdditionalNotes =
                        user.locationHistory &&
                        user.locationHistory.some(
                          (location) => location.additionalNotes
                        );

                      return (
                        <tr key={user._id} className="border-b">
                          <td className="py-3 px-6">
                            {indexOfFirstUser + index + 1}
                          </td>
                          <td className="py-3 px-6">
                            {user.personalInformation?.fullName?.firstName ||
                              "N/A"}{" "}
                            {user.personalInformation?.fullName?.lastName ||
                              "N/A"}
                          </td>
                          <td className="py-3 px-6">
                            {hasLocation && user.locationHistory.length > 0
                              ? (() => {
                                  const mostRecentLocation =
                                    user.locationHistory.reduce(
                                      (latest, location) =>
                                        new Date(location.updatedAt) >
                                        new Date(latest.updatedAt)
                                          ? location
                                          : latest
                                    );
                                  return mostRecentLocation.location || "N/A";
                                })()
                              : "N/A"}
                          </td>
                          <td className="py-3 px-6">
                            {hasAdditionalNotes &&
                            user.locationHistory.length > 0
                              ? (() => {
                                  const mostRecentLocation =
                                    user.locationHistory.reduce(
                                      (latest, additionalNotes) =>
                                        new Date(additionalNotes.updatedAt) >
                                        new Date(latest.updatedAt)
                                          ? additionalNotes
                                          : latest
                                    );
                                  return (
                                    mostRecentLocation.additionalNotes || "N/A"
                                  );
                                })()
                              : "N/A"}
                          </td>
                          <td className="py-3 px-6 text-center">
                            <FaEye
                              onClick={() => openModal(user)}
                              className="cursor-pointer h-5 w-5 text-blue-600"
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-4 text-center text-gray-600"
                      >
                        No participants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <Stack spacing={2} className="mt-4">
              <Pagination
                count={Math.ceil(filteredUsers.length / usersPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </div>
        </div>
      )}
      {selectedMessage && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-11/12 md:w-3/4 max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex justify-between items-center bg-[#3051A0] text-white px-5 py-4 rounded-t-lg">
                <h2 className="text-xl font-semibold">
                  Participants Location Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-red-300"
                  aria-label="Close modal"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-800 mt-2">
                    <strong>Name:</strong>{" "}
                    {selectedMessage.personalInformation?.fullName?.firstName}{" "}
                    {selectedMessage.personalInformation?.fullName?.lastName}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong>Institution:</strong>{" "}
                    {selectedMessage.personalInformation?.nameOfInstitution}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#3051A0]">
                    Location History
                  </h3>
                  <div className="overflow-y-auto h-96 mt-4 text-gray-600">
                    {" "}
                    {/* Increased height */}
                    <VerticalTimeline layout="1-column-left">
                      {selectedMessage.locationHistory?.length > 0 ? (
                        selectedMessage.locationHistory
                          .slice()
                          .reverse()
                          .map((location, locIndex) => (
                            <VerticalTimelineElement
                              key={locIndex}
                              date={
                                location.updatedAt
                                  ? new Date(location.updatedAt).toLocaleString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      }
                                    )
                                  : "No date available"
                              }
                              iconStyle={{
                                background: "#3051A0",
                                color: "#fff",
                              }}
                              icon={<MapPinIcon className="w-5 h-5" />}
                            >
                              <h4 className="vertical-timeline-element-title text-1xl font-semibold text-gray-900">
                                {location.location || "N/A"}
                              </h4>
                              <p className="text-sm text-gray-700">
                                {location.additionalNotes || "N/A"}
                              </p>
                            </VerticalTimelineElement>
                          ))
                      ) : (
                        <p className="text-gray-500">
                          No location data available
                        </p>
                      )}
                    </VerticalTimeline>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
};

export default UserLocation;
