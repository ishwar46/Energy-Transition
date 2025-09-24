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
import { useReactToPrint } from "react-to-print";
import logo from "../../assets/images/nepal.png";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import EditUserModal from "../../components/EditUserModal";
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

const Modal = ({
  isOpen,
  onClose,
  onApprove,
  onDelete,
  children,
  status,
  handleAdminResetPassword,
  currentUser,
}) => {
  const componentRef = useRef();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          className="bg-white p-5 rounded-lg shadow-lg w-full max-w-3xl mx-4 overflow-y-auto modal-content"
          style={{ maxHeight: "80vh" }}
        >
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-md font-semibold text-gray-900">
              Participant Details
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
              onClick={onApprove}
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ${
                status === "accepted" ? "cursor-not-allowed opacity-50" : ""
              }`}
              aria-label="Approve user"
              disabled={status === "accepted"}
            >
              <i className="fas fa-check-circle mr-2"></i>
              Accept
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              aria-label="Print details"
            >
              <i className="fas fa-print mr-2"></i>
              Print
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              aria-label="Close modal"
            >
              <i className="fas fa-times mr-2"></i>
              Close
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              aria-label="Delete user"
            >
              <i className="fas fa-trash mr-2"></i>
              Delete
            </button>
            <button
              onClick={() => handleAdminResetPassword(currentUser._id)}
              className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ${
                currentUser.adminVerification?.status === "pending"
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              disabled={currentUser.adminVerification?.status === "pending"}
            >
              <i className="fas fa-lock mr-2"></i> Reset Password
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
  console.log("Current User Data:", currentUser._id);

  if (!currentUser) {
    return "No user data available";
  }
  const userId = currentUser._id || "N/A";

  const details = `${userId}`;
  return details;
};

const UserTable = () => {
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  //Role
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showOnlyDuplicates, setShowOnlyDuplicates] = useState(false);

  // const truncateText = (text, wordLimit) => {
  //   const words = text.split(" ");
  //   if (words.length > wordLimit) {
  //     return words.slice(0, wordLimit).join(" ") + "...";
  //   }
  //   return text;
  // };

  // const biography = currentUser?.biography || "";
  // const truncatedBiography = truncateText(biography, 50);

  const [participantTypeFilter, setParticipantTypeFilter] = useState("");

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
    setEditUserId(userId);
    setIsEditModalOpen(true);
  };

  // Handle user updated from modal
  const handleUserUpdated = (updatedUser) => {
    setUsers(
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  // Fetch users and extract institutions
  useEffect(() => {
    setIsLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersApi();
        if (response && response.data && response.data.users) {
          setUsers(response.data.users);
          setDuplicateUserIds(response.data.duplicateUserIds);

          // Extract distinct institutions
          // const uniqueInstitutions = Array.from(
          //   new Set(
          //     response.data.users.map(
          //       (user) => user.personalInformation?.nameOfInstitution
          //     )
          //   )
          // );
          // setInstitutions(uniqueInstitutions);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
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
        Email: user.personalInformation?.emailAddress || "N/A",
        Status: user.adminVerification?.status || "N/A",
        Organization: user.personalInformation?.nameOfInstitution || "N/A",
        Occupation: user.personalInformation?.jobPosition || "N/A",
        "Phone Number": user.personalInformation?.mobileNumber || "N/A",
        Gender: user.personalInformation?.gender || "N/A",
        "Participant Type": user.personalInformation?.participantType || "N/A", // New Column
      }))
    );

    ws["!cols"] = [
      { wch: 10 }, // Title
      { wch: 20 }, // First Name
      { wch: 20 }, // Middle Name
      { wch: 20 }, // Last Name
      { wch: 30 }, // Email
      { wch: 15 }, // Status
      { wch: 25 }, // Organization
      { wch: 25 }, // Occupation
      { wch: 20 }, // Phone Number
      { wch: 10 }, // Gender
      { wch: 30 }, // Participant Type
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    XLSX.writeFile(
      wb,
      "Energy_Transition_for_Resilient_and_Low_Carbon_Economy_Summit.xlsx"
    );
  };
  // Export to PDF
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
      "Organization",
      "Participant Type",
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
        user.personalInformation?.mobileNumber || "N/A",
        user.personalInformation?.nameOfInstitution || "N/A",
        user.personalInformation?.participantType || "N/A",
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
        "Energy Transition for Resilient and Low Carbon Economy Summit",
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

  //Filters
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
      user.personalInformation?.mobileNumber
        ?.trim()
        .includes(searchFilter.trim());

    const matchGender =
      !genderFilter || user.personalInformation?.gender === genderFilter;

    const matchParticipantType =
      !participantTypeFilter ||
      user.personalInformation?.participantType === participantTypeFilter;

    const matchStatus =
      !statusFilter || user.adminVerification?.status === statusFilter;

    const matchDuplicates =
      !showOnlyDuplicates || duplicateUserIds.includes(user._id);

    return (
      matchesSearch &&
      matchGender &&
      matchParticipantType &&
      matchStatus &&
      matchDuplicates
    );
  });

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
              {/* Title */}
              <div className="text-lg font-bold text-gray-800">
                Registered Participants
              </div>

              {/* Right Section: Duplicate Filter + Export Buttons */}
              <div className="flex items-center space-x-6">
                {/* Duplicate Filter */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="duplicateFilter"
                    checked={showOnlyDuplicates}
                    onChange={(e) => setShowOnlyDuplicates(e.target.checked)}
                    className="cursor-pointer w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                    aria-label="Show only duplicate users"
                  />
                  <label
                    htmlFor="duplicateFilter"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Show Only Duplicates
                  </label>
                </div>

                {/* Export Buttons */}
                <div className="flex space-x-4">
                  {/* Export to Excel */}
                  <button
                    onClick={exportToExcel}
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded flex items-center"
                    aria-label="Export to Excel"
                  >
                    <img
                      src={excelIcon}
                      alt="Export to Excel"
                      className="w-5 h-5"
                    />
                  </button>

                  {/* Export to PDF */}
                  <button
                    onClick={exportToPDF}
                    className="p-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded flex items-center"
                    aria-label="Export to PDF"
                  >
                    <img
                      src={pdfIcon}
                      alt="Export to PDF"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-5 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 justify-between items-center">
              <div className="flex flex-col sm:flex-row sm:space-x-4 w-full">
                {/* search input */}
                <input
                  type="text"
                  placeholder="Search by name, email or number..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="p-2 border rounded sm:w-1/2 w-full text-black mb-2 sm:mb-0 text-sm sm:text-base h-11"
                />
                <div className="flex flex-col sm:flex-row sm:space-x-4 w-full text-gray-700">
                  {/* Status Filter */}
                  <select
                    className="border rounded focus:ring focus:ring-gray-200 sm:w-1/3 w-full text-center"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="accepted">Accepted</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {/* Participant Type Filter */}
                  <select
                    className="border rounded focus:ring focus:ring-gray-200 sm:w-1/3 w-full text-center"
                    value={participantTypeFilter}
                    onChange={(e) => setParticipantTypeFilter(e.target.value)}
                  >
                    <option value="">All Participant Types</option>
                    <option value="Session Chair">Session Chair</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Presenter">Presenter</option>
                    <option value="General Participant">
                      General Participant
                    </option>
                    <option value="VIP Guest">VIP Guest</option>
                    <option value="Media">Media</option>
                    <option value="Keynote Speaker">Keynote Speaker</option>
                  </select>
                  {/* Gender Filter */}
                  <select
                    className="border rounded focus:ring focus:ring-gray-200 sm:w-1/3 w-full text-center"
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                  >
                    <option value="">All Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>
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
                    Number
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Organization
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
                        ? "bg-yellow-100 bg-opacity-50"
                        : ""
                    }
                  >
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                      {indexOfFirstUser + index + 1}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                      {user.personalInformation?.fullName?.firstName || "N/A"}{" "}
                      {user.personalInformation?.fullName?.lastName || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                      {user.personalInformation?.emailAddress || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                      {user.personalInformation?.mobileNumber || "N/A"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                      {user.personalInformation?.nameOfInstitution || "N/A"}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <h2 className="text-lg font-semibold text-green-800 leading-tight">
                Energy Transition for Resilient and Low Carbon Economy Summit
              </h2>
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
              />
            </div>

            <div className="space-y-4">
              {/* Personal Information Section */}
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">
                  Personal Information
                </h3>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Title
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          {currentUser?.personalInformation?.title || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Full Name
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          {`${
                            currentUser?.personalInformation?.fullName
                              ?.firstName || "N/A"
                          } ${
                            currentUser?.personalInformation?.fullName
                              ?.middleName || ""
                          } ${
                            currentUser?.personalInformation?.fullName
                              ?.lastName || "N/A"
                          }`}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Gender
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          {currentUser?.personalInformation?.gender || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Email Address
                        </span>
                        <p className="text-sm text-gray-800 mt-1 break-all">
                          {currentUser?.personalInformation?.emailAddress ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Mobile Number
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          {currentUser?.personalInformation?.mobileNumber ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Designation
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          {currentUser?.personalInformation?.jobPosition ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Organization
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          {currentUser?.personalInformation
                            ?.nameOfInstitution || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Participant Type
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          {currentUser?.personalInformation?.participantType ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    {(dietaryRequirements?.vegetarian ||
                      dietaryRequirements?.halal ||
                      dietaryRequirements?.nonveg ||
                      showOther) && (
                      <div>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Dietary Preferences
                        </span>
                        <p className="text-sm text-gray-800 mt-1">
                          {[
                            dietaryRequirements?.vegetarian && "Vegetarian",
                            dietaryRequirements?.halal && "Halal",
                            dietaryRequirements?.nonveg && "Non-Veg",
                            showOther && dietaryRequirements?.other,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center lg:items-start space-y-4 lg:ml-6">
                    {currentUser?.personalInformation?.profilePicture
                      ?.fileName && (
                      <div className="text-center">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                          Profile Picture
                        </span>
                        <img
                          src={`https://energy-transition-api-eg0r.onrender.com/${currentUser.personalInformation?.profilePicture.fileName}`}
                          alt="Profile"
                          className="w-24 h-24 rounded-lg object-cover cursor-pointer border-2 border-gray-300 hover:border-gray-400 transition-colors"
                          onClick={() =>
                            handleImageClick(
                              `https://energy-transition-api-eg0r.onrender.com/${currentUser.personalInformation?.profilePicture.fileName}`
                            )
                          }
                        />
                      </div>
                    )}
                    {currentUser?.personalInformation && (
                      <div className="text-center">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                          QR Code
                        </span>
                        <div className="p-2 bg-white rounded border">
                          <QRCodeSVG
                            fgColor="green"
                            value={getUserDetailsForQR(currentUser)}
                            size={80}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Verification Section */}
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 sm:p-6 no-print">
                <h3 className="text-sm font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">
                  Admin Verification
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Status
                      </span>
                      <p className="text-sm text-gray-800 mt-1 font-semibold">
                        {currentUser?.adminVerification?.status || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Verified Date
                      </span>
                      <p className="text-sm text-gray-800 mt-1">
                        {currentUser?.adminVerification?.verifiedDate
                          ? new Date(
                              currentUser.adminVerification.verifiedDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Request Date
                      </span>
                      <p className="text-sm text-gray-800 mt-1">
                        {currentUser?.adminVerification?.verificationRequestDate
                          ? new Date(
                              currentUser.adminVerification.verificationRequestDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {currentUser?.adminVerification?.adminRemarks && (
                    <div>
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Admin Remarks
                      </span>
                      <p className="text-sm text-gray-800 mt-1">
                        {currentUser.adminVerification.adminRemarks}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          user={currentUser}
          onConfirm={() => handleDeleteUser(currentUser._id)}
        />

        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          userId={editUserId}
          onUserUpdated={handleUserUpdated}
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

export default UserTable;
