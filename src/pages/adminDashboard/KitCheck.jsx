import React, { useState, useEffect } from "react";
import { getAllUsersApi, updateConferenceKitStatusApi } from "../../apis/Api";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaFilePdf } from "react-icons/fa";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/loading.json";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import useDocumentTitle from "../../components/DocTitle";

const KitCheck = () => {
  useDocumentTitle("Manage Conference Kit - International Youth Camp 2025");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [receivedCount, setReceivedCount] = useState(0);
  const [notReceivedCount, setNotReceivedCount] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsersApi();
      const usersData = response.data.users;
      setUsers(usersData);

      // Tally received and not received counts
      const received = usersData.filter(
        (user) => user.conferenceKitReceived
      ).length;
      const notReceived = usersData.length - received;

      setReceivedCount(received);
      setNotReceivedCount(notReceived);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKitStatusChange = async (userId, received) => {
    setIsLoading(true);
    try {
      await updateConferenceKitStatusApi(userId, { received });
      toast.success("Conference kit status updated.");
      fetchUsers();
    } catch (error) {
      console.error("Error updating conference kit status:", error);
      toast.error("Error updating conference kit status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.personalInformation?.fullName?.firstName || ""} ${
      user.personalInformation?.fullName?.lastName || ""
    }`.toLowerCase();
    const email = user.personalInformation?.emailAddress?.toLowerCase() || "";
    const institution =
      user.personalInformation?.nameOfInstitution?.toLowerCase() || "";
    return (
      fullName.includes(searchTerm) ||
      email.includes(searchTerm) ||
      institution.includes(searchTerm)
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.text("Conference Kit Status Report", pageWidth / 2, 20, {
      align: "center",
    });

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 27, {
      align: "center",
    });

    // Line
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 30, pageWidth - 14, 30);

    const tableColumn = ["SN", "Name", "Email", "Institution", "Kit Received"];
    const tableRows = [];

    filteredUsers.forEach((user, index) => {
      const userData = [
        index + 1,
        `${user.personalInformation?.fullName?.firstName || ""} ${
          user.personalInformation?.fullName?.lastName || ""
        }`,
        user.personalInformation?.emailAddress || "N/A",
        user.personalInformation?.nameOfInstitution || "N/A",
        user.conferenceKitReceived ? "Yes" : "No",
      ];
      tableRows.push(userData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
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

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);

      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );

      doc.text(
        "The 36th ACSIC Conference Nepal",
        14,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(
      `conference_kit_status_report_${currentDate.replace(/ /g, "_")}.pdf`
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-3">
        Manage Conference Kits
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="w-full max-w bg-transparent p-5 rounded-lg shadow-lg">
            <div className="mb-4 flex justify-between">
              <h2 className="text-lg font-bold text-gray-900">Participants</h2>
              <div className="text-gray-600">
                <span className="mr-4 text-green-600">
                  <strong>Received:</strong> {receivedCount}
                </span>
                <span className="text-red-600">
                  <strong>Not Received:</strong> {notReceivedCount}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name, email, or institution"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-transparent border text-gray-600">
                <thead className=" bg-[#3051A0] border-b text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">SN</th>{" "}
                    {/* Added SN column */}
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Institution</th>
                    <th className="py-3 px-6 text-center">Kit Received</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => (
                      <tr key={user._id} className="border-b">
                        <td className="py-3 px-6">
                          {indexOfFirstUser + index + 1}
                        </td>{" "}
                        {/* Display SN */}
                        <td className="py-3 px-6">
                          {`${
                            user.personalInformation?.fullName?.firstName || ""
                          } ${
                            user.personalInformation?.fullName?.lastName || ""
                          }`}
                        </td>
                        <td className="py-3 px-6">
                          {user.personalInformation?.emailAddress || "N/A"}
                        </td>
                        <td className="py-3 px-6">
                          {user.personalInformation?.nameOfInstitution || "N/A"}
                        </td>
                        <td className="py-3 px-6 text-center">
                          {user.conferenceKitReceived ? (
                            <span className="text-green-600 font-semibold">
                              Yes
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">
                              No
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={() =>
                              handleKitStatusChange(
                                user._id,
                                !user.conferenceKitReceived
                              )
                            }
                            className={`px-4 py-2 rounded ${
                              user.conferenceKitReceived
                                ? "bg-red-500"
                                : "bg-green-500"
                            } text-white flex items-center justify-center`}
                            title={
                              user.conferenceKitReceived
                                ? "Mark as Not Received"
                                : "Mark as Received"
                            }
                          >
                            {user.conferenceKitReceived ? (
                              <FaTimes />
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-4 text-center text-gray-600"
                      >
                        No participants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Stack spacing={2} className="mt-4">
              <Pagination
                count={Math.ceil(filteredUsers.length / usersPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
            {/* Buttons to generate PDF */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={generatePDF}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 flex items-center"
              >
                <FaFilePdf className="mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KitCheck;
