import React, { useEffect, useState, useRef } from "react";
import excelIcon from "../../assets/images/sheet.png";
import pdfIcon from "../../assets/images/pdf.png";
import * as XLSX from "xlsx";
import "../../css/styles.css";
import "../../css/print.css";
import {
  deleteUserApi,
  getAllUsersApi,
  verifyUserByAdminApi,
  resetUserPasswordApi,
} from "../../apis/Api";
import acsisclogo from "../../assets/images/uranuslogo.png";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/loading.json";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
        <img src={imageUrl} alt="Preview" className="max-w-full max-h-full" />
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  const componentRef = useRef();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          className="bg-white p-5 rounded-lg shadow-lg w-full max-w-3xl mx-4 overflow-y-auto modal-content"
          style={{ maxHeight: "80vh" }}
        >
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              User Details
            </h2>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-700"
              aria-label="Close modal"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="space-y-4 printable-content" ref={componentRef}>
            {children}
          </div>
          <div className="mt-6 flex justify-end space-x-4 no-print">
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              aria-label="Close modal"
            >
              <i className="fas fa-times mr-2"></i>
              Close
            </button>
          </div>
        </div>
      </div>
      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
      />
    </>
  );
};

const getUserDetailsForQR = (currentUser) => {
  if (
    !currentUser ||
    Object.keys(currentUser).length === 0 ||
    !currentUser.personalInformation
  ) {
    return "No valid user data available";
  }
  const details = `Title: ${
    currentUser.personalInformation.title || "N/A"
  }\nFull Name: ${
    currentUser.personalInformation.fullName.firstName || "N/A"
  } ${currentUser.personalInformation.fullName.middleName || ""} ${
    currentUser.personalInformation.fullName.lastName || "N/A"
  }\nNationality: ${
    currentUser.personalInformation.nationality || "N/A"
  }\nInstitution: ${
    currentUser.personalInformation.nameOfInstitution || "N/A"
  }\nJob Position: ${
    currentUser.personalInformation.jobPosition || "N/A"
  }\nOffice Address: ${
    currentUser.personalInformation.officeAddress || "N/A"
  }\nEmail Address: ${
    currentUser.personalInformation.emailAddress || "N/A"
  }\nPhone Number: ${
    currentUser.personalInformation.mobileNumber || "N/A"
  }\nMobile Number: ${currentUser.personalInformation.mobileNumber || "N/A"}`;
  return details;
};

const AllParticipants = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [duplicateUserIds, setDuplicateUserIds] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [imageToPreview, setImageToPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const handleImageClick = (imageUrl) => {
    setImageToPreview(imageUrl);
    setIsImagePreviewOpen(true);
  };

  const handleAdminResetPassword = async (userId) => {
    try {
      const response = await resetUserPasswordApi(userId);
      if (response && response.data.success) {
        toast.success("Password reset successfully!");
      } else {
        toast.error("Failed to reset password.");
      }
    } catch (error) {
      toast.error(`Error resetting password: ${error.message}`);
    }
  };

  // Edit User
  const handleEditUser = (userId) => {
    navigate(`/edituser/${userId}`);
  };

  // Fetch users and extract institutions
  useEffect(() => {
    setIsLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersApi();
        if (response && response.data && response.data.users) {
          setUsers(response.data.users);
          // console.log(response.data.users);
          setDuplicateUserIds(response.data.duplicateUserIds);
        }
      } catch (error) {
        // console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    );
  }

  const handleViewDetails = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await deleteUserApi(userId);
      if (response && response.data) {
        toast.success("User deleted successfully!");
        setUsers(users.filter((user) => user._id !== userId));
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      toast.error(`Error deleting user: ${error.message}`);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredUsers.map((user) => ({
        Title: user.personalInformation?.title || "N/A",
        "First Name": user.personalInformation?.fullName?.firstName || "N/A",
        "Middle Name": user.personalInformation?.fullName?.middleName || "",
        "Last Name": user.personalInformation?.fullName?.lastName || "N/A",
        "Date Of Birth": user.personalInformation?.dateOfBirth
          ? new Date(user.personalInformation?.dateOfBirth).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )
          : "N/A", // Convert to formatted string for immediate visibility
        Email: user.personalInformation?.emailAddress || "N/A",
        "Leo Multiple District And Club Name":
          user.personalInformation?.leoMultipleDistrictAndClubName || "N/A",
        "Position in District":
          user.personalInformation?.positionInDistrict || "N/A",
        Status: user.adminVerification?.status || "N/A",
        Occupation: user.personalInformation?.occupation || "N/A",
        "INTL Occupation Passport Number":
          user.personalInformation?.intlOccupationPassportNumber || "N/A",
        "Phone Number": user.personalInformation?.mobileNumber || "N/A",
        "Emergency Contact Num":
          user.personalInformation?.emergencyContactNum || "N/A",
        Gender: user.personalInformation?.gender?.male
          ? "Male"
          : user.personalInformation?.gender?.feMale
          ? "Female"
          : user.personalInformation?.gender?.others
          ? "Others"
          : "N/A",
        Meal: user?.personalInformation?.dietaryRequirements?.vegetarian
          ? "Vegetarian"
          : user?.personalInformation?.dietaryRequirements?.nonveg
          ? "Nonveg"
          : user?.personalInformation?.dietaryRequirements?.other
          ? "Other"
          : "N/A",
        "Why do you need to attend this program? Do you have experienced similar camps ?":
          user.personalInformation?.whyToAttend || "N/A",
        "What makes you unique ?":
          user.personalInformation?.uniqueness || "N/A",
        "Explain your Achievemnt Till Now ?":
          user.personalInformation?.achievementsTillNow || "N/A",
        "Do you have any special skills or qualification that makes you a good candidate for this Youth Camp ?":
          user.personalInformation?.anySpecialSkillsOrQualifications || "N/A",
        "Which Social Media does user use ?":
          user.personalInformation?.socialMediaHandle || "N/A",
        "Describle your current mental and physical health. Do you have any allergies or long-term sickness ?":
          user.personalInformation?.currentMentalAndPhysicalHealth || "N/A",
        "Are there any notable things we should know about you that haven't been covered in this application ?":
          user.personalInformation?.notableThingsToKnow || "N/A",
      }))
    );

    ws["!cols"] = [
      { wch: 10 }, // Title
      { wch: 20 }, // First Name
      { wch: 20 }, // Middle Name
      { wch: 20 }, // Last Name
      { wch: 20 }, // Date of Birth
      { wch: 30 }, // Email
      { wch: 30 }, // Current Address
      { wch: 30 }, // Highest Education Level
      { wch: 40 }, // Leo Multiple District And Club Name
      { wch: 30 }, // Position in District
      { wch: 15 }, // Status
      { wch: 30 }, // Occupation
      { wch: 40 }, // INTL Occupation Passport Number
      { wch: 20 }, // WhatsApp Number
      { wch: 20 }, // Emergency Contact Number
      { wch: 10 }, // Gender
      { wch: 70 }, // Why Attend
      { wch: 50 }, // What Makes You Unique
      { wch: 50 }, // Achievements
      { wch: 50 }, // Special Skills
      { wch: 30 }, // Social Media
      { wch: 90 }, // Health Description
      { wch: 90 }, // Notable Things
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    XLSX.writeFile(
      wb,
      "Energy_Transition_for_Resilient_and_Low_Carbon_Economy_Summit.xlsx"
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF("landscape");
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const totalParticipants = filteredUsers.length;

    // Title
    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    const reportTitle = `Energy Transition for Resilient and Low Carbon Economy Summit 2025`;
    doc.text(reportTitle, 14, 18);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 22, doc.internal.pageSize.getWidth() - 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(33, 37, 41);
    doc.text(`Total Participants: ${totalParticipants}`, 14, 28);

    const tableColumn = [
      "SN",
      "Name",
      "Email",
      "Phone Number",
      "Gender",
      "Meal",
    ];

    const tableRows = filteredUsers.map((user, index) => {
      const userName = `${user.personalInformation?.title || "N/A"} ${
        user.personalInformation?.fullName?.firstName || "N/A"
      } ${user.personalInformation?.fullName?.middleName || ""} ${
        user.personalInformation?.fullName?.lastName || "N/A"
      }`;

      return [
        index + 1,
        userName,
        user.personalInformation?.emailAddress || "N/A",
        user.personalInformation?.whatsAppNumber || "N/A",
        user.personalInformation?.occupation || "N/A",
        // accompanyingPersonInfo,
        user.personalInformation?.currentAddress || "N/A",
        user.personalInformation?.highestEducationLevel || "N/A",
        user.personalInformation?.gender?.male
          ? "Male"
          : user.personalInformation?.gender?.feMale
          ? "Female"
          : user.personalInformation?.gender?.others
          ? "Others"
          : "N/A",
        user?.personalInformation?.dietaryRequirements?.vegetarian
          ? "Vegetarian"
          : user?.personalInformation?.dietaryRequirements?.nonveg
          ? "Nonveg"
          : user?.personalInformation?.dietaryRequirements?.other
          ? "Other"
          : "N/A",
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      theme: "striped",
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      tableLineColor: [189, 195, 199],
      tableLineWidth: 0.75,
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFontSize(8);
      doc.setTextColor(100);
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2 - 10,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        "Uranus Event Management",
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Generated on: ${currentDate}`,
        pageWidth - 70,
        doc.internal.pageSize.height - 10
      );
    }

    const fileName = `Energy_Transition_for_Resilient_and_Low_Carbon_Economy_Summit_${currentDate.replace(
      / /g,
      "_"
    )}.pdf`;
    doc.save(fileName);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-200 text-green-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleApprove = async () => {
    try {
      const response = await verifyUserByAdminApi(currentUser._id, {
        status: "accepted",
      });
      if (response && response.data) {
        toast.success("User approved successfully!");
        setUsers(
          users.map((user) =>
            user._id === currentUser._id
              ? { ...user, adminVerification: { status: "accepted" } }
              : user
          )
        );
        setIsModalOpen(false);
      } else {
        toast.error("Failed to approve user.");
      }
    } catch (error) {
      toast.error(`Error approving user: ${error.message}`);
    }
  };

  // Filter users based on search input and number
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.personalInformation?.fullName?.firstName
        ?.toLowerCase()
        .includes(searchFilter.toLowerCase()) ||
      user.personalInformation?.fullName?.lastName
        ?.toLowerCase()
        .includes(searchFilter.toLowerCase()) ||
      user.personalInformation?.emailAddress
        ?.toLowerCase()
        .includes(searchFilter.toLowerCase()) ||
      user.personalInformation?.whatsAppNumber
        ?.trim()
        .includes(searchFilter.trim());

    return matchesSearch;
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  //Export to PDF Particular Participats
  const participantExportToPdf = (currentUser) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const userName = `${
      currentUser.personalInformation?.fullName?.firstName || "N/A"
    } ${currentUser.personalInformation?.fullName?.middleName || ""} ${
      currentUser.personalInformation?.fullName?.lastName || "N/A"
    }`;

    // Title
    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    const reportTitle = `The International Youth Camp For 2025`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleXPos = (pageWidth - doc.getTextWidth(reportTitle)) / 2;
    doc.text(reportTitle, titleXPos, 18);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 22, pageWidth - 14, 22);

    const name = `${userName}`;
    const titleXPos3 = (pageWidth - doc.getTextWidth(name)) / 2;
    doc.text(name, titleXPos3, 28);

    doc.setFontSize(10);
    doc.setTextColor(33, 37, 41);

    // Add participant details table
    const participantRows = [
      [
        "Full Name",
        `${currentUser?.personalInformation?.fullName?.firstName || "N/A"} ${
          currentUser?.personalInformation?.fullName?.middleName || ""
        } ${currentUser?.personalInformation?.fullName?.lastName || ""}`,
      ],
      [
        "Date Of Birth",
        currentUser.personalInformation?.dateOfBirth
          ? new Date(
              currentUser.personalInformation?.dateOfBirth
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A",
      ],
      ["Status", currentUser?.adminVerification?.status || "N/A"],
      ["Phone Number", currentUser?.personalInformation?.mobileNumber || "N/A"],
      [
        "Gender",
        currentUser?.personalInformation?.gender?.male
          ? "Male"
          : currentUser?.personalInformation?.gender?.feMale
          ? "Female"
          : currentUser?.personalInformation?.gender?.others
          ? "Others"
          : "N/A",
      ],
      [
        "Meal",
        currentUser?.personalInformation?.dietaryRequirements?.vegetarian
          ? "Vegetarian"
          : currentUser?.personalInformation?.dietaryRequirements?.nonveg
          ? "Nonveg"
          : currentUser?.personalInformation?.dietaryRequirements?.other
          ? "Other"
          : "N/A",
      ],
    ];

    autoTable(doc, {
      head: [["Participant", "Details"]],
      body: participantRows,
      startY: 32,
      theme: "striped",
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      tableLineColor: [189, 195, 199],
      tableLineWidth: 0.75,
      columnStyles: {
        0: { cellWidth: 50, halign: "left" },
        1: { cellWidth: "auto", halign: "left" },
      },
    });

    const footerText = `Generated on ${currentDate}`;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      footerText,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    const fileName = `Energy_Transition_for_Resilient_and_Low_Carbon_Economy_Summit_Details${currentDate.replace(
      / /g,
      "-"
    )}.pdf`;
    doc.save(fileName);
  };

  const dietaryRequirements = currentUser?.dietaryRequirements;
  const showOther =
    !dietaryRequirements?.vegetarian &&
    !dietaryRequirements?.halal &&
    !dietaryRequirements?.nonveg &&
    dietaryRequirements?.other;

  return (
    <>
      <div className="mt-5">
        {users.length > 0 ? (
          <div className="border rounded-xl p-5 bg-transparent shadow-md">
            <div className="flex justify-between items-center mb-5">
              <div className="text-1xl text-gray-800 font-bold">
                Registered Participant
              </div>
              <div className="flex space-x-4 items-center">
                {/* Export to Excel */}
                <button
                  onClick={exportToExcel}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center"
                >
                  <img
                    src={excelIcon}
                    alt="Export to Excel"
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lgx:h-5"
                  />
                </button>
                {/* Export to PDF */}
                <button
                  onClick={() => exportToPDF()}
                  className="p-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded flex items-center"
                >
                  <img
                    src={pdfIcon}
                    alt="Export to PDF"
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5"
                  />
                </button>
              </div>
            </div>

            <div className="mb-5 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 justify-between items-center">
              <div className="flex flex-col sm:flex-row sm:space-x-4 w-full">
                {/* Unified search input */}
                <input
                  type="text"
                  placeholder="Search by name, email or Number..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="p-2 border rounded w-full sm:w-full text-black mb-2 sm:mb-0 text-sm sm:text-base"
                />
              </div>
            </div>

            <table className="min-w-full leading-normal bg-transparent shadow-md">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SN
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Occupation
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={
                      duplicateUserIds && duplicateUserIds.includes(user._id)
                        ? "bg-yellow-100"
                        : ""
                    }
                  >
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                      {indexOfFirstUser + index + 1}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                      {user.personalInformation?.fullName?.firstName || "N/A"}{" "}
                      {user.personalInformation?.fullName?.lastName || "N/A"}{" "}
                      {/* {user.chiefDelegateOrSpeaker?.chiefDelegate && (
                        <span title="Chief Delegate">⭐</span>
                      )} */}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                      {user.personalInformation?.emailAddress || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                      {user.personalInformation?.whatsAppNumber || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                      {user.personalInformation?.occupation || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          user.adminVerification?.status || "N/A"
                        )}`}
                      >
                        {user.adminVerification?.status || "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600 flex items-center justify-start space-x-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleEditUser(user._id)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentUser(user);
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
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
        ) : (
          <div className="text-gray-800">No Registered User available.</div>
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApprove}
          onDelete={() => handleDeleteUser(currentUser._id)}
          status={currentUser?.adminVerification?.status}
          handleAdminResetPassword={handleAdminResetPassword}
          currentUser={currentUser}
        >
          <div className="text-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-800">
                Energy Transition for Resilient and Low Carbon Economy Summit
                (Participant Details)
              </h2>
              <img src={acsisclogo} alt="Logo" className="w-12 h-15" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* Personal Information */}
              <div className="col-span-2 border border-gray-500 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">
                  Personal Information
                </h3>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm">
                      <strong>Title:</strong>{" "}
                      {currentUser?.personalInformation?.title || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Full Name:</strong>{" "}
                      {`${
                        currentUser?.personalInformation?.fullName?.firstName ||
                        "N/A"
                      } ${
                        currentUser?.personalInformation?.fullName
                          ?.middleName || ""
                      } ${
                        currentUser?.personalInformation?.fullName?.lastName ||
                        "N/A"
                      }`}
                    </p>
                    <p className="text-sm">
                      <strong>Nationality:</strong>{" "}
                      {currentUser?.personalInformation?.nationality || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Date of Birth:</strong>{" "}
                      {currentUser?.personalInformation?.dateOfBirth
                        ? new Date(
                            currentUser.personalInformation.dateOfBirth
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Current Address:</strong>{" "}
                      {currentUser?.personalInformation?.currentAddress ||
                        "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Highest Education Level:</strong>{" "}
                      {currentUser?.personalInformation
                        ?.highestEducationLevel || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Email Address:</strong>{" "}
                      {currentUser?.personalInformation?.emailAddress || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Phone Number:</strong>{" "}
                      {currentUser?.personalInformation?.mobileNumber || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Emergency Contact Number:</strong>{" "}
                      {currentUser?.personalInformation?.emergencyContactNum ||
                        "N/A"}
                    </p>
                    {(dietaryRequirements?.vegetarian ||
                      dietaryRequirements?.halal ||
                      dietaryRequirements?.nonveg ||
                      showOther) && (
                      <p className="text-sm">
                        <strong>Dietary Preferences:</strong>{" "}
                        {[
                          dietaryRequirements?.vegetarian && "Vegetarian",
                          dietaryRequirements?.halal && "Halal",
                          dietaryRequirements?.nonveg && "Non-Veg",
                          showOther && dietaryRequirements?.other,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-center ml-4">
                    {currentUser?.personalInformation?.profilePicture
                      ?.fileName && (
                      <img
                        src={`https://energy-transition-api-eg0r.onrender.com/${currentUser.personalInformation?.profilePicture.fileName}`}
                        // src={`http://localhost:5000/${currentUser.personalInformation?.profilePicture.fileName}`}
                        alt="Profile"
                        className="w-20 h-20 rounded-full cursor-pointer"
                        onClick={() =>
                          handleImageClick(
                            `https://energy-transition-api-eg0r.onrender.com/${currentUser.personalInformation?.profilePicture.fileName}`
                            // `https://api.acsicnepal.com/${currentUser.personalInformation.profilePicture.fileName}`
                          )
                        }
                      />
                    )}
                    {currentUser && currentUser.personalInformation && (
                      <div className="mt-4">
                        <QRCodeSVG
                          fgColor="green"
                          value={getUserDetailsForQR(currentUser)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => participantExportToPdf(currentUser)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            aria-label="Print details"
          >
            <img
              src={pdfIcon}
              alt="Export to PDF"
              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 mr-3"
            />
            Download PDF
          </button>
        </Modal>

        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          user={currentUser}
          onConfirm={() => handleDeleteUser(currentUser._id)}
        />

        <ImagePreviewModal
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
          imageUrl={imageToPreview}
        />
      </div>
    </>
  );
};

export default AllParticipants;
