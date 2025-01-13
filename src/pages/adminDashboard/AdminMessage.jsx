import React, { useEffect, useState } from "react";
import {
  createMessagesApi,
  deleteMessagesApi,
  getAllMessages,
} from "../../apis/Api";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import useDocumentTitle from "../../components/DocTitle";

const AdminMessage = () => {
  useDocumentTitle("Add Message - International Youth Camp 2025");

  const [messageGet, setMessageGet] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [imagePreviews, setImagePreviews] = useState({
    author1image: null,
    author1signature: null,
    author2image: null,
    author2signature: null,
  });

  const [formData, setFormData] = useState({
    msgFrom: "",
    msgTitle: "",
    msgGreeting: "",
    msgDescription: "",
    msgEndingRemarks: "",
    author1fullName: "",
    author1description: "",
    author1image: null,
    author1signature: null,
    author2fullName: "",
    author2description: "",
    author2image: null,
    author2signature: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }

    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("msgFrom", formData.msgFrom);
    data.append("msgTitle", formData.msgTitle);
    data.append("msgGreeting", formData.msgGreeting);
    data.append("msgDescription", formData.msgDescription);
    data.append("msgEndingRemarks", formData.msgEndingRemarks);
    data.append("author1fullName", formData.author1fullName);
    data.append("author1description", formData.author1description);
    if (formData.author1image)
      data.append("author1image", formData.author1image);
    if (formData.author1signature)
      data.append("author1signature", formData.author1signature);
    data.append("author2fullName", formData.author2fullName);
    data.append("author2description", formData.author2description);
    if (formData.author2image)
      data.append("author2image", formData.author2image);
    if (formData.author2signature)
      data.append("author2signature", formData.author2signature);

    try {
      if (formData.msgFrom === "") {
        return toast.error("Message From is required");
      }
      if (formData.msgTitle === "") {
        return toast.error("Message Title is required");
      }
      if (formData.msgGreeting === "") {
        return toast.error("Message Greeting is required");
      }
      if (formData.msgDescription === "") {
        return toast.error("Message Description is required");
      }
      if (formData.msgEndingRemarks === "") {
        return toast.error("Message Ending Remarks is required");
      }
      if (formData.author1fullName === "" && formData.author2fullName === "") {
        return toast.error("At least one author is required");
      }
      const res = await createMessagesApi(data);
      if (res.data.success) {
        toast.success("Message created successfully");
        setFormData({
          msgFrom: "",
          msgTitle: "",
          msgGreeting: "",
          msgDescription: "",
          msgEndingRemarks: "",
          author1fullName: "",
          author1description: "",
          author1image: "",
          author1signature: "",
          author2fullName: "",
          author2description: "",
          author2image: "",
          author2signature: "",
        });
        fetchMessage();
      } else {
        toast.error("Failed to create message");
      }
    } catch (error) {
      alert("An error occurred while creating the message");
    }
  };

  const fetchMessage = async () => {
    try {
      const response = await getAllMessages();
      if (response.status === 200 || response.status === 201) {
        setMessageGet(response.data.allMessage);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  const openModal = (image) => {
    setSelectedMessage(image);
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteMessagesApi(id);
      if (res.data.success) {
        toast.success("Message Deleted Successfully");
        fetchMessage();
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      //console.log(`Error deleting message: ${error}`);
      toast.error("An error occurred while deleting the message");
    }
  };

  return (
    <>
      <div className="text-2xl font-bold text-start  text-black mt-2">
        Add Messages
      </div>
      <div className="mt-2 p-4 rounded-lg bg-white shadow-lg w-full text-black">
        <form className="w-full max bg-white p-2 " onSubmit={handleSubmit}>
          <div className="mb-4 text-gray-700 flex flex-col md:flex-row md:space-x-4">
            <div className="w-full">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Message From
              </label>
              <input
                type="text"
                name="msgFrom"
                placeholder="* Message From"
                autoComplete="msgFrom"
                value={formData.msgFrom}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="w-full">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Message Title
              </label>
              <input
                type="text"
                name="msgTitle"
                placeholder="* Message Title"
                autoComplete="msgTitle"
                value={formData.msgTitle}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="w-full mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Message Greetings
            </label>
            <input
              type="text"
              name="msgGreeting"
              placeholder="* Message Greetings"
              autoComplete="msgGreeting"
              value={formData.msgGreeting}
              onChange={handleChange}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mb-4 text-gray-700">
            <label
              className="block text-lg font-medium text-gray-700 mb-2"
              htmlFor="description"
            >
              Message Description
            </label>
            <textarea
              id="description"
              name="msgDescription"
              placeholder="* Message Description"
              rows="4"
              value={formData.msgDescription}
              onChange={handleChange}
              autoComplete="msgDescription"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>
          <div className="w-full mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Message Ending Remarks
            </label>
            <input
              type="text"
              name="msgEndingRemarks"
              placeholder="* Message Ending Remarks"
              autoComplete="msgEndingRemarks"
              value={formData.msgEndingRemarks}
              onChange={handleChange}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            />
          </div>
          {/* Author 1 */}
          <div className="flex flex-col  mb-6 mt-2 md:space-x-4">
            <div className="w-full">
              <h1 className="font-semibold text-center">Author 1</h1>
              <div className="flex flex-col md:flex-row md:space-x-4 mt-2">
                <div className="w-full">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Author Full Name
                  </label>
                  <input
                    type="text"
                    name="author1fullName"
                    placeholder="Author Full Name"
                    autoComplete="author1fullName"
                    value={formData.author1fullName}
                    onChange={handleChange}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Author Description
                  </label>
                  <input
                    type="text"
                    name="author1description"
                    placeholder="Author Description"
                    autoComplete="author1description"
                    value={formData.author1description}
                    onChange={handleChange}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="mt-5">
                  <h1 className="text-black">Upload Author Image</h1>
                  <input
                    type="file"
                    name="author1image"
                    onChange={handleFileChange}
                    className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  />
                  {imagePreviews.author1image && (
                    <img
                      src={imagePreviews.author1image}
                      alt="Author 1 Preview"
                      className="w-32 h-32 object-cover mb-2"
                    />
                  )}
                </div>
                <div className="mt-5">
                  <h1 className="text-black">Upload Author Signature</h1>
                  <input
                    type="file"
                    name="author1signature"
                    onChange={handleFileChange}
                    className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  />
                  {imagePreviews.author1signature && (
                    <img
                      src={imagePreviews.author1signature}
                      alt="Author 1 Preview"
                      className="w-32 h-32 object-cover mb-2"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Author 2 */}
            <div className="w-full">
              <h1 className="font-semibold text-center">Author 2 (Optional)</h1>
              <div className="flex flex-col md:flex-row md:space-x-4 mt-2">
                <div className="w-full">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Author Full Name
                  </label>
                  <input
                    type="text"
                    name="author2fullName"
                    placeholder="Author Full Name"
                    autoComplete="author2fullName"
                    value={formData.author2fullName}
                    onChange={handleChange}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Author Description
                  </label>
                  <input
                    type="text"
                    name="author2description"
                    placeholder="Author Description"
                    autoComplete="author2description"
                    value={formData.author2description}
                    onChange={handleChange}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="mt-5">
                  <h1 className="text-black">Upload Author Image</h1>
                  <input
                    type="file"
                    name="author2image"
                    onChange={handleFileChange}
                    className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  />
                  {imagePreviews.author2image && (
                    <img
                      src={imagePreviews.author2image}
                      alt="Author 1 Preview"
                      className="w-32 h-32 object-cover mb-2"
                    />
                  )}
                </div>
                <div className="mt-5">
                  <h1 className="text-black">Upload Author Signature</h1>
                  <input
                    type="file"
                    name="author2signature"
                    onChange={handleFileChange}
                    className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  />
                  {imagePreviews.author2signature && (
                    <img
                      src={imagePreviews.author2signature}
                      alt="Author 1 Preview"
                      className="w-32 h-32 object-cover mb-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Message
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center">
          <div className="w-full max bg-white p-5 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              All Messages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {messageGet.map((message, index) => (
                <div
                  key={index}
                  className="relative max-w-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2 mr-12 text-gray-900">
                      {message.msgFrom}
                    </div>
                    <div></div>
                    {message.author1 &&
                      (message.author1.author1fullName ||
                        message.author1.author1image) && (
                        <div className="text-left">
                          {message.author1.author1fullName && (
                            <p className="font-bold text-lg text-green-800">
                              {message.author1?.author1fullName} <br />
                              {message.author1?.author1description}
                            </p>
                          )}
                          {message.author1.author1image && (
                            <img
                              // src={`https://crownthevisionapi.onrender.com/${message.author1.author1image}`}
                              src={
                                message.author1.author1image
                                  ? // ? `https://crownthevisionapi.onrender.com/${message.author1.author1image}`
                                    `https://crownthevisionapi.onrender.com/${message.author1.author1image}`
                                  : "https://via.placeholder.com/100"
                              }
                              alt={message.author1.author1fullName || "Author"}
                              className="p-2 lg:w-[200px] lg:h-[200px] w-[100%] h-[100%] rounded-full"
                            />
                          )}
                        </div>
                      )}
                    {message.author2 &&
                      (message.author2.author2fullName ||
                        message.author2.author2image) && (
                        <div className="text-left">
                          {message.author2.author2fullName && (
                            <p className="font-bold text-lg text-green-800">
                              {message.author2?.author2fullName} <br />
                              {message.author2?.author2description}
                            </p>
                          )}
                          {message.author2.author2image && (
                            <img
                              // src={`https://crownthevisionapi.onrender.com/${message.author2.author2image}`}
                              src={
                                message.author2.author2image
                                  ? `https://crownthevisionapi.onrender.com/${message.author2.author2image}`
                                  : "https://via.placeholder.com/100"
                              }
                              alt={message.author2.author2fullName || "Author"}
                              className="p-2 lg:w-[200px] lg:h-[200px] w-[100%] h-[100%] rounded-full"
                            />
                          )}
                        </div>
                      )}
                  </div>
                  <div className="absolute top-0 right-0 mt-2 flex flex-row cursor-pointer">
                    <FaEye
                      onClick={() => openModal(message)}
                      className="text-blue-700 h-10 w-6 mr-2 "
                    />
                    <MdDelete
                      onClick={() => handleDelete(message._id)}
                      className="text-red-700 h-10 w-8 "
                    />
                  </div>

                  <p className="text-white text-lg px-4 text-center">
                    {message.msgFrom}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedMessage && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-1/2 h-1/2 my-6 mx-auto max-w-3xl  ">
              <div className="  border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold text-black">
                    {selectedMessage.msgFrom}
                  </h3>
                  <img
                    // src={`https://crownthevisionapi.onrender.com/${selectedMessage.author2.author2image}`}
                    src={
                      selectedMessage.author2.author2image
                        ? `https://crownthevisionapi.onrender.com/${selectedMessage.author2.author2image}`
                        : "https://via.placeholder.com/100"
                    }
                    style={{ width: "80px" }}
                    alt=""
                  />
                  <img
                    // src={`https://crownthevisionapi.onrender.com/${selectedMessage.author1.author1image}`}
                    src={
                      selectedMessage.author1.author1image
                        ? // ? `https://crownthevisionapi.onrender.com/${selectedMessage.author1.author1image}`
                          `https://crownthevisionapi.onrender.com/${selectedMessage.author1.author1image}`
                        : "https://via.placeholder.com/100"
                    }
                    style={{ width: "80px" }}
                    alt=""
                  />
                </div>
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed text-black font-semibold">
                    {selectedMessage.msgTitle}
                  </p>
                  <div
                    style={{ maxHeight: "220px" }}
                    className="overflow-y-auto my-4 scroll-smooth focus:scroll-auto  md:scroll-auto text-blueGray-500 text-justify text-lg leading-relaxed text-black"
                  >
                    {selectedMessage.msgDescription}
                  </div>
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed text-black">
                    {selectedMessage.author1.author1fullName} <br />
                    {selectedMessage.author1.author1description}
                  </p>
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed text-black">
                    {selectedMessage.author2.author2fullName
                      ? selectedMessage.author2.author2fullName
                      : ""}
                    <br />
                    {selectedMessage.author2.author2description
                      ? selectedMessage.author2.author2description
                      : ""}
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => closeModal()}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
};

export default AdminMessage;
