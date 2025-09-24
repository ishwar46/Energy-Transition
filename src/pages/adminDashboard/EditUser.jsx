import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserByIdApi, updateUserApi } from "../../apis/Api";
import toast from "react-hot-toast";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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

  // const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
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
          // setPreview(
          //   `https://api-energy.onrender.com/${response.data.profilePicture.fileName}`
          // );
        } else {
          toast.error("Failed to fetch user data.");
        }
      } catch (error) {
        toast.error(`Error fetching user: ${error.message}`);
      }
    };

    fetchUser();
  }, [userId]);

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
              vegetarian: false, // Reset other dietary options
              nonveg: false,
              other: value, // Set the "other" text value
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
              [name]: checked, // Update the checkbox value
              other: "", // Reset the "other" field if any checkbox is selected
            },
          },
        };
      }
    });
  };

  // const handleGenderChange = (e) => {
  //   const { name, value, checked } = e.target;
  //   setFormData((prevData) => {
  //     if (name === "others") {
  //       return {
  //         ...prevData, personalInformation: {
  //           ...prevData.personalInformation,
  //           gender: {
  //             male: false,
  //             feMale: false,
  //             others: value
  //           },
  //         }
  //       }
  //     } else {
  //       return {
  //         ...prevData,
  //         personalInformation: {
  //           ...prevData.personalInformation,
  //           gender: {
  //             ...prevData.personalInformation.gender,
  //             [name]: checked,
  //             others: ""
  //           },
  //         }
  //       }
  //     }
  //   })
  // }

  // const handleProfilePictureChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       profilePicture: { fileName: file.name },
  //     }));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserApi(userId, formData);
      if (response && response.data) {
        toast.success("User updated successfully!");
        navigate("/admindashboard");
      } else {
        toast.error("Failed to update user.");
      }
    } catch (error) {
      toast.error(`Error updating user: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="container mx-auto p-6 max-w-4xl">
        <h2 className="text-3xl font-semibold bg-green-600 mb-8 text-center rounded-lg">
          Edit Participant Details
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white text-blue-600 p-8 rounded-lg shadow-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-600">Title</label>
              <input
                type="text"
                name="title"
                value={formData.personalInformation.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.personalInformation.fullName.firstName}
                onChange={handleFullNameChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.personalInformation.fullName.middleName}
                onChange={handleFullNameChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-600">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.personalInformation.fullName.lastName}
                onChange={handleFullNameChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.personalInformation.nationality}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">Date of Birth</label>
              <input
                type="text"
                name="dateOfBirth"
                value={formData.personalInformation.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-600">Current Address</label>
              <input
                type="text"
                name="currentAddress"
                value={formData.personalInformation.currentAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">
                Highest Education Level
              </label>
              <input
                type="text"
                name="highestEducationLevel"
                value={formData.personalInformation.highestEducationLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">Email Address</label>
              <input
                type="email"
                name="emailAddress"
                value={formData.personalInformation.emailAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-600">
                Leo Multiple District And ClubName
              </label>
              <input
                type="text"
                name="leoMultipleDistrictAndClubName"
                value={
                  formData.personalInformation.leoMultipleDistrictAndClubName
                }
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">
                Position in District
              </label>
              <input
                type="text"
                name="positionInDistrict"
                value={formData.personalInformation.positionInDistrict}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {/* <div>
              <label className="block text-gray-600">Profile Picture</label>
              <input
                type="file"
                onChange={handleProfilePictureChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="mt-4 w-24 h-24 object-cover rounded-full border-2 border-green-500"
                />
              ) : (
                formData.profilePicture.fileName && (
                  <img
                    src={`https://api-energy.onrender.com/${formData.profilePicture.fileName}`}
                    alt="Profile"
                    className="mt-4 w-24 h-24 object-cover rounded-full border-2 border-green-500"
                  />
                )
              )}
            </div> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-600">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.personalInformation.occupation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">
                Intl Occupation Passport Num
              </label>
              <input
                type="text"
                name="intlOccupationPassportNumber"
                value={
                  formData.personalInformation.intlOccupationPassportNumber
                }
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600">What's App Num</label>
              <input
                type="text"
                name="whatsAppNumber"
                value={formData.personalInformation.whatsAppNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-600">
                Emergency Contact Num
              </label>
              <input
                type="text"
                name="emergencyContactNum"
                value={formData.personalInformation.emergencyContactNum}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-600">Dietary Requirements</label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="vegetarian"
                checked={
                  formData.personalInformation.dietaryRequirements.vegetarian
                }
                onChange={handleDietaryChange}
              />
              <label className="text-gray-700 mr-4 ml-2">Vegetarian</label>

              <input
                type="checkbox"
                name="nonveg"
                checked={
                  formData.personalInformation.dietaryRequirements.nonveg
                }
                onChange={handleDietaryChange}
              />
              <label className="text-gray-700 mr-4 ml-2">Non-Veg</label>

              <div className="flex flex-row items-center">
                <label className="text-gray-700 mr-4 ml-2">Other</label>
                <input
                  className="w-full px-4 py-2 mt-2 border-black rounded-lg focus:ring-2 focus:ring-black"
                  type="text"
                  name="other"
                  value={formData.personalInformation.dietaryRequirements.other}
                  onChange={handleDietaryChange}
                />
              </div>
            </div>
          </div>
          {/* <div className="mb-6">
            <label className="block text-gray-600">Gender</label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="male"
                checked={formData.personalInformation.gender.male}
                onChange={handleGenderChange}
              />
              <label className="text-gray-700 mr-4 ml-2">Male</label>

              <input
                type="checkbox"
                name="feMale"
                checked={formData.personalInformation.gender.feMale}
                onChange={handleGenderChange}
              />
              <label className="text-gray-700 mr-4 ml-2">FeMale</label>

              <div className="flex flex-row items-center">
                <label className="text-gray-700 mr-4">Others</label>
                <input
                  className="w-full px-4 py-2 mt-2 border-black rounded-lg focus:ring-2 focus:ring-black"
                  type="text"
                  name="others"
                  // value={formData.personalInformation.gender.others}
                  value={formData.personalInformation.gender.others === false ? "" : formData.personalInformation.gender.others}
                  onChange={handleGenderChange}
                />
              </div>
            </div>
          </div> */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
