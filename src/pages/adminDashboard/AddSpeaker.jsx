import React, { useState, useEffect } from "react";
import useDocumentTitle from "../../components/DocTitle";
import {
  addSpeakerApi,
  getAllSpeakersApi,
  updateSpeakerApi,
  deleteSpeakerApi,
  getAllUsersApi,
  getAllEventsApi,
} from "../../apis/Api";
import toast from "react-hot-toast";
import { Pagination, Stack } from "@mui/material";

const AddSpeaker = () => {
  useDocumentTitle("Add Speakers - International Youth Camp 2025");

  const [speakers, setSpeakers] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    designation: "",
    email: "",
    biography: "",
    session: "",
    sessionTime: "",
    session2: "",
    sessionTime2: "",
    image: null,
  });
  const [emailError, setEmailError] = useState("");
  const [editingSpeakerId, setEditingSpeakerId] = useState(null);
  const [allUser, setAllUser] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(null);
  const [profileImagePreviews, setprofileImagePreviews] = useState(null);
  const [IsImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [allEvent, setAllEvent] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSession2, setSelectedSession2] = useState("");

  const ImagePreviewModal = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative bg-white p-5 rounded-lg shadow-lg max-w-full max-h-full">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
            aria-label="Close image preview"
          >
            <i className="fas fa-times"></i>
          </button>
          <img src={imageUrl} alt="Preview" className="w-80 h-1/2" />
        </div>
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") {
      validateEmail(value);
    } else if (name === "session") {
      handleTimeChange(e);
    } else if (name === "session2") {
      handleTimeChange2(e);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviews(
        formData.image ? URL.createObjectURL(formData.image) : null
      );
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    const payload = new FormData();
    payload.append("fullName", formData.name);
    payload.append("institution", formData.companyName);
    payload.append("designation", formData.designation);
    payload.append("email", formData.email);
    payload.append("biography", formData.biography);
    payload.append("session", formData.session);
    payload.append("sessionTime", formData.sessionTime);
    payload.append("session2", formData.session2 || "");
    payload.append("sessionTime2", formData.sessionTime2 || "");

    if (formData.image) {
      payload.append("image", formData.image);
    } else if (formData.imageURL) {
      payload.append("imageURL", formData.imageURL);
    }

    try {
      if (editingSpeakerId) {
        await updateSpeakerApi(editingSpeakerId, payload);
        toast.success("Speaker updated successfully!");
        setEditingSpeakerId(null);
      } else {
        await addSpeakerApi(payload);
        setFormData({
          name: "",
          companyName: "",
          designation: "",
          email: "",
          biography: "",
          session: "",
          sessionTime: "",
          session2: "",
          sessionTime2: "",
          image: null,
        });
        toast.success(
          "Speaker Registered. Speaker will receive a confirmation email soon."
        );
      }
      fetchSpeakers();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`${error.response.data.message}`);
      } else {
        toast.error(`${error.message}`);
      }
      // console.error(`Error ${editingSpeakerId ? "updating" : "adding"} speaker:`, error);
    }
  };

  const fetchSpeakers = async () => {
    try {
      const response = await getAllSpeakersApi();
      setSpeakers(response.data.speakers);
    } catch (error) {
      toast.error("Error fetching speakers.");
      console.error("Error fetching speakers:", error);
    }
  };

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (speaker) => {
    setEditingSpeakerId(speaker._id);
    setFormData({
      name: speaker.fullName,
      companyName: speaker.institution,
      designation: speaker.designation,
      email: speaker.email,
      biography: speaker.biography,
      session: speaker.session,
      sessionTime: speaker.sessionTime,
      session2: speaker.session2 || "NA",
      sessionTime2: speaker.sessionTime2 || "NA",
      image: speaker.image || null,
    });

    let imageUrls = "";
    if (speaker?.image) {
      imageUrls = `https://crownthevisionapi.onrender.com/${speaker?.image}`;
      // imageUrls = `https://crownthevisionapi.onrender.com/${speaker?.image}`;
    }
    setImagePreviews(imageUrls);

    const middlePosition = window.innerHeight / 2;
    window.scrollTo({ top: middlePosition, behavior: "smooth" });
  };

  const handleDelete = async (speakerId) => {
    try {
      await deleteSpeakerApi(speakerId);
      toast.success("Speaker deleted successfully!");
      fetchSpeakers();
    } catch (error) {
      toast.error("Error deleting speaker.");
      console.error("Error deleting speaker:", error);
    }
  };

  useEffect(() => {
    fetchSpeakers();
    getallUser();
    fetchAllEvent();
  }, []);

  const getallUser = async () => {
    try {
      const res = await getAllUsersApi();
      if (res.status === 200 || res.status === 201) {
        setAllUser(res.data.users);
        console.log(res.data.users);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  //Pagination State
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setemailFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const filteredUsers =
    allUser &&
    allUser.filter(
      (user) =>
        (user.personalInformation?.fullName?.firstName
          ?.toLowerCase()
          .includes(nameFilter.toLowerCase()) ||
          user.personalInformation?.fullName?.lastName
            ?.toLowerCase()
            .includes(nameFilter.toLowerCase())) &&
        user.personalInformation?.emailAddress
          ?.toLowerCase()
          .includes(emailFilter.toLowerCase())
    );

  const indexofLastUser = currentPage * usersPerPage;
  const indexofFirstUser = indexofLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexofFirstUser, indexofLastUser);

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  const [addSpeakerId, setaddSpeakerId] = useState(null);

  const handleAddtoSpeaker = (user) => {
    setaddSpeakerId(user._id);
    console.log(addSpeakerId);
    setFormData({
      name: user.personalInformation?.fullName?.firstName || "",
      companyName: user.personalInformation?.nameOfInstitution || "",
      designation: user.personalInformation?.jobPosition || "",
      email: user.personalInformation?.emailAddress || "",
      biography: user.biography || "NA",
      image: user?.profilePicture?.fileName || null,
    });

    let imageUrls = "";
    if (user?.profilePicture?.fileName) {
      // imageUrls = `https://crownthevisionapi.onrender.com/${user.profilePicture.fileName}`;
      imageUrls = `https://acsicnepal.com/${user.profilePicture.fileName}`;
    }
    setImagePreviews(imageUrls);

    const bottomMiddlePosition = window.innerHeight * 0.5;
    window.scrollTo({ top: bottomMiddlePosition, behavior: "smooth" });
  };

  const fetchAllEvent = async () => {
    try {
      const res = await getAllEventsApi();
      if (res.status === 200 || res.status === 201) {
        setAllEvent(res.data.events);
      } else {
        toast.error("Error Fetching Events");
      }
    } catch (error) {
      toast.error(`Error Fetching All Events is ${error}`);
    }
  };

  const handleTimeChange = (e) => {
    const selectedSession = e.target.value;

    // Update the session in formData
    setFormData((prev) => ({
      ...prev,
      session: selectedSession,
    }));

    // Find the selected session in all events to get the sessionTime
    const foundSession = allEvent
      .flatMap((event) => event.details) // Flatten all the details from all events
      .find((session) => session.subtitle === selectedSession); // Find the matching session

    if (foundSession) {
      setSelectedSession(foundSession.time);

      // Update sessionTime in formData
      setFormData((prev) => ({
        ...prev,
        sessionTime: foundSession.time,
      }));
    } else {
      setSelectedSession("");
      setFormData((prev) => ({
        ...prev,
        sessionTime: "", // Clear sessionTime if no session found
      }));
    }
  };

  const handleTimeChange2 = (e) => {
    const selectedSession2 = e.target.value;

    // Update the session in formData
    setFormData((prev) => ({
      ...prev,
      session2: selectedSession2,
    }));

    // Find the selected session in all events to get the sessionTime
    const foundSession = allEvent
      .flatMap((event) => event.details) // Flatten all the details from all events
      .find((session) => session.subtitle === selectedSession2); // Find the matching session

    if (foundSession) {
      setSelectedSession2(foundSession.time);

      // Update sessionTime in formData
      setFormData((prev) => ({
        ...prev,
        sessionTime2: foundSession.time,
      }));
    } else {
      setSelectedSession2("");
      setFormData((prev) => ({
        ...prev,
        sessionTime2: "", // Clear sessionTime if no session found
      }));
    }
  };

  const handleImageClick = (url) => {
    setprofileImagePreviews(url);
    setIsImagePreviewOpen(true);
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-start mb-4 text-black mt-2">
        {editingSpeakerId ? "Edit Speaker" : "Add Speaker"}
      </h2>
      <div className="w-full max bg-white p-5 rounded-lg shadow-lg mb-10">
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:space-x-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="p-2 border rounded flex-grow mr-4 text-black mb-2 sm:mb-0"
            />
            <input
              type="text"
              placeholder="Search by email..."
              value={emailFilter}
              onChange={(e) => setemailFilter(e.target.value)}
              className="p-2 border rounded flex-grow mr-4 text-black mb-2 sm:mb-0"
            />
          </div>
          <table className="min-w-full leading-normal shadow-md bg-transparent">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  SN
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  Choice
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {user.personalInformation?.fullName?.firstName || "N/A"}{" "}
                    {user.personalInformation?.fullName?.lastName || "N/A"}{" "}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {user.personalInformation?.emailAddress || "N/A"}{" "}
                  </td>
                  <td>
                    <button
                      onClick={() => handleAddtoSpeaker(user)}
                      className="px-5 py-2 border-b bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600"
                    >
                      Add to Speaker
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Stack spacing={2} className="mt-4">
            <Pagination
              count={Math.ceil(filteredUsers.length / usersPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </div>
        <form className="space-y-6 text-green-600 " onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 ">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Fullname of Speaker"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Institution
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Institution Name"
              />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Designation"
              />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Email"
              />
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium text-gray-700">
                Select Session
              </label>
              <select
                onChange={handleTimeChange}
                name="session"
                value={formData.session}
                // value={selectedSession}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              >
                <option value="">All Session</option>
                {allEvent.map((event) =>
                  event.details.map((detail) => (
                    <option key={detail._id} value={detail.subtitle}>
                      {detail.subtitle}
                    </option>
                  ))
                )}
              </select>
            </div>
            {selectedSession && (
              <p
                name="sessionTime"
                value={formData.sessionTime}
                onChange={handleInputChange}
              >
                Selected Session Time:
                {selectedSession}
              </p>
            )}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium text-gray-700">
                Select Another Session (Not Mandatory)
              </label>
              <select
                onChange={handleTimeChange2}
                name="session2"
                value={formData.session2}
                // value={selectedSession}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              >
                <option value="">All Session</option>
                {allEvent.map((event) =>
                  event.details.map((detail) => (
                    <option key={detail._id} value={detail.subtitle}>
                      {detail.subtitle}
                    </option>
                  ))
                )}
              </select>
            </div>
            {selectedSession2 && (
              <p
                name="sessionTime2"
                value={formData.sessionTime2}
                onChange={handleInputChange}
              >
                Selected Session Time:
                {selectedSession2}
              </p>
            )}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviews && (
                  <div className="relative w-32 h-32">
                    <img
                      src={imagePreviews}
                      alt="Selected"
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700">
                Biography
              </label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
                placeholder="Enter Biography"
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            {editingSpeakerId ? "Update" : "Save"}
          </button>
        </form>
      </div>

      <div className="w-full max bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          List of Speakers
        </h2>
        <div className="space-y-6">
          {speakers.map((speaker) => (
            <div
              key={speaker._id}
              className="bg-white border border-gray-100 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <div className="flex items-center">
                <img
                  src={
                    speaker.image
                      ? `https://crownthevisionapi.onrender.com/${speaker.image}`
                      : "https://static.vecteezy.com/system/resources/previews/020/168/700/original/faceless-male-silhouette-empty-state-avatar-icon-businessman-editable-404-not-found-persona-for-ux-ui-design-cartoon-profile-picture-with-red-dot-colorful-website-mobile-error-user-badge-vector.jpg"
                  }
                  onClick={() =>
                    handleImageClick(
                      `https://crownthevisionapi.onrender.com/${speaker.image}`
                    )
                  }
                  alt="Speaker"
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div className="flex-grow">
                  <p className="text-gray-700 text-sm">
                    <strong>Full Name :</strong> {speaker.fullName}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Designation :</strong> {speaker.designation}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Institution :</strong> {speaker.institution}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Email :</strong> {speaker.email}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Assigned Session :</strong> {speaker.session}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong> Session Time :</strong> {speaker.sessionTime}
                  </p>

                  {speaker.session2 && (
                    <>
                      <p className="text-gray-700 text-sm">
                        <strong>Another Assigned Session :</strong>{" "}
                        {speaker.session2}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <strong>Session Time :</strong> {speaker.sessionTime2}
                      </p>
                    </>
                  )}
                  <div className="flex mt-3">
                    <button
                      onClick={() => handleEdit(speaker)}
                      className="mr-3 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(speaker._id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleCollapse(speaker._id)}
                      className="ml-auto px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600"
                    >
                      {collapsed[speaker._id] ? "Hide Bio" : "Show Bio"}
                    </button>
                  </div>
                </div>
              </div>
              {collapsed[speaker._id] && (
                <div className="mt-4">
                  <p className="text-gray-700 text-sm text-justify">
                    <strong>Biography:</strong> {speaker.biography}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <ImagePreviewModal
        isOpen={IsImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        imageUrl={profileImagePreviews}
      />
    </div>
  );
};

export default AddSpeaker;
