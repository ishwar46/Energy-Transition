import Navbar from "../../components/Navbar";
import { useState } from "react";
import nationalities from "../../data/nationalities";
import titles from "../../data/titles";
import { registerUserApi } from "../../apis/Api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader";
import useDocumentTitle from "../../components/DocTitle";
import AlertDialog from "../../components/AlertDialog";
import SuccessDialog from "../../components/SuccessDialog";
import "react-datepicker/dist/react-datepicker.css";

const Registrations = () => {
  useDocumentTitle("Registration Form - International Youth Camp 2025");

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [highestEducationLevel, setHighestEducationLevel] = useState("");
  const [leoMultipleDistrictAndClubName, setLeoMultipleDistrictAndClubName] =
    useState("");
  const [positionInDistrict, setPositionInDistrict] = useState("");

  const [male, setMale] = useState(false);
  const [feMale, setFeMale] = useState(false);
  const [others, setOthers] = useState(false);

  const [occupation, setOccupation] = useState("");
  const [intlOccupationPassportNumber, setIntlOccupationPassportNumber] =
    useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [whyToAttend, setWhyToAttend] = useState("");
  const [uniqueness, setUniqueness] = useState("");
  const [achievementsTillNow, setAchievementsTillNow] = useState("");
  const [
    anySpecialSkillsOrQualifications,
    setAnySpecialSkillsOrQualifications,
  ] = useState("");
  const [socialMediaHandle, setSocialMediaHandle] = useState("");
  const [currentMentalAndPhysicalHealth, setCurrentMentalAndPhysicalHealth] =
    useState("");
  const [notableThingsToKnow, setNotableThingsToKnow] = useState("");
  const [emergencyContactNum, setEmergencyContactNum] = useState("");
  const [aggredToPayAmount, setAggredToPayAmount] = useState(false);
  const [aggredToBeBestBehaviour, setAggredToBeBestBehaviour] = useState(false);
  const [userimage, setUserImage] = useState(null);
  const [previrew, setPreview] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [checkedOption, setCheckedOption] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [nonveg, setNonveg] = useState(false);
  const [other, setOther] = useState("");

  useState(false);

  const navigate = useNavigate();
  //error
  const [emailAddressError, setEmailAddressError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  // Alert Dialog state
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogDescription, setAlertDialogDescription] = useState("");

  // Success Dialog state
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const changeOther = (event) => {
    setOther(event.target.value);
  };

  const changeTitle = (event) => {
    setTitle(event.target.value);
  };

  const changeFirstName = (event) => {
    const value = event.target.value;
    setFirstName(value);
    if (!value.trim()) {
      setFirstNameError("First name is required.");
    } else {
      setFirstNameError("");
    }
  };
  const changeMiddleName = (event) => {
    setMiddleName(event.target.value);
  };
  const changeLastName = (event) => {
    const value = event.target.value;
    setLastName(value);
    if (!value.trim()) {
      setLastNameError("Last name is required");
    } else {
      setLastNameError("");
    }
  };
  const changeNationality = (event) => {
    setNationality(event.target.value);
  };

  const changeEmailAddress = (event) => {
    const enteredEmail = event.target.value;
    setEmailAddress(enteredEmail);

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!enteredEmail.match(emailRegex)) {
      setEmailAddressError("Please enter a valid email address.");
    } else {
      setEmailAddressError("");
    }
  };

  //Current Address
  const changeCurrentAddress = (e) => {
    setCurrentAddress(e.target.value);
  };

  //Highest Education Level
  const changeHighestEducationLevel = (e) => {
    setHighestEducationLevel(e.target.value);
  };

  //What's App Number
  const changeWhatsAppNumber = (e) => {
    setWhatsAppNumber(e.target.value);
  };

  //Occupation
  const changeOccupation = (e) => {
    setOccupation(e.target.value);
  };

  //Leo Multiple District / Club Name
  const changeLeoMultipleDistrictAndClubName = (e) => {
    setLeoMultipleDistrictAndClubName(e.target.value);
  };

  //Position In District
  const changePositionInDistrict = (e) => {
    setPositionInDistrict(e.target.value);
  };

  //Intl Occupation Passport NUmber
  const changeIntlOccupationPassportNum = (e) => {
    setIntlOccupationPassportNumber(e.target.value);
  };

  //Any Skills or Qualifications
  const changeAnySpecialSkillsOrQualifications = (e) => {
    setAnySpecialSkillsOrQualifications(e.target.value);
  };

  //Why To Attend
  const changeWhyToAttend = (e) => {
    setWhyToAttend(e.target.value);
  };

  //Uniqueness
  const changeUniqueness = (e) => {
    setUniqueness(e.target.value);
  };

  //Achievement Till Now
  const changeAchievementsTillNow = (e) => {
    setAchievementsTillNow(e.target.value);
  };

  //Current Mental And Physical Health
  const changeCurrentMentalAndPhysicalHealth = (e) => {
    setCurrentMentalAndPhysicalHealth(e.target.value);
  };

  //Notable Things to Know
  const changeNotableThingsToKnow = (e) => {
    setNotableThingsToKnow(e.target.value);
  };

  //Social Media Handle
  const changeSocialMediaHandle = (e) => {
    setSocialMediaHandle(e.target.value);
  };

  //Emergency Contact Number
  const changeEmergencyContactNum = (e) => {
    setEmergencyContactNum(e.target.value);
  };

  //Gender Section #
  const handleGender = (role) => {
    setMale(role === "male");
    setFeMale(role === "feMale");
    setOthers(role === "others");
  };

  //Aggrred to Best Behaviour
  const changeAggredToBeBestBehaviour = (event) => {
    setAggredToBeBestBehaviour(event.target.checked);
  };

  //Aggreed To Pay Amount
  const changeAggredToPayAmount = (event) => {
    setAggredToPayAmount(event.target.checked);
  };

  //Date of Birth
  const handeldateChange = (e) => {
    // const formattedDate = date.toISOString().split("T")[0];
    // setDateOfBirth(formattedDate);
    // console.log(`Selected Data is  ${formattedDate}`);
    setDateOfBirth(e.target.value);
  };

  const changeuserimage = (e) => {
    const file = e.target.files[0];

    if (file && validateImage(file)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas dimensions to 800x800
          canvas.width = 800;
          canvas.height = 800;

          const aspectRatio = img.width / img.height;
          let drawWidth, drawHeight;

          if (aspectRatio > 1) {
            // Landscape image
            drawWidth = 800;
            drawHeight = 800 / aspectRatio;
          } else {
            // Portrait or square image
            drawHeight = 800;
            drawWidth = 800 * aspectRatio;
          }

          // Draw the resized image onto the canvas, centered
          ctx.drawImage(
            img,
            (800 - drawWidth) / 2,
            (800 - drawHeight) / 2,
            drawWidth,
            drawHeight
          );

          // Convert the canvas to a Blob
          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            // Update state with the resized file and preview
            setUserImage(resizedFile);
            setPreview(URL.createObjectURL(resizedFile));
            toast.success("Image successfully resized to 800x800 pixels.");
          }, file.type);
        };
      };

      reader.readAsDataURL(file); // Read the image file as a data URL
    } else {
      e.target.value = null;
      setUserImage(null);
      setPreview(null);
    }
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

    return true; // No dimension check here
  };

  // ======= Submit Button Function ========
  const handelSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const validateForm = () => {
      const validations = [
        {
          condition: !nationality,
          message: "Please select your nationality.",
        },
        { condition: !title, message: "Please select your preferred title." },
        { condition: !firstName.trim(), message: "First name is required." },
        { condition: !lastName.trim(), message: "Last name is required." },
        {
          condition: !currentAddress.trim(),
          message: "Current Address is required.",
        },
        {
          condition: !highestEducationLevel.trim(),
          message: "Highest Education Level is required.",
        },
        {
          condition: !whatsAppNumber.trim(),
          message: "What's App Number is required.",
        },
        { condition: !occupation.trim(), message: "Occupation is required." },
        // {
        //   condition: !vegetarian && !nonveg && !other,
        //   message: "Please select at least one dietary requirement.",
        // },
        {
          condition: !anySpecialSkillsOrQualifications.trim(),
          message: "All Quesiton is required.",
        },
        {
          condition: !whyToAttend.trim(),
          message: "All Quesiton is required.",
        },
        { condition: !uniqueness.trim(), message: "All Quesiton is required." },
        {
          condition: !achievementsTillNow.trim(),
          message: "All Quesiton is required.",
        },
        {
          condition: !currentMentalAndPhysicalHealth.trim(),
          message: "All Quesiton is required.",
        },
        // {
        //   condition: !notableThingsToKnow.trim(),
        //   message: "All Quesiton is required.",
        // },
        {
          condition: !socialMediaHandle.trim(),
          message: "Social Media Handle is required.",
        },
        {
          condition: !emergencyContactNum.trim(),
          message: "Emergency Contact Num is required.",
        },
        // { condition: !dateOfBirth.trim(), message: "Date of Birth required." },

        {
          condition: !emailAddress.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
          message: "Email address is required.",
        },

        {
          condition: !userimage,
          message: "Please upload your photo to proceed.",
        },
      ];

      for (let { condition, message } of validations) {
        if (condition) {
          toast.error(message);
          setLoading(false);
          return false;
        }
      }

      return true;
    };

    if (!validateForm()) {
      return;
    }

    const fd = new FormData();

    fd.append("firstName", firstName);
    fd.append("title", title);
    fd.append("middleName", middleName);
    fd.append("lastName", lastName);
    fd.append("nationality", nationality);
    fd.append("emailAddress", emailAddress);

    fd.append("currentAddress", currentAddress);
    fd.append("highestEducationLevel", highestEducationLevel);
    fd.append("whatsAppNumber", whatsAppNumber);
    fd.append("occupation", occupation);
    fd.append("leoMultipleDistrictAndClubName", leoMultipleDistrictAndClubName);
    fd.append("positionInDistrict", positionInDistrict);
    fd.append("intlOccupationPassportNumber", intlOccupationPassportNumber);
    fd.append(
      "anySpecialSkillsOrQualifications",
      anySpecialSkillsOrQualifications
    );
    fd.append("whyToAttend", whyToAttend);
    fd.append("uniqueness", uniqueness);
    fd.append("achievementsTillNow", achievementsTillNow);
    fd.append("currentMentalAndPhysicalHealth", currentMentalAndPhysicalHealth);
    fd.append("notableThingsToKnow", notableThingsToKnow);
    fd.append("socialMediaHandle", socialMediaHandle);
    fd.append("emergencyContactNum", emergencyContactNum);
    fd.append("dateOfBirth", dateOfBirth);
    fd.append("male", male);
    fd.append("feMale", feMale);
    fd.append("others", others);

    fd.append("userimage", userimage);
    fd.append("aggredToBeBestBehaviour", aggredToBeBestBehaviour);

    fd.append("vegetarian", vegetarian);
    fd.append("nonveg", nonveg);
    fd.append("other", other);

    if (!aggredToPayAmount) {
      setLoading(false);
      toast.error(" Please read and agree to pay the Amount.");
      return;
    }

    if (!aggredToBeBestBehaviour) {
      setLoading(false);
      toast.error("You must agree to be on best Behaviour.");
      return;
    }

    registerUserApi(fd)
      .then((res) => {
        setLoading(false);
        if (!res.data.success) {
          setAlertDialogTitle("Registration Failed");
          setAlertDialogDescription(res.data.message);
          setAlertDialogOpen(true);
        } else {
          setSuccessDialogOpen(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 413) {
          toast.error(
            "File size is too large. Please ensure your images are under the allowed limit and Try"
          );
        } else {
          setAlertDialogTitle("Registration Error");
          setAlertDialogDescription(
            err.response && err.response.data && err.response.data.message
              ? err.response.data.message
              : "Something went wrong! Please contact us at secretariat@dcgf.gov.np"
          );
          setAlertDialogOpen(true);
        }
      });
  };

  return (
    <>
      <Navbar />
      <div className="RegistationForm container px-5 mx-auto mt-5 mb-5  rounded overflow-hidden shadow-lg">
        <div
          className="text-3xl font-bold text-blue-800 pt-5 text-center mb-5"
          style={{ animation: "fadeIn 1s ease-out" }}
        >
          Registration Form
        </div>
        <div
          className="text-1xl font-semibold text-green-800 text-center mb-10"
          style={{ animation: "fadeIn 2s ease-out" }}
        >
          Welcome to the Energy Transition for Resilient and Low Carbon Economy
          Summit.
        </div>

        <form className="px-6 py-2">
          {/* Personal Information Section */}
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {" "}
            Personal Information
          </h2>
          <div className="pt-5">
            {/* nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality: <span className="text-red-500">*</span>
              </label>
              <select
                name="nationality"
                value={nationality}
                onChange={changeNationality}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 mb-2"
              >
                <option className="flex gap-2" value="">
                  Choose your nationality
                </option>
                {nationalities.map((nation) => (
                  <option key={nation.code} value={nation.name}>
                    <img src={nation.flag} className="h-5" alt="flag" />{" "}
                    {nation.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-3  gap-6 pt-5">
            {/* title */}
            <div>
              <select
                name="title"
                value={title}
                onChange={changeTitle}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              >
                <option value="">
                  Choose your preferred title{" "}
                  <span className="text-red-500">*</span>
                </option>
                {titles.map((title, index) => (
                  <option key={index} value={title.value}>
                    {title.label}
                  </option>
                ))}
              </select>
            </div>
            {/* firstName, middleName , lastName */}
            <div className="mb-2">
              <input
                type="text"
                name="firstName"
                placeholder="Enter First name *"
                value={firstName}
                onChange={changeFirstName}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
              {firstNameError && (
                <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
              )}
            </div>
            <div className="mb-2">
              <input
                type="text"
                name="middleName"
                placeholder="Enter Middle name"
                value={middleName}
                onChange={changeMiddleName}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                name="lastName"
                placeholder="Enter Last name *"
                value={lastName}
                onChange={changeLastName}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
              {lastNameError && (
                <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
              )}
            </div>

            {/* email,address */}
            <input
              type="text"
              name="currentAddress"
              placeholder="Current Address"
              value={currentAddress}
              onChange={changeCurrentAddress}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
            <input
              type="text"
              name="highestEducationLevel"
              placeholder="Highest Education Qualification"
              value={highestEducationLevel}
              onChange={changeHighestEducationLevel}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={emailAddress}
                onChange={changeEmailAddress}
                placeholder="Enter your e-mail address *"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
              {emailAddressError && (
                <p className="text-red-500 text-sm mt-1">{emailAddressError}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="whatsAppNumber"
                placeholder="What's App number *"
                value={whatsAppNumber}
                onChange={changeWhatsAppNumber}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
              {/* {contactNumberError && (
                <p className="text-red-500 text-sm mt-1">
                  {contactNumberError}
                </p>
              )} */}
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="occupation"
                placeholder="Occupation/Field of Study"
                value={occupation}
                onChange={changeOccupation}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="leoMultipleDistrictAndClubName"
                placeholder="Leo Multiple, District and Club Name"
                value={leoMultipleDistrictAndClubName}
                onChange={changeLeoMultipleDistrictAndClubName}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="positionInDistrict"
                placeholder="Position in your District/Club"
                value={positionInDistrict}
                onChange={changePositionInDistrict}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="intlOccupationPassportNumber"
                placeholder="(For International Applicants) Passport Number"
                value={intlOccupationPassportNumber}
                onChange={changeIntlOccupationPassportNum}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
            </div>
          </div>

          <div className="flex gap-3 items-center mt-4">
            <span className="text-black">Date of Birth: </span>
            <div className="relative">
              {/* <DatePicker
                placeholderText="Select Date"
                selected={dateOfBirth}
                onChange={handeldateChange}
                className="block w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
              />
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" /> */}
              <input
                type="date"
                name="intlOccupationPassportNumber"
                placeholder="Enter date of Birth"
                value={dateOfBirth}
                onChange={handeldateChange}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-700 mt-8"> Gender</h2>

          {/* Are You Male or Female */}
          <div className="flex justify-start gap-5 items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={male}
                onChange={() => handleGender("male")}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-gray-700">Male</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={feMale}
                onChange={() => handleGender("feMale")}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-gray-700">Female</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={others}
                onChange={() => handleGender("others")}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-gray-700">Others</label>
            </div>
          </div>

          {/* Dietry Requirement */}
          <div className="mt-5">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Dietary Requirements <span className="text-red-500">*</span>
            </h2>
            <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
              <div className="flex items-center mb-4">
                <input
                  id="vegetarian-checkbox"
                  type="checkbox"
                  name="dietaryRequirement"
                  value="vegetarian"
                  checked={vegetarian === "true"}
                  onChange={() => {
                    setVegetarian("true");
                    setNonveg(false);
                    setCheckedOption("");
                    setShowOtherInput(false);
                    setOther("");
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="vegetarian-checkbox"
                  className="ms-2 font-medium text-gray-900"
                >
                  Vegetarian
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="nonveg-checkbox"
                  type="checkbox"
                  name="dietaryRequirement"
                  checked={nonveg}
                  onChange={() => {
                    setVegetarian(false);
                    setNonveg(true);
                    setCheckedOption("");
                    setShowOtherInput(false);
                    setOther("");
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="nonveg-checkbox"
                  className="ml-2 font-medium text-gray-900"
                >
                  Non-Vegetarian
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="other-checkbox"
                  type="checkbox"
                  name="dietaryRequirement"
                  value="other"
                  checked={checkedOption === "other"}
                  onChange={() => {
                    setVegetarian("false");
                    setNonveg(false);
                    setCheckedOption("other");
                    setShowOtherInput(true);
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="other-checkbox"
                  className="ms-2 font-medium text-gray-900"
                >
                  Other
                </label>
              </div>
              {showOtherInput && (
                <input
                  type="text"
                  name="other"
                  placeholder="Please Specify"
                  value={other}
                  onChange={changeOther}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              )}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-700 mt-8">
            {" "}
            Some Questions
          </h2>

          <div className="text-black w-full mt-4">
            <span>
              Do you possess any special skills or qualifications that make you
              a strong candidate for this Youth Camp?
            </span>
            <textarea
              name="uniqueReason"
              placeholder="Enter your response *"
              value={anySpecialSkillsOrQualifications}
              onChange={changeAnySpecialSkillsOrQualifications}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              rows="5"
              style={{ height: "90px" }}
            />
          </div>
          <div className="text-black w-full mt-4">
            <span>
              Why do you wish to attend this program? Have you participated in
              similar camps or events?
            </span>
            <textarea
              name="programReason"
              placeholder="Enter your response *"
              value={whyToAttend}
              onChange={changeWhyToAttend}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              rows="5"
              style={{ height: "90px" }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
            <div className="text-black w-full md:w-1/2">
              <span>What makes you unique as a participant?</span>
              <textarea
                name="uniqueReason"
                placeholder="Enter your response *"
                value={uniqueness}
                onChange={changeUniqueness}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                rows="5"
                style={{ height: "120px" }}
              />
            </div>
            <div className="text-black w-full md:w-1/2">
              <span>Describe your significant achievements to date:</span>
              <textarea
                name="programReason"
                placeholder="Enter your response *"
                value={achievementsTillNow}
                onChange={changeAchievementsTillNow}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                rows="5"
                style={{ height: "120px" }}
              />
            </div>
          </div>

          <div className="text-black w-full mt-8">
            <span>
              Describe your current mental and physical health. Please mention
              if you have any allergies or long-term medical conditions.
            </span>
            <textarea
              name="uniqueReason"
              placeholder="Enter your response *"
              value={currentMentalAndPhysicalHealth}
              onChange={changeCurrentMentalAndPhysicalHealth}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              rows="5"
              style={{ height: "90px" }}
            />
          </div>
          <div className="text-black w-full mt-4">
            <span>
              Is there any additional information about you that we should know?
            </span>
            <textarea
              name="programReason"
              placeholder="Enter your response"
              value={notableThingsToKnow}
              onChange={changeNotableThingsToKnow}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              rows="5"
              style={{ height: "90px" }}
            />
          </div>

          <div className="mt-8">
            {/* Profile Picture Upload Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Upload Photo <span className="text-red-500">*</span>
              </h2>
              <p className="text-md text-red-600">
                Please upload your photo for registration.
              </p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload photo:
                </label>
                <input
                  type="file"
                  name="userimage"
                  onChange={changeuserimage}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                />

                {(previrew || userimage) && (
                  <img
                    src={previrew || userimage}
                    className="w-[100px] h-[100px] rounded-full "
                    alt="user"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 mb-4">
            <span className="text-black text-xs md:text-base">
              Social Media Handle (Instagram, etc.): (Ensure your account is
              public for verification purposes) *
            </span>
            <input
              type="text"
              name="socialMediaHandle"
              placeholder="Social Media Handle"
              value={socialMediaHandle}
              onChange={changeSocialMediaHandle}
              className="w-1/2 h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-red-800">Emergency Contact Number *</span>
            <input
              type="text"
              name="emergencyContactNum"
              placeholder="Emergency Contact Number"
              value={emergencyContactNum}
              onChange={changeEmergencyContactNum}
              className="w-1/2 h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>

          <div className="mt-8">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="aggredToPayAmount"
                checked={aggredToPayAmount}
                onChange={changeAggredToPayAmount}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label htmlFor="aggredToPayAmount" className="ml-2 text-gray-700">
                I understand that if selected, I must pay the registration fee
                within 72 hours of receiving the acceptance email. Failure to do
                so will result in forfeiture of my seat.
              </label>
            </div>
          </div>
          <div className="mt-8">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="aggredToBeBestBehaviour"
                checked={aggredToBeBestBehaviour}
                onChange={changeAggredToBeBestBehaviour}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label
                htmlFor="aggredToBeBestBehaviour"
                className="ml-2 text-gray-700"
              >
                I agree to adhere to all camp rules and regulations and commit
                to displaying exemplary behavior during the program.
              </label>
            </div>
          </div>
          <div className="mt-8">
            <div className="mb-4">
              <p className="text-md text-green-500">
                Note: Fields with <span className="text-red-500">*</span> are
                mandatory.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10 mb-10">
            <button
              onClick={handelSubmit}
              type="submit"
              className="bg-blue-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader />
                  <span className="ml-2">Submitting...</span>{" "}
                </div>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
      <AlertDialog
        open={alertDialogOpen}
        setOpen={setAlertDialogOpen}
        title={alertDialogTitle}
        description={alertDialogDescription}
      />
      <SuccessDialog
        open={successDialogOpen}
        setOpen={setSuccessDialogOpen}
        title="Application Submitted Successfully! 📝✅"
        description="Thank you for submitting your application. We will review your details and provide you with a confirmation email within the next 24 hours. If you have any questions in the meantime, feel free to reach out to us. We appreciate your interest and look forward to connecting with you soon!"
        onConfirm={() => navigate("/homepage")}
      />
    </>
  );
};

export default Registrations;
