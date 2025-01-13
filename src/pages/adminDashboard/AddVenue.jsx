import React, { useEffect, useState } from "react";
import {
  createVenue,
  deleteVenueById,
  getAllVenue,
  updateVenueById,
} from "../../apis/Api";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import useDocumentTitle from "../../components/DocTitle";

const AddVenue = () => {
  useDocumentTitle("Add Venue - International Youth Camp 2025");

  const [allVenue, setAllVenue] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    phone: "",
    webLink: "",
    venueimage: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const [editingMessageById, setEditingMessageById] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files.length > 0) {
      const fileArray = Array.from(files);
      const fileReaders = fileArray.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders).then((results) => {
        setImagePreviews((prev) => [...prev, ...results]);
        setFormData((prev) => ({
          ...prev,
          [name]: fileArray,
        }));
      });
    }
  };

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      venueimage: prev.venueimage.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    fetchAllVenue();
  }, []);

  const fetchAllVenue = async () => {
    try {
      const res = await getAllVenue();
      if (res.status === 200 || res.status === 201) {
        setAllVenue(res.data.allVenue);
      }
    } catch (error) {
      // console.log(`Error while fetching all Venue ${error}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteVenueById(id);
      if (res.data.success) {
        toast.success("Venue Deleted Successfully");
        fetchAllVenue();
      }
    } catch (error) {
      toast.error("An error occurred while deleting the message");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("address", formData.address);
    data.append("phone", formData.phone);
    data.append("webLink", formData.webLink);
    formData.venueimage.forEach((file) => {
      data.append("venueimage", file);
    });

    try {
      if (editingMessageById) {
        const res = await updateVenueById(editingMessageById, data);
        if (res.status === 200 || res.status === 201) {
          toast.success("Venue updated successfully");
          setEditingMessageById(null);
        } else {
          toast.error("Failed to update venue");
        }
      } else {
        const res = await createVenue(data);
        if (res.status === 200 || res.status === 201) {
          toast.success("Venue created successfully");
        } else {
          toast.error("Failed to create venue");
        }
      }
      setFormData({
        title: "",
        description: "",
        address: "",
        phone: "",
        webLink: "",
        venueimage: [],
      });
      setImagePreviews([]);
      fetchAllVenue();
    } catch (error) {
      // toast.error("An error occurred while saving the venue");
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`${error.response.data.message}`);
      } else {
        toast.error(`${error.message}`);
      }
    }
  };

  const handleEdit = (venue) => {
    setEditingMessageById(venue._id);
    setFormData({
      title: venue.title || "",
      description: venue.description || "",
      address: venue.address || "",
      phone: venue.phone || "",
      webLink: venue.webLink || "",
      venueimage: venue.venueimage || [],
    });

    const imageUrls = venue.venueimage.map(
      // (img) => `https://crownthevisionapi.onrender.com/${img}`
      (img) => `https://crownthevisionapi.onrender.com/${img}`
    );
    setImagePreviews(imageUrls);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = (e) => {
    e.preventDefault();
    setFormData({
      title: "",
      description: "",
      address: "",
      phone: "",
      webLink: "",
      venueimage: [],
    });
    setImagePreviews([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-start mb-4 text-black mt-2">
        Add Venue
      </h2>
      <div className="mt-2 p-2 rounded-lg bg-white w-full text-black">
        <form className="w-full max p-2 text-black shadow-lg">
          <div className="w-full mb-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Venue Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="* Venue Title"
              autoComplete="title"
              onChange={handleChange}
              value={formData.title}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="w-full mb-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Venue Description
            </label>
            <textarea
              type="text"
              name="description"
              placeholder="* Venue Description"
              autoComplete="description"
              onChange={handleChange}
              rows="4"
              value={formData.description}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="w-full mb-2">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Venue Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="* Venue Address"
                autoComplete="address"
                onChange={handleChange}
                value={formData.address}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
            {/* <div className="w-full mb-2">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Venue Phone
              </label>
              <input
                type="number"
                name="phone"
                placeholder="* Venue Phone"
                autoComplete="phone"
                onChange={handleChange}
                value={formData.phone}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div> */}
          </div>
          <div className="w-full mb-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Venue Link
            </label>
            <input
              type="text"
              name="webLink"
              placeholder="* Venue Link"
              autoComplete="webLink"
              onChange={handleChange}
              value={formData.webLink}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mt-5">
            <input
              type="file"
              onChange={handleFileChange}
              name="venueimage"
              multiple
              className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {imagePreviews.map((image, index) => (
              <div key={index} className="relative w-32 h-32">
                <img
                  src={image}
                  alt={`preview-${index}`}
                  className="object-cover w-full h-full rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-8 mb-5 gap-5">
            <button
              onClick={handleSubmit}
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingMessageById ? "Update Venue" : "Add Venue"}
            </button>
            <button
              onClick={handleClear}
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
      <div className="overflow-x-auto mt-8 text-black">
        <table className="min-w-full leading-normal shadow-md bg-transparent  border-black">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-l-sm text-xs uppercase tracking-wider">
                Title
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider hidden md:block">
                Description
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                Address
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                Phone
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                Link
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                Images
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-r-sm text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {allVenue.length > 0 &&
              allVenue.map((venue) => (
                <tr key={venue._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {venue.title}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700 text-justify hidden md:block">
                    {venue.description}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {venue.address}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {venue.phone}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-blue-600">
                    <a
                      href={venue.webLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {venue.webLink}
                    </a>
                  </td>
                  <td className="border p-2">
                    {venue.venueimage.length > 0 && (
                      <div className="flex flex-wrap">
                        {venue.venueimage.map((img, index) => (
                          <img
                            key={index}
                            // src={`https://crownthevisionapi.onrender.com/${img}`}
                            src={`https://crownthevisionapi.onrender.com/${img}`}
                            alt={`Venue ${index + 1}`}
                            className="w-16 h-16 object-cover mr-2 mb-2"
                          />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(venue)}
                      className="text-blue-500"
                    >
                      <MdEdit size={25} />
                    </button>
                    <button
                      onClick={() => handleDelete(venue._id)}
                      className="text-red-500 ml-2"
                    >
                      <MdDelete size={25} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddVenue;
