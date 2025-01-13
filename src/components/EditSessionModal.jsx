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
            <div className="inline-block align-middle text-gray-900 bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 mb-4"
              >
                Edit Session
              </Dialog.Title>
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                {/* Speakers */}
                <div className="mb-4">
                  <label
                    htmlFor="speakers"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Speakers
                  </label>
                  <select
                    name="speakers"
                    id="speakers"
                    multiple
                    value={formData.speakers}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {speakersList.length > 0 ? (
                      speakersList.map((speaker) => (
                        <option key={speaker._id} value={speaker._id}>
                          {speaker.fullName}
                        </option>
                      ))
                    ) : (
                      <option disabled>No speakers available</option>
                    )}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Hold down the Ctrl (windows) or Command (Mac) button to
                    select multiple options.
                  </p>
                </div>

                {/* Start Time */}
                <div className="mb-4">
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-gray-700"
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* End Time */}
                <div className="mb-4">
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-gray-700"
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
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Remarks */}
                <div className="mb-4">
                  <label
                    htmlFor="remarks"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Remarks
                  </label>
                  <input
                    type="text"
                    name="remarks"
                    id="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditSessionModal;
