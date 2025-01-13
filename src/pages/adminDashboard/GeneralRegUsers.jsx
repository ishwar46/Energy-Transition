import React, { useEffect, useState } from "react";
import { deleteOnSiteRegister, getOnSiteRegister } from "../../apis/Api";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import QRCode from "qrcode.react";
import Modal from "react-modal";

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

const GeneralRegUsers = () => {
  const [allOnSiteRegisteredUsers, setAllOnSiteRegisteredUsers] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");

  //QR Code State
  const [qrUserId, setQrUserId] = useState(null);
  const [qrUserName, setQrUserName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  //Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const filteredUsers = allOnSiteRegisteredUsers.filter((user) => {
    const matchesSearch =
      user?.fullName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchFilter.toLowerCase());

    //   const matchesInstitution =
    //     !selectedInstitution ||
    //     user.personalInformation?.nameOfInstitution === selectedInstitution;

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

  const fetchAllOnSiteRegisteredUsers = async () => {
    try {
      const res = await getOnSiteRegister();
      if (res.status === 200 || res.status === 201) {
        setAllOnSiteRegisteredUsers(res.data.onSiteRegisterData);
        console.log(res.data.onSiteRegisterData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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

  useEffect(() => {
    fetchAllOnSiteRegisteredUsers();
  }, []);

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

  return (
    <div className="mt-4">
      <div className="flex flex-col sm:flex-row sm:space-x-4 w-full mb-4">
        {/* Unified search input */}
        <input
          type="text"
          placeholder="Search by name, email, or institution..."
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
                {index + 1}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                {user.onSiteRegisterImage && (
                  <img
                    src={`https://crownthevisionapi.onrender.com/${user.onSiteRegisterImage}`}
                    // src={`https://crownthevisionapi.onrender.com/${user.onSiteRegisterImage}`}
                    alt={`Volunteer ${user.fullName}`}
                    className="w-16 h-16 object-cover mr-2 mb-2 rounded-full"
                  />
                )}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                {user.title || "N/A"} {user.fullName || "N/A"}{" "}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                {user.email || "N/A"}{" "}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                {user.institution || "N/A"}{" "}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                {user.jobPosition || "N/A"}{" "}
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
      <Stack spacing={2} className="mt-4">
        <Pagination
          count={Math.ceil(filteredUsers.length / usersPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
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
  );
};

export default GeneralRegUsers;
