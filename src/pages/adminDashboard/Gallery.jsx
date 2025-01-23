import React, { useState, useEffect } from "react";
import {
  addImageinGalaryApi,
  getAllImageinGalaryApi,
  deleteImageFromGalaryApi,
} from "../../apis/Api";
import toast from "react-hot-toast";
import GalleryConfirmationModel from "../../components/GalleryConfirmationModel";
import useDocumentTitle from "../../components/DocTitle";

const Gallery = () => {
  useDocumentTitle("Gallery - International Youth Camp 2025");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const res = await getAllImageinGalaryApi();
      if (res.data.success) {
        setGalleryImages(res.data.gallery);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      let errorMessage = "Internal server error";
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const handletitle = (e) => {
    setTitle(e.target.value);
  };

  const handledescription = (e) => {
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

  const handelSubmit = (e) => {
    e.preventDefault();

    if (!image || !title.trim() || !description.trim()) {
      toast.error("Please enter all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    addImageinGalaryApi(formData)
      .then((res) => {
        if (!res.data.success) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          fetchGalleryImages();
          setTitle("");
          setDescription("");
          setImage(null);
          setImagePreview(null);
        }
      })
      .catch((err) => {
        let errorMessage = "Internal server error";
        if (err.response && err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        toast.error(errorMessage);
      });
  };

  const handleDelete = (id) => {
    setImageToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteImageFromGalaryApi(imageToDelete)
      .then((res) => {
        if (res.data.success) {
          toast.success("Image deleted successfully");
          fetchGalleryImages();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        let errorMessage = "Internal server error";
        if (err.response && err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        toast.error(errorMessage);
      })
      .finally(() => {
        setDeleteModalOpen(false);
      });
  };

  const handleCancelDelete = () => {
    setImageToDelete(null);
    setDeleteModalOpen(false);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-3">
        Gallery
      </h1>
      <div className="flex justify-center items-center mb-5">
        <form
          className="w-full max bg-white p-5 rounded-lg shadow-lg"
          onSubmit={handelSubmit}
        >
          <div className="text-gray-700 mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Image for Media Center
            </label>
            <input
              type="file"
              name="galleryImage"
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
              Image Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Image Title"
              value={title}
              onChange={handletitle}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mb-4 text-gray-700">
            <label
              className="block text-lg font-medium text-gray-700 mb-2"
              htmlFor="description"
            >
              Image Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Image Description"
              rows="4"
              value={description}
              onChange={handledescription}
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
          <h2 className="text-lg font-bold text-gray-900 mb-2">All Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative max-w-sm rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  // src={
                  //   image.image
                  //     ? `https://energy-transition-api.onrender.com/${image.image}`
                  //     : "https://via.placeholder.com/100"
                  // }
                  src={
                    image.image
                      ? `https://energy-transition-api.onrender.com/${image.image}`
                      : "https://via.placeholder.com/100"
                  }
                  alt="Gallery"
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 text-gray-900">
                    {image.title}
                  </div>
                  <p className="text-gray-700 text-base">{image.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(image._id)}
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

export default Gallery;
