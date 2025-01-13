import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { Dialog, Transition } from "@headlessui/react";
import { getSessionAttendaceApi } from "../apis/Api";
import EditSessionModal from "./EditSessionModal";

const SessionCard = ({
  sessions,
  onStartSession,
  onCancelSession,
  onEndSession,
  onUpdateSession,
}) => {
  const [currentTime, setCurrentTime] = useState(moment().tz("Asia/Kathmandu"));
  const [isOpen, setIsOpen] = useState(false); // For Details Modal
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("speakers");
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // New state variables for Edit Session Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().tz("Asia/Kathmandu"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (attendanceModalOpen && selectedSession) {
      getSessionAttendaceApi(selectedSession._id).then((response) => {
        if (response.data.success) {
          setAttendanceData(response.data.attendance);
        }
      });
    }
  }, [attendanceModalOpen, selectedSession]);

  const isDelayed = (session) => {
    const scheduledTime = moment(session.startTime).tz("Asia/Kathmandu");
    return currentTime.isAfter(scheduledTime) && session.status === "scheduled";
  };

  const isExpired = (session) => {
    const scheduledEndTime = moment(session.endTime).tz("Asia/Kathmandu");
    return (
      currentTime.isAfter(scheduledEndTime) && session.status === "scheduled"
    );
  };

  const hasExceeded = (session) => {
    const scheduledEndTime = moment(session.endTime).tz("Asia/Kathmandu");
    return currentTime.isAfter(scheduledEndTime);
  };

  // Returns the Tailwind CSS background + border color classes based on status
  const cardColor = (status) => {
    switch (status) {
      case "in_progress":
        return "bg-green-50 border-green-500";
      case "scheduled":
        return "bg-blue-50 border-blue-500";
      case "completed":
        return "bg-gray-50 border-gray-500";
      case "cancelled":
        return "bg-red-50 border-red-500";
      case "expired":
        return "bg-yellow-50 border-yellow-500";
      default:
        return "bg-gray-50 border-gray-500";
    }
  };

  // Returns a small badge with text color based on status
  const statusBadge = (status) => {
    const text = status.replace("_", " ");
    switch (status) {
      case "in_progress":
        return (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
            {text}
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
            {text}
          </span>
        );
      case "completed":
        return (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">
            {text}
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
            {text}
          </span>
        );
      case "expired":
        return (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">
            {text}
          </span>
        );
      default:
        return (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">
            {text}
          </span>
        );
    }
  };

  // Format a moment.duration in a user-friendly string
  const formatDuration = (duration) => {
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    let formattedDuration = "";
    if (months > 0) {
      formattedDuration += `${months} month${months > 1 ? "s" : ""} `;
    }
    if (days > 0 || months > 0) {
      formattedDuration += `${days} day${days > 1 ? "s" : ""} `;
    }
    if (hours > 0 || days > 0 || months > 0) {
      formattedDuration += `${hours} hr${hours > 1 ? "s" : ""} `;
    }
    if (minutes > 0 || hours > 0 || days > 0 || months > 0) {
      formattedDuration += `${minutes} min${minutes > 1 ? "s" : ""} `;
    }
    formattedDuration += `${seconds} sec${seconds > 1 ? "s" : ""}`;
    return formattedDuration;
  };

  const getElapsedTime = (startTime, actualStartTime) => {
    const start = actualStartTime
      ? moment(actualStartTime).tz("Asia/Kathmandu")
      : moment(startTime).tz("Asia/Kathmandu");
    const duration = moment.duration(currentTime.diff(start));
    return formatDuration(duration);
  };

  const getTimeUntilStart = (startTime) => {
    const start = moment(startTime).tz("Asia/Kathmandu");
    const duration = moment.duration(start.diff(currentTime));
    if (duration.asSeconds() < 0) {
      return "Delayed";
    }
    return formatDuration(duration);
  };

  // If session is still scheduled but now is after end time, mark it as expired
  const updateSessions = () => {
    return sessions.map((session) => {
      if (isExpired(session)) {
        session.status = "expired";
      }
      return session;
    });
  };

  const openModal = (session) => {
    const sessionWithSpeakers = {
      ...session,
      speakers: session.speakers.map((speaker) => speaker.fullName).join(", "),
    };
    setSelectedSession(sessionWithSpeakers);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedSession(null);
  };

  const openAttendanceModal = (session) => {
    setSelectedSession(session);
    setAttendanceModalOpen(true);
  };

  const closeAttendanceModal = () => {
    setAttendanceModalOpen(false);
    setSelectedSession(null);
  };

  // New functions to handle Edit Session Modal
  const openEditModal = (session) => {
    setSessionToEdit(session);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSessionToEdit(null);
  };

  const updatedSessions = updateSessions();

  const filterAttendance = (attendance) => {
    if (!searchQuery) return attendance;
    return attendance.filter((attendee) =>
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderSpeakersTable = () => {
    const speakers = filterAttendance(
      attendanceData.filter((attendee) => attendee.role === "speaker")
    );
    return (
      <div>
        <h4 className="text-lg font-medium leading-6 text-gray-900">
          Speakers
        </h4>
        <input
          type="text"
          className="mt-2 mb-4 p-2 border border-gray-300 rounded text-black"
          placeholder="Search Speakers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {speakers.length > 0 ? (
          <div className="overflow-x-auto shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Check-in
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {speakers.map((speaker, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {speaker.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(speaker.joinTime)
                        .tz("Asia/Kathmandu")
                        .format("MMMM Do YYYY, h:mm a")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No Speakers found.</p>
        )}
      </div>
    );
  };

  const renderUsersTable = () => {
    const users = filterAttendance(
      attendanceData.filter((attendee) => attendee.role === "user")
    );
    return (
      <div>
        <h4 className="text-lg font-medium leading-6 text-gray-900">
          Participants
        </h4>
        <input
          type="text"
          className="mt-2 mb-4 p-2 border border-gray-300 rounded text-black"
          placeholder="Search Participants"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {users.length > 0 ? (
          <div className="overflow-x-auto overflow-y-scroll h-60 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Check-in
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(user.joinTime)
                        .tz("Asia/Kathmandu")
                        .format("MMMM Do YYYY, h:mm a")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No Participants found.</p>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
        {updatedSessions.map((session, index) => (
          <div
            key={index}
            className={`
              rounded-lg shadow-lg p-4 border-l-4
              ${cardColor(session.status)}
              transition transform hover:-translate-y-1 hover:shadow-xl
            `}
          >
            {/* Session Title */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-blue-800">
                {session.title}
              </h3>
              {/* Status Badge */}
              {statusBadge(session.status)}
            </div>

            <p className="text-gray-700 text-sm">
              <strong>Speaker:</strong>{" "}
              {session.speakers && session.speakers.length > 0 ? (
                session.speakers.map((speaker, i) => (
                  <span key={i}>
                    {speaker.fullName}
                    {i < session.speakers.length - 1 ? ", " : ""}
                  </span>
                ))
              ) : (
                <span>N/A</span>
              )}
            </p>

            <p className="text-gray-700 text-sm">
              <strong>Start Time:</strong>{" "}
              {moment(session.startTime)
                .tz("Asia/Kathmandu")
                .format("MMMM Do YYYY, h:mm a")}{" "}
              {isDelayed(session) && (
                <span className="ml-1 text-red-500 text-xs">(Delayed)</span>
              )}
            </p>

            <p className="text-gray-700 text-sm">
              <strong>End Time:</strong>{" "}
              {moment(session.endTime)
                .tz("Asia/Kathmandu")
                .format("MMMM Do YYYY, h:mm a")}{" "}
              {hasExceeded(session) && (
                <span className="ml-1 text-red-500 text-xs">(Exceeded)</span>
              )}
            </p>

            {/* If session is scheduled and not expired, show time until start */}
            {session.status === "scheduled" && !isExpired(session) && (
              <p className="text-gray-700 text-sm">
                <strong>Time Until Start:</strong>{" "}
                <span className="text-blue-500">
                  {getTimeUntilStart(session.startTime)}
                </span>
              </p>
            )}

            {/* If session is in_progress, show elapsed time */}
            {session.status === "in_progress" && (
              <div className="text-sm mt-2 text-green-700">
                <strong>Elapsed Time: </strong>
                {getElapsedTime(session.startTime, session.actualStartTime)}
              </div>
            )}

            {/* Actual Start/End Times */}
            {session.actualStartTime && (
              <p className="text-gray-700 text-sm mt-2">
                <strong>Actual Start Time:</strong>{" "}
                {moment(session.actualStartTime)
                  .tz("Asia/Kathmandu")
                  .format("MMMM Do YYYY, h:mm a")}
              </p>
            )}
            {session.actualEndTime && (
              <p className="text-gray-700 text-sm mt-2">
                <strong>Actual End Time:</strong>{" "}
                {moment(session.actualEndTime)
                  .tz("Asia/Kathmandu")
                  .format("MMMM Do YYYY, h:mm a")}
              </p>
            )}

            {/* Buttons: Details & Attendees */}
            <div className="mt-3 flex items-center space-x-4">
              <button
                className="text-blue-500 hover:text-blue-700 text-sm font-medium underline"
                onClick={() => openModal(session)}
              >
                View Details
              </button>
              <button
                className="text-blue-500 hover:text-blue-700 text-sm font-medium underline"
                onClick={() => openAttendanceModal(session)}
              >
                View Attendees
              </button>
            </div>

            {/* Action Buttons (Start/Cancel/End) */}
            {session.status === "scheduled" && !isExpired(session) && (
              <div className="flex flex-col sm:flex-row justify-between mt-4 gap-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-xs"
                  onClick={() => onStartSession(session)}
                >
                  Start Session
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-xs"
                  onClick={() => onCancelSession(session)}
                >
                  Cancel Session
                </button>
              </div>
            )}
            {session.status === "in_progress" && (
              <div className="flex justify-between mt-4">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-xs"
                  onClick={() => onEndSession(session)}
                >
                  End Session
                </button>
              </div>
            )}
            {session.status === "expired" && (
              <div className="text-sm mt-2 text-yellow-700 font-semibold">
                Session Expired
              </div>
            )}
            {session.status === "completed" && (
              <div className="text-sm mt-2 text-gray-600 font-semibold">
                Session Completed
              </div>
            )}

            {/* Edit Session Button */}
            <div className="mt-4">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded text-xs"
                onClick={() => openEditModal(session)}
              >
                Edit Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedSession && (
        <Transition appear show={isOpen} as={React.Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeModal}
          >
            <div className="min-h-screen flex items-center justify-center px-4 text-center sm:block sm:p-0">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              </Transition.Child>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {selectedSession.title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-gray-500">
                      <strong>Speaker:</strong> {selectedSession.speakers}
                    </p>
                    <p className="text-gray-500">
                      <strong>Start Time:</strong>{" "}
                      {moment(selectedSession.startTime)
                        .tz("Asia/Kathmandu")
                        .format("MMMM Do YYYY, h:mm a")}
                    </p>
                    <p className="text-gray-500">
                      <strong>End Time:</strong>{" "}
                      {moment(selectedSession.endTime)
                        .tz("Asia/Kathmandu")
                        .format("MMMM Do YYYY, h:mm a")}
                    </p>
                    <p className="text-gray-500">
                      <strong>Details:</strong> {selectedSession.description}
                    </p>
                    <p className="text-gray-500">
                      <strong>Remarks:</strong> {selectedSession.remarks}
                    </p>
                    {selectedSession.actualStartTime && (
                      <p className="text-gray-500">
                        <strong>Actual Start Time:</strong>{" "}
                        {moment(selectedSession.actualStartTime)
                          .tz("Asia/Kathmandu")
                          .format("MMMM Do YYYY, h:mm a")}
                      </p>
                    )}
                    {selectedSession.actualEndTime && (
                      <p className="text-gray-500">
                        <strong>Actual End Time:</strong>{" "}
                        {moment(selectedSession.actualEndTime)
                          .tz("Asia/Kathmandu")
                          .format("MMMM Do YYYY, h:mm a")}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md
                                 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* Attendance Modal */}
      {selectedSession && (
        <Transition appear show={attendanceModalOpen} as={React.Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeAttendanceModal}
          >
            <div className="min-h-screen flex items-center justify-center px-4 text-center sm:p-0">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-30"
                leave="ease-in duration-200"
                leaveFrom="opacity-30"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div
                  className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all
                                sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6"
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    {selectedSession.title} - Attendees
                  </Dialog.Title>
                  <div className="mt-4">
                    <div className="flex justify-around">
                      <button
                        className={`text-sm font-medium px-4 py-2 border-b-2 ${
                          activeTab === "speakers"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-600"
                        }`}
                        onClick={() => setActiveTab("speakers")}
                      >
                        View Speakers
                      </button>
                      <button
                        className={`text-sm font-medium px-4 py-2 border-b-2 ${
                          activeTab === "users"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-600"
                        }`}
                        onClick={() => setActiveTab("users")}
                      >
                        View Participants
                      </button>
                    </div>
                    <div className="mt-4">
                      {activeTab === "speakers" && renderSpeakersTable()}
                      {activeTab === "users" && renderUsersTable()}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent
                                 rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeAttendanceModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* Edit Session Modal */}
      {sessionToEdit && (
        <EditSessionModal
          isOpen={editModalOpen}
          closeModal={closeEditModal}
          session={sessionToEdit}
          onUpdate={onUpdateSession}
        />
      )}
    </>
  );
};

export default SessionCard;
