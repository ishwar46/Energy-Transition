import React, { useState, useEffect } from "react";
import { getUserByIdApi, updateUserApi } from "../apis/Api";
import toast from "react-hot-toast";

const EditUserModal = ({ isOpen, onClose, userId, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    personalInformation: {
      title: "",
      fullName: {
        firstName: "",
        middleName: "",
        lastName: "",
      },
      dietaryRequirements: {
        vegetarian: false,
        nonveg: false,
        other: "",
      },
      gender: {
        male: false,
        feMale: false,
        others: "",
      },
      nationality: "",
      dateOfBirth: "",
      currentAddress: "",
      highestEducationLevel: "",
      leoMultipleDistrictAndClubName: "",
      positionInDistrict: "",
      occupation: "",
      intlOccupationPassportNumber: "",
      whatsAppNumber: "",
      emergencyContactNum: "",
      emailAddress: "",
      phoneNumber: "",
      mobileNumber: "",
    },
    profilePicture: {
      fileName: "",
    },
    biography: "",
    accompanyingPerson: {
      hasAccompanyingPerson: false,
      accompanyingPersonInformation: {
        title: "",
        fullName: {
          firstName: "",
          middleName: "",
          lastName: "",
        },
        relationship: "",
        dietaryRequirements: {
          vegetarian: false,
          nonveg: false,
          other: "",
        },
        pictureUrl: "",
      },
    },
    chiefDelegateOrSpeaker: {
      chiefDelegate: false,
      participant: false,
    },
    mobileSimCardRequirements: {
      takeSim: false,
      simType: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUser();
    }
  }, [isOpen, userId]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await getUserByIdApi(userId);
      if (response && response.data) {
        setFormData((prevData) => ({
          ...prevData,
          ...response.data,
          personalInformation: {
            ...prevData.personalInformation,
            ...response.data.personalInformation,
            dietaryRequirements: {
              ...prevData.personalInformation.dietaryRequirements,
              ...response.data.personalInformation?.dietaryRequirements,
            },
          },
          accompanyingPerson: {
            ...prevData.accompanyingPerson,
            ...response.data.accompanyingPerson,
            accompanyingPersonInformation: {
              ...prevData.accompanyingPerson.accompanyingPersonInformation,
              ...response.data.accompanyingPerson
                ?.accompanyingPersonInformation,
            },
          },
        }));
      } else {
        toast.error("Failed to fetch user data.");
      }
    } catch (error) {
      toast.error(`Error fetching user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const valueToUse = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      personalInformation: {
        ...prevData.personalInformation,
        [name]: valueToUse,
      },
    }));
  };

  const handleFullNameChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      personalInformation: {
        ...prevData.personalInformation,
        fullName: {
          ...prevData.personalInformation.fullName,
          [name]: value,
        },
      },
    }));
  };

  const handleDietaryChange = (e) => {
    const { name, value, checked } = e.target;

    setFormData((prevData) => {
      if (name === "other") {
        return {
          ...prevData,
          personalInformation: {
            ...prevData.personalInformation,
            dietaryRequirements: {
              vegetarian: false,
              nonveg: false,
              other: value,
            },
          },
        };
      } else {
        return {
          ...prevData,
          personalInformation: {
            ...prevData.personalInformation,
            dietaryRequirements: {
              ...prevData.personalInformation.dietaryRequirements,
              [name]: checked,
              other: "",
            },
          },
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateUserApi(userId, formData);
      if (response && response.data) {
        toast.success("User updated successfully!");
        onUserUpdated && onUserUpdated(response.data);
        onClose();
      } else {
        toast.error("Failed to update user.");
      }
    } catch (error) {
      toast.error(`Error updating user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-5xl mx-4 overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-md font-semibold text-gray-900">
            Edit Participant Details
          </h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 text-2xl font-bold"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.personalInformation.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.personalInformation.fullName.firstName}
                    onChange={handleFullNameChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.personalInformation.fullName.middleName}
                    onChange={handleFullNameChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.personalInformation.fullName.lastName}
                    onChange={handleFullNameChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.personalInformation.nationality}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={formData.personalInformation.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Current Address
                  </label>
                  <input
                    type="text"
                    name="currentAddress"
                    value={formData.personalInformation.currentAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Highest Education Level
                  </label>
                  <input
                    type="text"
                    name="highestEducationLevel"
                    value={formData.personalInformation.highestEducationLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.personalInformation.emailAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.personalInformation.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    name="whatsAppNumber"
                    value={formData.personalInformation.whatsAppNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Emergency Contact Number
                  </label>
                  <input
                    type="text"
                    name="emergencyContactNum"
                    value={formData.personalInformation.emergencyContactNum}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.personalInformation.occupation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Position in District
                  </label>
                  <input
                    type="text"
                    name="positionInDistrict"
                    value={formData.personalInformation.positionInDistrict}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Dietary Requirements
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="vegetarian"
                      checked={
                        formData.personalInformation.dietaryRequirements
                          .vegetarian
                      }
                      onChange={handleDietaryChange}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Vegetarian</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="nonveg"
                      checked={
                        formData.personalInformation.dietaryRequirements.nonveg
                      }
                      onChange={handleDietaryChange}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Non-Veg</label>
                  </div>

                  <div className="flex items-center">
                    <label className="text-sm text-gray-700 mr-2">Other:</label>
                    <input
                      type="text"
                      name="other"
                      value={
                        formData.personalInformation.dietaryRequirements.other
                      }
                      onChange={handleDietaryChange}
                      className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900"
                      placeholder="Specify..."
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
