import React, { useEffect, useState } from "react";
import {
  createBus,
  deleteBus,
  getallBuses,
  getAllUsersApi,
  getAllVolunteer,
  allocateUserToWagon,
  deallocateUserToWagon,
} from "../../apis/Api";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import useDocumentTitle from "../../components/DocTitle";
import { Pagination, Stack } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AddWagon = () => {
  useDocumentTitle("Add Wagon - ACSIC Conference");

  const [allVolunteers, setAllVolunteers] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [allWagon, setAllWagon] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [userAllocations, setUserAllocations] = useState({});
  const [selectedWagon, setSelectedWagon] = useState("");
  const [selectedBus, setSelectedBus] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    busNumber: "",
    color: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVolunteerChange = (event) => {
    const { options } = event.target;
    const selected = [];
    for (const option of options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
    setSelectedVolunteers(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      capacity: formData.capacity,
      busNumber: formData.busNumber,
      color: formData.color,
      volunteers: selectedVolunteers,
    };

    try {
      const res = await createBus(data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Wagon Created Successfully");
        setFormData({
          name: "",
          capacity: "",
          busNumber: "",
          color: "",
        });
        setSelectedVolunteers([]);
        fetchAllWagon();
      } else {
        toast.error(res.data?.message || "Unable to create Wagon");
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  useEffect(() => {
    fetchAllWagon();
    fetchAllUsers();
    fetchAllVolunteers();
  }, []);

  const fetchAllWagon = async () => {
    try {
      const response = await getallBuses();
      if (response.status === 200 || response.status === 201) {
        setAllWagon(response.data.buses);
        const allocations = {};
        response.data.buses.forEach((bus) => {
          bus.allocatedParticipants.forEach((participant) => {
            allocations[participant._id] = bus._id;
          });
        });
        setUserAllocations(allocations);
      } else {
        toast.error(response.data?.message || "No Bus Found");
      }
    } catch (error) {
      toast.error("Error fetching wagons.");
    }
  };

  function getTextColorBasedOnBg(color) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? "text-gray-800" : "text-white";
  }

  const fetchAllVolunteers = async () => {
    try {
      const res = await getAllVolunteer();
      if (res.status === 200 || res.status === 201) {
        setAllVolunteers(res.data.allVolunteer);
      } else {
        toast.error(res.data?.message || "Failed to fetch volunteers");
      }
    } catch (error) {
      toast.error(`Error fetching volunteers: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteBus(id);
      if (res.status === 200 || res.status === 201) {
        toast.success("Wagon Deleted Successfully");
        fetchAllWagon();
      } else {
        toast.error("Failed to delete wagon");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the Wagon");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await getAllUsersApi();
      if (res.status === 200 || res.status === 201) {
        setAllUser(res.data.users);
      }
    } catch (error) {
      toast.error(`Error fetching all users: ${error.message}`);
    }
  };

  const [nameFilter, setNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);

  const filteredUsers =
    allUser &&
    allUser.filter(
      (user) =>
        user.personalInformation?.fullName?.firstName
          ?.toLowerCase()
          .includes(nameFilter.toLowerCase()) ||
        user.personalInformation?.fullName?.lastName
          ?.toLowerCase()
          .includes(nameFilter.toLowerCase())
    );

  const indexofLastUser = currentPage * usersPerPage;
  const indexofFirstUser = indexofLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexofFirstUser, indexofLastUser);

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  const getUserDetails = (userId) => {
    return allUser.find((user) => user._id === userId);
  };

  const handleAllocate = (userId) => {
    setSelectedWagon(null);
    setSelectedUser(getUserDetails(userId));
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handleSelectedWagon = (e) => {
    setSelectedWagon(e.target.value);
  };

  const handleAllocateUserToWagon = async () => {
    if (!selectedUser || !selectedWagon) {
      toast.error("Please select a wagon to allocate the user.");
      return;
    }
    try {
      let accompanyingPersonInfo = null;

      if (selectedUser.accompanyingPerson?.hasAccompanyingPerson === true) {
        const confirmAddAccompanyingPerson = window.confirm(
          `User has an accompanying person. Are you sure you want to add ${selectedUser.accompanyingPerson.accompanyingPersonInformation.fullName.firstName} ${selectedUser.accompanyingPerson.accompanyingPersonInformation.fullName.lastName}?`
        );
        if (!confirmAddAccompanyingPerson) {
          toast.error("Accompanying person not added.");
          accompanyingPersonInfo = {
            firstName: "NA",
            middleName: "NA",
            lastName: "NA",
          };
        } else {
          const { firstName, middleName, lastName } =
            selectedUser.accompanyingPerson.accompanyingPersonInformation
              .fullName;
          accompanyingPersonInfo = {
            firstName,
            middleName: middleName || "NA",
            lastName,
          };
        }
      }

      const res = await allocateUserToWagon(
        selectedWagon,
        selectedUser._id,
        accompanyingPersonInfo
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("User allocated to the wagon successfully.");
        closeModal();
        setUserAllocations((prevAllocations) => ({
          ...prevAllocations,
          [selectedUser._id]: selectedWagon,
        }));
        fetchAllWagon();
      } else {
        toast.error(
          res.data?.message || "Failed to allocate user to the wagon."
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  const handleDeallocate = async (userId) => {
    const allocatedBusId = userAllocations[userId];
    const allocatedBus = allWagon.find((wagon) => wagon._id === allocatedBusId);
    const allocatedBusName = allocatedBus ? allocatedBus._id : "Not Allocated";

    if (!userId || !allocatedBusName) {
      toast.error("Unable to deallocate user. No bus found.");
      return;
    }
    try {
      const res = await deallocateUserToWagon(allocatedBusName, userId);
      if (res.status === 200 || res.status === 201) {
        toast.success("User deallocated successfully.");
        fetchAllWagon();
      } else {
        toast.error(res.data?.message || "Failed to deallocate user.");
      }
    } catch (error) {
      toast.error(`Error deallocating user: ${error.message}`);
    }
  };

  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
  };

  const handleColeseSelectedBusModal = () => {
    setSelectedBus(null);
  };

  const exportBusDetailsToPDF = (selectedBus) => {
    if (!selectedBus) {
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    // Title
    doc.setFontSize(14);
    doc.setTextColor(33, 37, 41);
    doc.text(`Bus Report - ${selectedBus.name}`, 14, 18);

    // Line under the title
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 22, doc.internal.pageSize.getWidth() - 14, 22);

    // Bus details
    doc.setFontSize(10);
    const busDetails = [
      `Bus Name: ${selectedBus.name}`,
      `Volunteers: ${selectedBus.volunteers
        .map((volunteerId) => {
          const volunteer = allVolunteers.find(
            (vol) => vol._id === volunteerId
          );
          return volunteer ? volunteer.fullName : "N/A";
        })
        .join(", ")}`,
      `Capacity: ${selectedBus.capacity}`,
      `Total Seat Remaining: ${
        selectedBus.capacity -
        (selectedBus.allocatedParticipants.length +
          selectedBus.allocatedParticipantsAccompany.length)
      }`,
      `Bus Number: ${selectedBus.busNumber}`,
      `Color: ${selectedBus.color}`,
    ];

    let yPosition = 28;
    busDetails.forEach((detail) => {
      doc.text(detail, 14, yPosition);
      yPosition += 6;
    });

    // Table Headers
    const tableColumn = ["SN", "Participant", "Accompanying Person"];
    const tableRows = selectedBus.allocatedParticipants.map(
      (participant, index) => {
        const participantName = `${
          participant.personalInformation?.fullName?.firstName || "N/A"
        } ${participant.personalInformation?.fullName?.middleName || ""} ${
          participant.personalInformation?.fullName?.lastName || "N/A"
        }`;

        const accompanyingPersonInfo =
          selectedBus.allocatedParticipantsAccompany
            .filter((accompany) => accompany.user === participant._id)
            .map(
              (accompany) =>
                `${accompany.accompanyingPersonInfo?.firstName || "N/A"} ${
                  accompany.accompanyingPersonInfo?.middleName || ""
                } ${accompany.accompanyingPersonInfo?.lastName || "N/A"}`
            )
            .join(", ") || "None";

        return [index + 1, participantName, accompanyingPersonInfo];
      }
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: yPosition + 4,
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
        "The 36th ACSIC Conference Nepal",
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Generated on: ${currentDate}`,
        pageWidth - 70,
        doc.internal.pageSize.height - 10
      );
    }

    const fileName = `bus_report_${selectedBus.name}_${currentDate.replace(
      / /g,
      "_"
    )}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-start mb-4 text-black mt-2">
        Add Wagon
      </h2>
      <div className="mt-2 p-2 rounded-lg bg-white w-full text-black">
        <form
          className="w-full max p-2 text-black shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="w-full mb-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Bus Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="* Bus Name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Volunteers
            </label>
            <select
              multiple
              value={selectedVolunteers}
              onChange={handleVolunteerChange}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            >
              {allVolunteers && allVolunteers.length > 0 ? (
                allVolunteers.map((volunteer) => (
                  <option key={volunteer._id} value={volunteer._id}>
                    {volunteer.fullName}
                  </option>
                ))
              ) : (
                <option value="">No Volunteers Available</option>
              )}
            </select>
          </div>

          <div className="w-full mt-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Bus Color
            </label>
            <input
              type="text"
              name="color"
              placeholder="* Bus Color"
              value={formData.color}
              onChange={handleChange}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mt-2 flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="w-full">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Bus Capacity
              </label>
              <input
                type="number"
                name="capacity"
                placeholder="* Bus Capacity"
                autoComplete="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="w-full ">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Bus Number
              </label>
              <input
                type="number"
                name="busNumber"
                placeholder="*  Bus Number"
                autoComplete="busNumber"
                value={formData.busNumber}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-center mt-8">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Wagon
            </button>
          </div>
        </form>
      </div>
      <div className="w-full max bg-white p-5 mb-10 overflow-y-auto max-h-screen">
        <div className="text-black grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allWagon.map((wagon, index) => (
            <div
              key={index}
              style={{ backgroundColor: wagon.color }}
              className={`rounded-lg shadow-lg hover:opacity-90 transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer ${getTextColorBasedOnBg(
                wagon.color
              )}`}
              onClick={() => handleSelectBus(wagon)}
            >
              <div className="flex flex-col p-6">
                <span className="lg:text-base text-sm font-semibold mb-2">
                  Bus Name: {wagon.name}
                </span>
                <span className="text-sm mb-1">
                  Bus Capacity: {wagon.capacity}
                </span>
                <span className="text-sm mb-1">
                  Total Seat Remaining:{" "}
                  {wagon.capacity -
                    (wagon.allocatedParticipants.length +
                      wagon.allocatedParticipantsAccompany.length)}
                </span>
                <span className="text-sm">Bus Number: {wagon.busNumber}</span>
              </div>
              <div className="absolute top-0 right-0 mt-2 flex flex-row cursor-pointer">
                <MdDelete
                  onClick={() => handleDelete(wagon._id)}
                  className="text-red-700 h-10 w-8 "
                />
              </div>
            </div>
          ))}
        </div>
        {selectedUser && (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative w-11/12 md:w-3/4 max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex justify-between items-center bg-[#3051A0] text-white px-5 py-4 rounded-t-lg">
                  <h2 className="text-xl font-semibold">
                    Allocate{" "}
                    {selectedUser.personalInformation?.fullName?.firstName}{" "}
                    {selectedUser.personalInformation?.fullName?.middleName}{" "}
                    {selectedUser.personalInformation?.fullName?.lastName} to a
                    Bus
                  </h2>
                  <button
                    onClick={closeModal}
                    op
                    className="text-white hover:text-red-300"
                    aria-label="Close modal"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-800 mt-2">
                    <strong className="text-base">Participant: </strong>{" "}
                    {selectedUser.personalInformation?.fullName?.firstName}{" "}
                    {selectedUser.personalInformation?.fullName?.middleName}{" "}
                    {selectedUser.personalInformation?.fullName?.lastName}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong className="text-base">Institution:</strong>
                    {"  "}
                    {selectedUser.personalInformation?.nameOfInstitution}
                  </p>
                </div>
                <div className="p-8 text-black flex flex-col justify-center items-center">
                  <select
                    id="institution"
                    value={selectedWagon}
                    onChange={handleSelectedWagon}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
                  >
                    <option value="">Select Wagon</option>
                    {allWagon.map((wagon) => (
                      <option key={wagon._id} value={wagon._id}>
                        {wagon.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-8"
                    onClick={handleAllocateUserToWagon}
                    disabled={!selectedWagon}
                  >
                    Confirm Allocation
                  </button>
                </div>
              </div>
            </div>

            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        )}
        <div className="mt-10 p-6 bg-white rounded-lg shadow-lg overflow-x-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Participants List
          </h3>
          <div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="p-2 border rounded flex-grow mr-4 text-black mb-2 sm:mb-0"
              />
            </div>
          </div>
          <table className="min-w-full leading-normal shadow-md bg-transparent  border-black">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-l-sm text-xs uppercase tracking-wider">
                  SN
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-l-sm text-xs uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-l-sm text-xs uppercase tracking-wider">
                  Institution
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-l-sm text-xs uppercase tracking-wider">
                  AccompanyPerson
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-l-sm text-xs uppercase tracking-wider">
                  Bus
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-l-sm text-xs uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-black">
              {currentUsers.length > 0 &&
                currentUsers.map((user, index) => {
                  const allocatedBusId = userAllocations[user._id];
                  const allocatedBus = allWagon.find(
                    (wagon) => wagon._id === allocatedBusId
                  );
                  const allocatedBusName = allocatedBus
                    ? allocatedBus.name
                    : "Not Allocated";

                  return (
                    <tr className="hover:bg-gray-50 transition" key={user._id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                        {user.personalInformation?.fullName?.firstName}{" "}
                        {user.personalInformation?.fullName?.middleName}{" "}
                        {user.personalInformation?.fullName?.lastName}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                        {user.personalInformation?.nameOfInstitution ?? "NA"}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                        {user.accompanyingPerson?.accompanyingPersonInformation
                          ?.fullName?.firstName ?? "NA"}{" "}
                        {
                          user.accompanyingPerson?.accompanyingPersonInformation
                            ?.fullName?.middleName
                        }{" "}
                        {
                          user.accompanyingPerson?.accompanyingPersonInformation
                            ?.fullName?.lastName
                        }
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                        {allocatedBusName}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                        <button
                          onClick={() =>
                            userAllocations[user._id]
                              ? handleDeallocate(user._id)
                              : handleAllocate(user._id)
                          }
                          className={`px-4 py-2 rounded ${
                            userAllocations[user._id]
                              ? "bg-red-600 text-white w-40"
                              : "bg-green-600 text-white w-40"
                          }`}
                        >
                          {userAllocations[user._id]
                            ? "Deallocate"
                            : "Allocate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
        {selectedBus && (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative w-11/12 md:w-3/4 max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex justify-between items-center bg-[#3051A0] text-white px-5 py-4 rounded-t-lg">
                  <h2 className="text-xl font-semibold">
                    Details of {selectedBus?.name}
                  </h2>
                  <button
                    onClick={handleColeseSelectedBusModal}
                    className="text-red-500 hover:text-red-300"
                    aria-label="Close modal"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {/* Bus details displayed in a compact grid layout */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-sm text-gray-800">
                    <strong className="text-base">Bus Name: </strong>
                    {selectedBus?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong className="text-base">Capacity: </strong>
                    {selectedBus?.capacity || "N/A"}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong className="text-base">
                      Total Seats Remaining:{" "}
                    </strong>
                    {selectedBus?.capacity -
                      (selectedBus?.allocatedParticipants.length +
                        selectedBus?.allocatedParticipantsAccompany.length) ||
                      "N/A"}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong className="text-base">Bus Number: </strong>
                    {selectedBus?.busNumber || "N/A"}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong className="text-base">Volunteers: </strong>
                    {selectedBus.volunteers
                      .map((volunteerId) => {
                        const volunteer = allVolunteers.find(
                          (vol) => vol._id === volunteerId
                        );
                        return volunteer ? volunteer.fullName : "N/A";
                      })
                      .join(", ") || "None"}
                  </p>
                </div>

                {/* Participants Table */}
                <div className="p-2 mb-5 font-bold">
                  <div
                    style={{ maxHeight: "250px" }}
                    className="overflow-y-auto my-4"
                  >
                    {selectedBus.allocatedParticipants.length > 0 ? (
                      <table className="min-w-full leading-normal shadow-md bg-transparent border-black">
                        <thead>
                          <tr className="bg-gray-100 text-gray-800">
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                              SN
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                              Participant
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                              Accompanying Person
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                              Volunteer
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-black">
                          {selectedBus.allocatedParticipants.map(
                            (participant, index) => (
                              <tr key={index} className="text-black">
                                <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                                  {index + 1}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                                  {participant.personalInformation?.fullName
                                    ?.firstName || "N/A"}{" "}
                                  {participant.personalInformation?.fullName
                                    ?.middleName || ""}{" "}
                                  {participant.personalInformation?.fullName
                                    ?.lastName || "N/A"}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                                  {selectedBus.allocatedParticipantsAccompany
                                    .filter(
                                      (accompany) =>
                                        accompany.user === participant._id
                                    )
                                    .map((accompany, accompanyIndex) => (
                                      <p key={accompanyIndex}>
                                        {accompany.accompanyingPersonInfo
                                          ?.firstName || "N/A"}{" "}
                                        {accompany.accompanyingPersonInfo
                                          ?.middleName || ""}{" "}
                                        {accompany.accompanyingPersonInfo
                                          ?.lastName || "N/A"}
                                      </p>
                                    )) || "None"}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                                  {selectedBus.volunteers
                                    .map((volunteerId) => {
                                      const volunteer = allVolunteers.find(
                                        (vol) => vol._id === volunteerId
                                      );
                                      return volunteer
                                        ? volunteer.fullName
                                        : "N/A";
                                    })
                                    .join(", ") || "None"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <h1 className="text-black text-center font-semibold">
                        No One is Allocated for {selectedBus?.name}
                      </h1>
                    )}
                  </div>
                </div>

                {/* PDF Download Button */}
                <div className="p-4">
                  <button
                    onClick={() => exportBusDetailsToPDF(selectedBus)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>

            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddWagon;
