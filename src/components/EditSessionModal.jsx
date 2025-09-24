import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { editSessionApi, getAllSpeakersApi } from "../apis/Api";
import toast from "react-hot-toast";
import moment from "moment-timezone";

const EditSessionModal = ({ isOpen, closeModal, session, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: session.title || "",
    description: session.description || "",
    speakers: session.speakers.map((s) => s._id) || [],
    startTime: moment
      .tz(session.startTime, "Asia/Kathmandu")
      .local()
      .format("YYYY-MM-DDTHH:mm"),
    endTime: moment
      .tz(session.endTime, "Asia/Kathmandu")
      .local()
      .format("YYYY-MM-DDTHH:mm"),
    remarks: session.remarks || "",
  });

  const [speakersList, setSpeakersList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all speakers when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchSpeakers = async () => {
        try {
          const response = await getAllSpeakersApi();
          setSpeakersList(response.data.speakers);
        } catch (error) {
          console.error("Failed to fetch speakers:", error);
          toast.error("Failed to fetch speakers.");
        }
      };
      fetchSpeakers();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For multi-select speakers
    if (name === "speakers") {
      const options = e.target.options;
      const selectedSpeakers = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedSpeakers.push(options[i].value);
        }
      }
      setFormData({ ...formData, speakers: selectedSpeakers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert from local time to Kathmandu time
    const startTimeKathmandu = moment(formData.startTime)
      .tz("Asia/Kathmandu")
      .format();
    const endTimeKathmandu = moment(formData.endTime)
      .tz("Asia/Kathmandu")
      .format();

    // Validate that startTime is before endTime
    if (moment(startTimeKathmandu).isAfter(moment(endTimeKathmandu))) {
      toast.error("Start Time must be before End Time.");
      setIsSubmitting(false);
      return;
    }

    // Prepare data to send
    const dataToSend = {
      ...formData,
      startTime: startTimeKathmandu,
      endTime: endTimeKathmandu,
    };

    try {
      const response = await editSessionApi(session._id, dataToSend);
      if (response.data.success) {
        toast.success(response.data.message);
        onUpdate(response.data.session);
        closeModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to edit session:", error);
      toast.error(error.response?.data?.message || "Failed to edit session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-20 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
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

          {/* This element is to trick the browser into centering the modal contents. */}
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
            <div className="inline-block align-middle bg-white rounded-lg shadow-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              {/* Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-medium text-gray-900"
                  >
                    Edit Session
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 py-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-left text-xs font-medium text-gray-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full text-sm text-gray-900 bg-white border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-left text-xs font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="2"
                      className="w-full text-sm text-gray-900 bg-white border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    ></textarea>
                  </div>

                  {/* Speakers */}
                  <div>
                    <label
                      htmlFor="speakers"
                      className="block text-left text-xs font-medium text-gray-700 mb-1"
                    >
                      Speakers
                    </label>
                    <select
                      name="speakers"
                      id="speakers"
                      multiple
                      value={formData.speakers}
                      onChange={handleChange}
                      size="3"
                      className="w-full text-sm text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {speakersList.length > 0 ? (
                        speakersList.map((speaker) => (
                          <option
                            key={speaker._id}
                            value={speaker._id}
                            className="py-1 text-gray-900"
                          >
                            {speaker.fullName}
                          </option>
                        ))
                      ) : (
                        <option disabled>No speakers available</option>
                      )}
                    </select>
                    <p className="text-xs text-gray-500 mt-1 text-left">
                      Hold Ctrl/Cmd to select multiple
                    </p>
                  </div>

                  {/* Time Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="startTime"
                        className="block text-left text-xs font-medium text-gray-700 mb-1"
                      >
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        id="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="w-full text-xs text-gray-900 bg-white border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="endTime"
                        className="block text-left text-xs font-medium text-gray-700 mb-1"
                      >
                        End Time
                      </label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        id="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        className="w-full text-xs text-gray-900 bg-white border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Remarks */}
                  <div>
                    <label
                      htmlFor="remarks"
                      className="block text-left text-xs font-medium text-gray-700 mb-1"
                    >
                      Remarks
                    </label>
                    <input
                      type="text"
                      name="remarks"
                      id="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      className="w-full text-sm text-gray-900 bg-white border border-gray-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 rounded-b-lg flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditSessionModal;
