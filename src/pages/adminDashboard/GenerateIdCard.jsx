import React, { useState, useRef, useEffect } from "react";
import nationalities from "../../data/nationalities";
import titles from "../../data/titles";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";
import {
  getOnSiteRegister,
  onSiteRegister,
  deleteOnSiteRegister,
} from "../../apis/Api";
import toast from "react-hot-toast";
import useDocumentTitle from "../../components/DocTitle";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import QRCode from "qrcode.react";
import Modal from "react-modal";

// Styles for the modal
const customStyles = {
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "10px",
    border: "5px dotted green",
    backgroundColor: "#fff",
  },
};

const GenerateIdCard = () => {
  useDocumentTitle("Generate ID Card - Uranus Event Management");

  // -----------------------------------------------------------------
  // 1. States for "Generate ID Card for Existing Users" via Email
  // -----------------------------------------------------------------
  const [searchedEmail, setSearchedEmail] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // -----------------------------------------------------------------
  // 2. States for Manual Registration
  // -----------------------------------------------------------------
  const [institution, setInstitution] = useState("");
  const [title, setTitle] = useState("");
  const [fullName, setFullName] = useState("");
  const [nationality, setNationality] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [onSiteRegisterImage, setOnSiteRegisterImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Validation errors
  const [firstNameError, setFirstNameError] = useState("");
  const [emailAddressError, setEmailAddressError] = useState("");
  const [institutionError, setInstitutionError] = useState("");

  // -----------------------------------------------------------------
  // 3. States & Effects for Listing / Deleting Users
  // -----------------------------------------------------------------
  const [allOnSiteRegisteredUsers, setAllOnSiteRegisteredUsers] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  // Modal (for QR code preview)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [qrUserId, setQrUserId] = useState(null);
  const [qrUserName, setQrUserName] = useState("");

  const idCardRef = useRef();

  // -----------------------------------------------------------------
  // 4. Fetch all on-site-registered users
  // -----------------------------------------------------------------
  const fetchAllOnSiteRegisteredUsers = async () => {
    try {
      const res = await getOnSiteRegister();
      if (res.status === 200 || res.status === 201) {
        setAllOnSiteRegisteredUsers(res.data.onSiteRegisterData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllOnSiteRegisteredUsers();
  }, []);

  // -----------------------------------------------------------------
  // 5. Search by email for existing user ID card generation
  // -----------------------------------------------------------------
  const handleSearchByEmail = (e) => {
    const typedEmail = e.target.value.trim().toLowerCase();
    setSearchedEmail(typedEmail);
    setLoadingUsers(true);

    // Clear displayed user if email is empty
    if (!typedEmail) {
      setUserDetails(null);
      setLoadingUsers(false);
      return;
    }

    // Find matching user
    const foundUser = allOnSiteRegisteredUsers.find(
      (user) => user.email.toLowerCase() === typedEmail
    );

    setUserDetails(foundUser || null);
    setLoadingUsers(false);
  };

  // -----------------------------------------------------------------
  // 6. Generate & Download ID card
  // -----------------------------------------------------------------
  const handleDownloadIdCard = async () => {
    if (!idCardRef.current) return;

    const canvas = await html2canvas(idCardRef.current, {
      scale: 2,
      allowTaint: true,
      useCORS: true,
    });
    const imageData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imageData;
    link.download = `${userDetails?.fullName || "ID_Card"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -----------------------------------------------------------------
  // 7. Registration form validation & submission
  // -----------------------------------------------------------------
  const validateForm = () => {
    let valid = true;

    // Make sure institution isn’t empty
    if (!institution.trim()) {
      setInstitutionError("Please enter your institution name.");
      valid = false;
    } else {
      setInstitutionError("");
    }

    if (!title) {
      toast.error("Please select your preferred title.");
      valid = false;
    }

    if (!fullName.trim()) {
      setFirstNameError("Full name is required.");
      valid = false;
    } else {
      setFirstNameError("");
    }

    // Basic email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailAddressError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailAddressError("");
    }

    return valid;
  };

  const handleUserRegistration = (e) => {
    e.preventDefault();
    setLoadingUsers(true);

    if (!validateForm()) {
      setLoadingUsers(false);
      return;
    }

    const fd = new FormData();
    fd.append("institution", institution);
    fd.append("nationality", nationality);
    fd.append("title", title);
    fd.append("fullName", fullName);
    fd.append("jobPosition", jobPosition);
    fd.append("officeAddress", officeAddress);
    fd.append("email", email);
    fd.append("phoneNumber", phoneNumber);
    fd.append("onSiteRegisterImage", onSiteRegisterImage);

    onSiteRegister(fd)
      .then((res) => {
        if (res.data.success) {
          toast.success("User registered successfully!");
          setUserDetails(res.data.onSiteData);

          // Reset form
          setInstitution("");
          setNationality("");
          setTitle("");
          setFullName("");
          setJobPosition("");
          setOfficeAddress("");
          setEmail("");
          setPhoneNumber("");
          setOnSiteRegisterImage(null);
          setPreview(null);

          // Refresh user list
          fetchAllOnSiteRegisteredUsers();
        } else {
          toast.error("Registration failed.");
        }
        setLoadingUsers(false);
      })
      .catch((err) => {
        toast.error("An error occurred during registration.");
        setLoadingUsers(false);
      });
  };

  // -----------------------------------------------------------------
  // 8. Handle image upload (with resizing to 800x800)
  // -----------------------------------------------------------------
  const changeuserimage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = 800;
          canvas.height = 800;

          const aspectRatio = img.width / img.height;
          let drawWidth, drawHeight;

          if (aspectRatio > 1) {
            // wider than tall
            drawWidth = 800;
            drawHeight = 800 / aspectRatio;
          } else {
            // taller than wide or square
            drawHeight = 800;
            drawWidth = 800 * aspectRatio;
          }

          ctx.drawImage(
            img,
            (800 - drawWidth) / 2,
            (800 - drawHeight) / 2,
            drawWidth,
            drawHeight
          );

          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              setOnSiteRegisterImage(resizedFile);
              setPreview(URL.createObjectURL(resizedFile));
              toast.success("Image successfully resized to 800x800 pixels.");
            } else {
              toast.error("Image resizing failed.");
            }
          }, file.type);
        };
      };

      reader.readAsDataURL(file);
    } else {
      e.target.value = null;
      setOnSiteRegisterImage(null);
      setPreview(null);
    }
  };

  // -----------------------------------------------------------------
  // 9. Table Search & Pagination
  // -----------------------------------------------------------------
  const filteredUsers = allOnSiteRegisteredUsers.filter((user) => {
    const matchesSearch =
      user?.fullName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesSearch;
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // -----------------------------------------------------------------
  // 10. Delete user
  // -----------------------------------------------------------------
  const handleDelete = async (id) => {
    try {
      const res = await deleteOnSiteRegister(id);
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message);
        fetchAllOnSiteRegisteredUsers();
      }
    } catch (error) {
      console.error("Error Deleting User:", error);
    }
  };

  // -----------------------------------------------------------------
  // 11. Modal for QR Code (table actions)
  // -----------------------------------------------------------------
  const openModal = (userId, fullName) => {
    setQrUserId(userId);
    setQrUserName(fullName);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setQrUserId(null);
    setQrUserName("");
  };

  // -----------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------
  return (
    <>
      <div className="text-2xl font-bold text-start mb-4 text-black pt-5">
        Generate ID Card
      </div>

      <div className="mt-5">
        {/* ------------------------------------------------------------------
            Section 1: Generate ID Card for Existing Users (By Email)
            ------------------------------------------------------------------ */}
        <div className="p-5 border border-gray-200 rounded-md bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Generate ID Card for Existing Users
          </h2>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Enter Email Address
            </label>
            <input
              type="text"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
              placeholder="e.g. coolname@domain.com"
              value={searchedEmail}
              onChange={handleSearchByEmail}
            />
            {loadingUsers && (
              <p className="text-sm text-gray-500 mt-1">Searching...</p>
            )}
          </div>

          {/* If user found, show ID card preview */}
          {userDetails ? (
            <>
              <div
                ref={idCardRef}
                className="p-4 shadow-lg border text-indigo-700"
                style={{
                  width: "302px",
                  height: "236px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div className="flex flex-col items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-900 text-center uppercase">
                    {userDetails.fullName}
                  </h2>
                  <p className="text-xs text-gray-700 text-center uppercase">
                    {userDetails.institution}
                  </p>
                </div>
                <div className="flex flex-col items-center mt-4">
                  <QRCodeSVG value={userDetails._id} size={80} level="Q" />
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleDownloadIdCard}
                  className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Download
                </button>
              </div>
            </>
          ) : (
            // Only show "No user found" if an email was typed and loading is done
            searchedEmail !== "" &&
            !loadingUsers && (
              <p className="text-red-500 text-sm">
                No user found with that email.
              </p>
            )
          )}
        </div>

        {/* ------------------------------------------------------------------
            Section 2: Register a New Participant
            ------------------------------------------------------------------ */}
        <div className="p-5 border border-gray-200 rounded-md bg-white shadow-sm mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Register a New Participant
          </h2>

          <form onSubmit={handleUserRegistration}>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Institution Name (Text Field) */}
              <div className="institution">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Enter your institution name"
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 mb-2"
                />
                {institutionError && (
                  <p className="text-red-500 text-sm mt-1">
                    {institutionError}
                  </p>
                )}
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality: <span className="text-red-500">*</span>
                </label>
                <select
                  name="nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 mb-2"
                >
                  <option value="">Choose your nationality</option>
                  {nationalities.map((nation) => (
                    <option key={nation.code} value={nation.name}>
                      {nation.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mt-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title: <span className="text-red-500">*</span>
                </label>
                <select
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                >
                  <option value="">Choose your title</option>
                  {titles.map((ttl, index) => (
                    <option key={index} value={ttl.value}>
                      {ttl.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
                {firstNameError && (
                  <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
                )}
              </div>

              {/* Job Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Position:
                </label>
                <input
                  type="text"
                  name="jobPosition"
                  placeholder="Job position"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>

              {/* Office Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office Address:
                </label>
                <input
                  type="text"
                  name="officeAddress"
                  placeholder="Office address"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address: <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your e-mail address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
                {emailAddressError && (
                  <p className="text-red-500 text-sm mt-1">
                    {emailAddressError}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number:
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Contact number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
              </div>

              {/* User Image */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload User Photo:
                </label>
                <input
                  type="file"
                  name="onSiteRegisterImage"
                  onChange={changeuserimage}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                />
                {preview && (
                  <img
                    src={preview}
                    className="w-[100px] h-[100px] rounded-full"
                    alt="User Preview"
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={loadingUsers}
              >
                Register User
              </button>
            </div>
          </form>

          {/* ------------------------------------------------------------------
              Table of Registered Users (Search, Pagination, QR Modal)
              ------------------------------------------------------------------ */}
          <div className="p-4 mb-12">
            <div className="mt-4">
              <div className="flex flex-col sm:flex-row sm:space-x-4 w-full mb-4">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="p-2 border rounded w-full sm:w-full text-black mb-2 sm:mb-0 text-sm sm:text-base"
                />
              </div>

              <table className="min-w-full leading-normal bg-transparent shadow-md">
                <thead className="bg-[#3051A0] text-white">
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                      SN
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                      Institution
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                      Job Position
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                        {indexOfFirstUser + index + 1}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                        {user.onSiteRegisterImage && (
                          <img
                            src={`https://energy-transition-api.onrender.com/${user.onSiteRegisterImage}`}
                            alt={`OnSite User ${user.fullName}`}
                            className="w-16 h-16 object-cover mr-2 mb-2 rounded-full"
                          />
                        )}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                        {user.title || "N/A"} {user.fullName || "N/A"}{" "}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                        {user.email || "N/A"}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                        {user.institution || "N/A"}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                        {user.jobPosition || "N/A"}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600 flex items-center justify-start space-x-2">
                        <button
                          onClick={() => openModal(user._id, user.fullName)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-700 ml-4"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <Stack spacing={2} className="mt-4">
                <Pagination
                  count={Math.ceil(filteredUsers.length / usersPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Stack>

              {/* QR Code Modal */}
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="QR Code Modal"
                ariaHideApp={false}
              >
                <h2 className="text-xl mb-4 text-blue-700">{qrUserName}</h2>
                {qrUserId && (
                  <div id="qrCode">
                    <QRCode value={qrUserId} size={256} />
                  </div>
                )}
                <button
                  onClick={closeModal}
                  className="mt-4 p-2 bg-red-500 text-white rounded"
                >
                  Close
                </button>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateIdCard;
