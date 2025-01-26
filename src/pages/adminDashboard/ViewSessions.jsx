import React, { useState, useEffect } from "react";
import SessionCard from "../../components/SessionCards";
import {
  getAllSessionsApi,
  startSessionApi,
  endSessionApi,
  cancelSessionApi,
} from "../../apis/Api";
import toast from "react-hot-toast";
import moment from "moment";
import useDocumentTitle from "../../components/DocTitle";

const ViewSessions = () => {
  useDocumentTitle("View Sessions - Uranus Event Management");

  const [runningSessions, setRunningSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [cancelledSessions, setCancelledSessions] = useState([]);
  const [expiredSessions, setExpiredSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => {
      fetchSessions();
    }, 60000); // Refresh sessions every minute
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await getAllSessionsApi();
      const sessions = response.data;
      const now = moment().tz("Asia/Kathmandu");

      const running = [];
      const upcoming = [];
      const completed = [];
      const cancelled = [];
      const expired = [];

      sessions.forEach((session) => {
        const endDateTime = moment(session.endTime).tz("Asia/Kathmandu");

        // If a session is marked in_progress but the end time has passed
        if (session.status === "in_progress" && now.isAfter(endDateTime)) {
          session.status = "completed";
        }

        // If a session is scheduled but its end time has passed
        if (session.status === "scheduled" && now.isAfter(endDateTime)) {
          session.status = "expired";
        }

        // Categorize
        switch (session.status) {
          case "in_progress":
            running.push(session);
            break;
          case "scheduled":
            upcoming.push(session);
            break;
          case "completed":
            completed.push(session);
            break;
          case "cancelled":
            cancelled.push(session);
            break;
          case "expired":
            expired.push(session);
            break;
          default:
            break;
        }
      });

      setRunningSessions(running);
      setUpcomingSessions(upcoming);
      setCompletedSessions(completed);
      setCancelledSessions(cancelled);
      setExpiredSessions(expired);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      toast.error("Failed to fetch sessions.");
    }
  };

  const handleStartSession = async (session) => {
    try {
      const response = await startSessionApi(session._id);
      if (response.data.success) {
        toast.success(response.data.message);
        setUpcomingSessions((prev) =>
          prev.filter((s) => s._id !== session._id)
        );
        setRunningSessions((prev) => [
          ...prev,
          { ...session, status: "in_progress", actualStartTime: new Date() },
        ]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to start session:", error);
      toast.error(error.response?.data?.message || "Failed to start session.");
    }
  };

  const handleCancelSession = async (session) => {
    try {
      await cancelSessionApi(session._id);
      toast.success("Session cancelled successfully!");
      setUpcomingSessions((prev) => prev.filter((s) => s._id !== session._id));
      setCancelledSessions((prev) => [
        ...prev,
        { ...session, status: "cancelled" },
      ]);
    } catch (error) {
      console.error("Failed to cancel session:", error);
      toast.error("Failed to cancel session.");
    }
  };

  const handleEndSession = async (session) => {
    try {
      await endSessionApi(session._id);
      toast.success("Session ended successfully!");
      setRunningSessions((prev) => prev.filter((s) => s._id !== session._id));
      setCompletedSessions((prev) => [
        ...prev,
        { ...session, status: "completed", actualEndTime: new Date() },
      ]);
    } catch (error) {
      console.error("Failed to end session:", error);
      toast.error("Failed to end session.");
    }
  };

  // Handler to update session after editing
  const handleUpdateSession = (updatedSession) => {
    const { status } = updatedSession;

    // Remove the session from all current categories
    setRunningSessions((prev) =>
      prev.filter((s) => s._id !== updatedSession._id)
    );
    setUpcomingSessions((prev) =>
      prev.filter((s) => s._id !== updatedSession._id)
    );
    setCompletedSessions((prev) =>
      prev.filter((s) => s._id !== updatedSession._id)
    );
    setCancelledSessions((prev) =>
      prev.filter((s) => s._id !== updatedSession._id)
    );
    setExpiredSessions((prev) =>
      prev.filter((s) => s._id !== updatedSession._id)
    );

    // Add the session to the appropriate category
    switch (status) {
      case "in_progress":
        setRunningSessions((prev) => [...prev, updatedSession]);
        break;
      case "scheduled":
        setUpcomingSessions((prev) => [...prev, updatedSession]);
        break;
      case "completed":
        setCompletedSessions((prev) => [...prev, updatedSession]);
        break;
      case "cancelled":
        setCancelledSessions((prev) => [...prev, updatedSession]);
        break;
      case "expired":
        setExpiredSessions((prev) => [...prev, updatedSession]);
        break;
      default:
        break;
    }
  };

  // Check if ALL categories are empty
  const allEmpty =
    runningSessions.length === 0 &&
    upcomingSessions.length === 0 &&
    completedSessions.length === 0 &&
    cancelledSessions.length === 0 &&
    expiredSessions.length === 0;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-start mb-4 text-black">
        Session Details
      </h1>

      {allEmpty ? (
        <div className="text-center mt-10 text-gray-600">
          <p className="text-lg md:text-xl">
            No sessions available at this time.
          </p>
          <p className="text-sm md:text-base">
            Please check back later or create a new session.
          </p>
        </div>
      ) : (
        <>
          {/* Running Sessions */}
          {runningSessions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Running Sessions
              </h2>
              <SessionCard
                sessions={runningSessions}
                onEndSession={handleEndSession}
                onUpdateSession={handleUpdateSession}
              />
            </div>
          )}

          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Upcoming Sessions
              </h2>
              <SessionCard
                sessions={upcomingSessions}
                onStartSession={handleStartSession}
                onCancelSession={handleCancelSession}
                onUpdateSession={handleUpdateSession}
              />
            </div>
          )}

          {/* Completed Sessions */}
          {completedSessions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Completed Sessions
              </h2>
              <SessionCard
                sessions={completedSessions}
                onUpdateSession={handleUpdateSession}
              />
            </div>
          )}

          {/* Cancelled Sessions */}
          {cancelledSessions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Cancelled Sessions
              </h2>
              <SessionCard
                sessions={cancelledSessions}
                onUpdateSession={handleUpdateSession}
              />
            </div>
          )}

          {/* Expired Sessions */}
          {expiredSessions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Expired Sessions
              </h2>
              <SessionCard
                sessions={expiredSessions}
                onUpdateSession={handleUpdateSession}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewSessions;
