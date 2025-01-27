import React, { useState, useEffect } from "react";
import {
  addBannerImageApi,
  getAllBannerImagesApi,
  deleteBannerImageApi,
} from "../../apis/Api";
import toast from "react-hot-toast";
import GalleryConfirmationModel from "../../components/GalleryConfirmationModel";
import useDocumentTitle from "../../components/DocTitle";

const BannerManager = () => {
  useDocumentTitle("Add Banner - Uranus Event Management");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    fetchBannerImages();
  }, []);

  const fetchBannerImages = async () => {
    try {
      const res = await getAllBannerImagesApi();
      if (res.data.success) {
        setBannerImages(res.data.banners);
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

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      setImage(file);
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !title.trim() || !description.trim()) {
      toast.error("Please enter all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("bannerimage", image);

    try {
      const res = await addBannerImageApi(formData);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchBannerImages();
        setTitle("");
        setDescription("");
        setImage(null);
        setImagePreview(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Internal server error";
      toast.error(errorMessage);
    }
  };

  const handleDelete = (id) => {
    setImageToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteBannerImageApi(imageToDelete);
      if (res.data.success) {
        toast.success("Banner deleted successfully");
        fetchBannerImages();
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
    setImageToDelete(null);
    setDeleteModalOpen(false);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-3">
        Banner Management
      </h1>
      <div className="flex justify-center items-center mb-5">
        <form
          className="w-full max bg-white p-5 rounded-lg shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="text-gray-700 mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Banner Image
            </label>
            <input
              type="file"
              name="bannerimage"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
            />
            {imagePreview && (
              <div className="mb-4 flex justify-center items-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-auto rounded-md shadow-sm"
                />
              </div>
            )}
          </div>
          <div className="mb-4 text-gray-700">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Banner Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Banner Title"
              value={title}
              onChange={handleTitleChange}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mb-4 text-gray-700">
            <label
              className="block text-lg font-medium text-gray-700 mb-2"
              htmlFor="description"
            >
              Banner Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Banner Description"
              rows="4"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>
          <div className="flex justify-center items-center mb-5">
            <button
              type="submit"
              className="w-full max-w-xs text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Upload
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max bg-white p-5 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-2">All Banners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bannerImages.map((banner, index) => (
              <div
                key={index}
                className="relative max-w-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={
                    banner.url
                      ? `https://energy-transition-api.onrender.com/${banner.url.replace(
                          /\\/g,
                          "/"
                        )}`
                      : "https://via.placeholder.com/100"
                  }
                  alt="Banner"
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 text-gray-900">
                    {banner.title}
                  </div>
                  <p className="text-gray-700 text-base">
                    {banner.description}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(banner._id)}
                  className="absolute top-0 right-0 mt-2 mr-2 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        <GalleryConfirmationModel
          isOpen={deleteModalOpen}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </>
  );
};

export default BannerManager;
