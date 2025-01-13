import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/images/leologo.png";
import Navbar from "../../components/Navbar";
import useDocumentTitle from "../../components/DocTitle";
import { getUserByIdApi, updateProfileApi } from "../../apis/Api";
import SuccessDialog from "../../components/SuccessDialog";
import toast from "react-hot-toast";
import AlertDialog from "../../components/AlertDialog";

const UserDashboardPage = () => {
  useDocumentTitle("User Profile - International Youth Camp 2025");

  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // For User Update Image
  const [userImage, setUserImage] = useState(null);
  const [preview, setPreview] = useState(null);
  // Alert Dialog state
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogDescription, setAlertDialogDescription] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    userimage: "",
    nationality: "",
    dateOfBirth: "",
    emailAddress: "",
    currentAddress: "",
    highestEducationLevel: "",
    leoMultipleDistrictAndClubName: "",
    positionInDistrict: "",
    occupation: "",
    intlOccupationPassportNumber: "",
    whatsAppNumber: "",
    emergencyContactNum: "",
    vegetarian: false,
    nonveg: false,
    other: "",
  });

  const handleEventPhotos = () => {
    toast.error("No Photos Available");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = localStorage.getItem("user");
        const userData = JSON.parse(user);
        const userID = userData._id;

        const response = await getUserByIdApi(userID);
        setUser(response.data);
        setFormData({
          title: response.data?.personalInformation?.title || "",
          firstName:
            response.data?.personalInformation?.fullName?.firstName || "",
          middleName:
            response.data?.personalInformation?.fullName?.middleName || "",
          lastName:
            response.data?.personalInformation?.fullName?.lastName || "",
          userimage:
            response.data?.personalInformation?.profilePicture?.filename || "",
          nationality: response.data?.personalInformation?.nationality || "",
          dateOfBirth: response.data?.personalInformation?.dateOfBirth || "",
          emailAddress: response.data?.personalInformation?.emailAddress || "",
          currentAddress:
            response.data?.personalInformation?.currentAddress || "",
          highestEducationLevel:
            response.data?.personalInformation?.highestEducationLevel || "",
          leoMultipleDistrictAndClubName:
            response.data?.personalInformation
              ?.leoMultipleDistrictAndClubName || "",
          positionInDistrict:
            response.data?.personalInformation?.positionInDistrict || "",
          occupation: response.data?.personalInformation?.occupation || "",
          intlOccupationPassportNumber:
            response.data?.personalInformation?.intlOccupationPassportNumber ||
            "",
          whatsAppNumber:
            response.data?.personalInformation?.whatsAppNumber || "",
          emergencyContactNum:
            response.data?.personalInformation?.emergencyContactNum || "",

          vegetarian: response.data?.dietaryRequirements?.vegetarian || false,
          nonveg: response.data?.dietaryRequirements?.nonveg || false,
          other: response.data?.dietaryRequirements?.other || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setAlertDialogTitle("Invalid File Type");
      setAlertDialogDescription("Please upload a JPEG or PNG file.");
      setAlertDialogOpen(true);
      return false;
    }
    if (file.size > maxSizeInBytes) {
      setAlertDialogTitle("File Too Large");
      setAlertDialogDescription(
        `The file size exceeds the limit of ${maxSizeInMB} MB. Please upload a smaller image.`
      );
      setAlertDialogOpen(true);
      return false;
    }

    return true;
  };

  const changeuserimage = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!validateImage(file)) return;

      console.log("File is ", file);
      // Update formData with the file
      setFormData((prev) => ({
        ...prev,
        userimage: file,
      }));

      // Set the preview for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Set the userImage state for tracking
      setUserImage(file);
      console.log("User Image is ", file);
    } else {
      setPreview(
        formData.userimage ? URL.createObjectURL(formData.userimage) : null
      );
      setFormData((prev) => ({
        ...prev,
        userimage: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("firstName", formData.firstName);
    fd.append("title", formData.title);
    fd.append("middleName", formData.middleName);
    fd.append("lastName", formData.lastName);
    fd.append("nationality", formData.nationality);
    fd.append("emailAddress", formData.emailAddress);
    fd.append("currentAddress", formData.currentAddress);
    fd.append("highestEducationLevel", formData.highestEducationLevel);
    fd.append("whatsAppNumber", formData.whatsAppNumber);
    fd.append("occupation", formData.occupation);
    fd.append(
      "leoMultipleDistrictAndClubName",
      formData.leoMultipleDistrictAndClubName
    );
    fd.append("positionInDistrict", formData.positionInDistrict);
    fd.append(
      "intlOccupationPassportNumber",
      formData.intlOccupationPassportNumber
    );

    fd.append("emergencyContactNum", formData.emergencyContactNum);
    fd.append("dateOfBirth", formData.dateOfBirth);
    fd.append("userimage", formData.userimage);

    try {
      const updatedUser = await updateProfileApi(user._id, fd);
      setUser(updatedUser.data);
      setIsEditMode(false);
      setIsModalOpen(true);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-800 to-blue-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-800 to-blue-900">
        <div className="text-white text-xl">No user data available.</div>
      </div>
    );
  }

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="relative bg-white p-8 rounded-2xl shadow-2xl max-w-4xl w-full">
          {/* Logo Positioned at Top-Right */}
          <div className="absolute top-5 right-5">
            <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center mb-8">
            {user?.personalInformation?.profilePicture?.fileName ? (
              <img
                src={`https://crownthevisionapi.onrender.com/${user.personalInformation.profilePicture.fileName}`}
                alt="Profile"
                className="w-40 h-40 rounded-full shadow-lg object-cover"
              />
            ) : (
              <div className="flex items-center justify-center bg-blue-800 text-white rounded-full w-40 h-40 text-4xl">
                {getInitials(
                  user.personalInformation?.fullName?.firstName,
                  user.personalInformation?.fullName?.lastName
                )}
              </div>
            )}
            <h1 className="mt-4 text-2xl font-bold text-green-800">
              Welcome, {user.personalInformation?.title || "N/A"}{" "}
              {user.personalInformation?.fullName?.firstName || "N/A"}!
            </h1>
            <p className="text-gray-600">
              {user.personalInformation?.positionInDistrict || "N/A"} at{" "}
              {/* {user.personalInformation?.nameOfInstitution || "N/A"} */}
            </p>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <div className="bg-gradient-to-tr from-blue-100 to-blue-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Personal Information
              </h3>
              <div className="space-y-2 text-black">
                <p>
                  <strong>Nationality:</strong>{" "}
                  {user.personalInformation?.nationality || "N/A"}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {user.personalInformation?.dateOfBirth
                    ? new Date(
                        user.personalInformation.dateOfBirth
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
                <p>
                  <strong>Email Address:</strong>{" "}
                  {user.personalInformation?.emailAddress || "N/A"}
                </p>
                <p>
                  <strong>Current Address:</strong>{" "}
                  {user.personalInformation?.currentAddress || "N/A"}
                </p>
                <p>
                  <strong>Education Level:</strong>{" "}
                  {user.personalInformation?.highestEducationLevel || "N/A"}
                </p>
                <p>
                  <strong>Leo Multiple District & Club Name:</strong>{" "}
                  {user.personalInformation?.leoMultipleDistrictAndClubName ||
                    "N/A"}
                </p>
                <p>
                  <strong>Occupation:</strong>{" "}
                  {user.personalInformation?.occupation || "N/A"}
                </p>
                <p>
                  <strong>Intl Occupation Passport Num:</strong>{" "}
                  {user.personalInformation?.intlOccupationPassportNumber ||
                    "N/A"}
                </p>
                <p>
                  <strong>WhatsApp Number:</strong>{" "}
                  {user.personalInformation?.whatsAppNumber || "N/A"}
                </p>
                <p>
                  <strong>Emergency Contact Num:</strong>{" "}
                  {user.personalInformation?.emergencyContactNum || "N/A"}
                </p>
              </div>
            </div>

            {/* Dietary Requirements Card */}
            {user?.personalInformation?.dietaryRequirements &&
            Object.values(user?.personalInformation?.dietaryRequirements).some(
              Boolean
            ) ? (
              <div className="bg-gradient-to-tr from-pink-100 to-pink-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-pink-800 mb-4">
                  Dietary Requirements
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {user?.personalInformation?.dietaryRequirements
                    .vegetarian && <li>Vegetarian</li>}
                  {user?.personalInformation?.dietaryRequirements.nonveg && (
                    <li>Non-Vegetarian</li>
                  )}
                  {user?.personalInformation?.dietaryRequirements.other && (
                    <li>
                      {user.personalInformation.dietaryRequirements.other}
                    </li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="bg-gradient-to-tr from-gray-100 to-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Dietary Requirements
                </h3>
                <p className="text-gray-700">N/A</p>
              </div>
            )}
          </div>

          {/* Edit Form */}
          {isEditMode ? (
            <form
              onSubmit={handleSubmit}
              className="mt-8 bg-white p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-blue-800 mb-6">
                Edit Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700">
                      Title:
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      First Name:
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Middle Name:
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Last Name:
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Nationality:
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Date of Birth:
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Email Address:
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700">
                      Current Address:
                      <input
                        type="text"
                        name="currentAddress"
                        value={formData.currentAddress}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Education Level:
                      <input
                        type="text"
                        name="highestEducationLevel"
                        value={formData.highestEducationLevel}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Leo Multiple District & Club Name:
                      <input
                        type="text"
                        name="leoMultipleDistrictAndClubName"
                        value={formData.leoMultipleDistrictAndClubName}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Position in District:
                      <input
                        type="text"
                        name="positionInDistrict"
                        value={formData.positionInDistrict}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Occupation:
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Intl Occupation Passport Number:
                      <input
                        type="text"
                        name="intlOccupationPassportNumber"
                        value={formData.intlOccupationPassportNumber}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      WhatsApp Number:
                      <input
                        type="text"
                        name="whatsAppNumber"
                        value={formData.whatsAppNumber}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Emergency Contact Number:
                      <input
                        type="text"
                        name="emergencyContactNum"
                        value={formData.emergencyContactNum}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="mt-6 bg-gradient-to-tr from-pink-100 to-pink-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-pink-800 mb-4">
                  Dietary Restrictions
                </h3>
                <div className="space-y-2 text-black">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="vegetarian"
                      checked={formData.vegetarian}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="nonveg"
                      checked={formData.nonveg}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span>Non-Vegetarian</span>
                  </label>
                  {formData.nonveg && (
                    <label className="block text-gray-700">
                      Other Dietary Requirements:
                      <textarea
                        type="text"
                        name="other"
                        placeholder="Please specify..."
                        value={formData.other}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Profile Image Upload */}
              <div className="mt-6 bg-gradient-to-tr from-green-100 to-green-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  Update Profile Image
                </h3>
                <input
                  type="file"
                  name="userimage"
                  accept="image/*"
                  onChange={changeuserimage}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 mb-4"
                />
                {(preview || userImage) && (
                  <img
                    src={preview || URL.createObjectURL(userImage)}
                    className="mt-4 w-32 h-32 rounded-full object-cover shadow-md"
                    alt="Preview"
                  />
                )}
              </div>

              {/* Save Changes Button */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap justify-center mt-8 space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
              <button
                onClick={toggleEditMode}
                className="w-full sm:w-auto bg-yellow-500 text-white font-semibold text-center py-3 px-6 rounded-md hover:bg-yellow-600 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <PencilIcon className="h-5 w-5" />
                <span>Edit Information</span>
              </button>
              <Link
                to="/changepassword"
                className="w-full sm:w-auto bg-pink-500 text-white font-semibold text-center py-3 px-6 rounded-md hover:bg-pink-600 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <span>Change Password</span>
              </Link>
              <div
                onClick={handleEventPhotos}
                className="w-full sm:w-auto bg-blue-500 text-white font-semibold text-center py-3 px-6 rounded-md hover:bg-blue-600 cursor-pointer flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span>Event Photos</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <AlertDialog
        open={alertDialogOpen}
        setOpen={setAlertDialogOpen}
        title={alertDialogTitle}
        description={alertDialogDescription}
      />
      <SuccessDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title="Details Updated"
        description="Your details have been updated successfully."
        onConfirm={() => {
          setIsModalOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
};

export default UserDashboardPage;
