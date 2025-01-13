import React, { useState, useEffect } from "react";
import {
  addEventApi,
  getAllEventsApi,
  updateEventApi,
  deleteEventApi,
} from "../../apis/Api";
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/ConfirmationModal";
import EventCard from "../../components/EventCard";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import useDocumentTitle from "../../components/DocTitle";

const EventManager = () => {
  useDocumentTitle("Manage Event - International Youth Camp 2025");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllEventsApi();
      if (res.data.success) {
        setEvents(res.data.events);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Internal server error";
      toast.error(errorMessage);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const handleAddDetail = () => {
    setDetails([
      ...details,
      { subtitle: "", time: "", venue: "", description: "", icon: "" },
    ]);
  };

  const handleRemoveDetail = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !date.trim() || details.length === 0) {
      toast.error("Please enter all fields");
      return;
    }

    const eventData = {
      title,
      date,
      details,
    };

    try {
      if (eventId) {
        const res = await updateEventApi(eventId, eventData);
        if (res.data.success) {
          toast.success(res.data.message);
          setEventId(null);
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await addEventApi(eventData);
        if (res.data.success) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      }
      fetchEvents();
      setTitle("");
      setDate("");
      setDetails([]);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Internal server error";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (event) => {
    setTitle(event.title);
    setDate(event.date);
    setDetails(event.details);
    setEventId(event._id);
    setIsFormExpanded(true);
  };

  const handleDelete = (id) => {
    setEventToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteEventApi(eventToDelete);
      if (res.data.success) {
        toast.success("Event deleted successfully");
        fetchEvents();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Internal server error";
      toast.error(errorMessage);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setEventToDelete(null);
    setDeleteModalOpen(false);
  };

  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-3">
        Manage Event
      </h1>
      <div className="flex justify-center items-center mb-5">
        <div className="w-full max">
          <div className="rounded-lg shadow-lg">
            <button
              onClick={toggleForm}
              className="w-full text-left px-4 py-2 text-lg font-medium text-gray-700 bg-gray-100 rounded-t-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="text-lg font-bold text-gray-900 mb-2">
                Event Details
              </span>
              {isFormExpanded ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-700" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            {isFormExpanded && (
              <form className="p-5" onSubmit={handleSubmit}>
                <div className="text-gray-700 mb-6">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Event Title"
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="mb-4 text-gray-700">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="text"
                    name="date"
                    placeholder="Event Date"
                    value={date}
                    onChange={handleDateChange}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="mb-4 text-gray-700">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Event Details
                  </label>
                  {details.map((detail, index) => (
                    <div key={index} className="mb-4">
                      <input
                        type="text"
                        placeholder="Subtitle"
                        value={detail.subtitle}
                        onChange={(e) =>
                          handleDetailChange(index, "subtitle", e.target.value)
                        }
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500 mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Time"
                        value={detail.time}
                        onChange={(e) =>
                          handleDetailChange(index, "time", e.target.value)
                        }
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500 mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Venue"
                        value={detail.venue}
                        onChange={(e) =>
                          handleDetailChange(index, "venue", e.target.value)
                        }
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500 mb-2"
                      />
                      <textarea
                        placeholder="Description"
                        value={detail.description}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500 mb-2 resize-y"
                        rows="3"
                      />
                      <input
                        type="text"
                        placeholder="Icon"
                        value={detail.icon}
                        onChange={(e) =>
                          handleDetailChange(index, "icon", e.target.value)
                        }
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500 mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddDetail}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Add Detail
                  </button>
                </div>
                <div className="flex justify-center items-center mb-5">
                  <button
                    type="submit"
                    className="w-full max-w-xs text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    {eventId ? "Update Event" : "Add Event"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full bg-white p-5 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-2">All Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
};

export default EventManager;
