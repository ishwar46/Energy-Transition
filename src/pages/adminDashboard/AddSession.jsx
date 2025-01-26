import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { Input, initTWE } from "tw-elements";
import { getAllSpeakersApi, addSessionApi } from "../../apis/Api";
import toast from "react-hot-toast";
import useDocumentTitle from "../../components/DocTitle";

initTWE({ Input });

const AddSession = () => {
  useDocumentTitle("Add Sessions - Uranus Event Management");
  const [speakers, setSpeakers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    selectedSpeakers: [],
    remarks: "",
  });

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await getAllSpeakersApi();
        setSpeakers(response.data.speakers);
      } catch (error) {
        console.error("Failed to fetch speakers:", error);
      }
    };

    fetchSpeakers();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSpeakersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedSpeakers = selectedOptions.map((option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      selectedSpeakers,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = {
      title: formData.title,
      description: formData.description,
      startTime: moment(formData.startTime).tz("Asia/Kathmandu").toISOString(),
      endTime: moment(formData.endTime).tz("Asia/Kathmandu").toISOString(),
      speakers: formData.selectedSpeakers,
      remarks: formData.remarks,
    };

    try {
      await addSessionApi(formDataToSend);
      toast.success("Session added successfully!");
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        selectedSpeakers: [],
        remarks: "",
      });
    } catch (error) {
      console.error("Failed to add session:", error);
      toast.error("Failed to add session.");
    }
  };

  return (
    <div className="min-h-screen ">
      <h2 className="text-2xl font-bold text-start mb-4 text-black mt-2">
        Add Session
      </h2>
      <div className="w-full max bg-white p-5 rounded-lg shadow-lg mb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Session Name
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Session Name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="startTime"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Start Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="endTime"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                End Time
              </label>
              <input
                type="datetime-local"
                id="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Session Details
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Details about the session"
                rows="4"
                required
              ></textarea>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label
                htmlFor="remarks"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Remarks
              </label>
              <textarea
                id="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Any remarks"
                rows="4"
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="selectedSpeakers"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Choose Speakers
              </label>
              <select
                id="selectedSpeakers"
                multiple
                value={formData.selectedSpeakers}
                onChange={handleSpeakersChange}
                className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
              >
                {speakers.map((speaker) => (
                  <option key={speaker._id} value={speaker._id}>
                    {speaker.fullName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-pink-500 mt-1">
                Hold down the Ctrl (windows) or Command (Mac) button to select
                multiple options.
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 focus:ring focus:ring-blue-300"
          >
            Add Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSession;
