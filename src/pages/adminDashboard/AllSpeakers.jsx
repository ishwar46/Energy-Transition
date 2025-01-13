import React, { useEffect, useState } from 'react';
import { getAllSpeakersApi } from '../../apis/Api';
import toast from 'react-hot-toast';
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import * as XLSX from "xlsx";
import excelIcon from "../../assets/images/sheet.png";

const AllSpeakers = () => {
  const [allSpeakers, setAllSpeakers] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [institutions, setInstitutions] = useState([]);

  const filteredUsers = allSpeakers.filter((allSpeakers) => {
    const matchesSearch =
      allSpeakers?.fullName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      allSpeakers?.email?.toLowerCase().includes(searchFilter.toLowerCase());

      const matchesInstitution =
      !selectedInstitution ||
      allSpeakers?.institution === selectedInstitution;

    return matchesSearch && matchesInstitution;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const fetchSpeakers = async () => {
    try {
      const response = await getAllSpeakersApi();
      setAllSpeakers(response.data.speakers);
      const institution = Array.from(
        new Set(response.data.speakers.map((speaker) => speaker.institution))
      );
      setInstitutions(institution);
    } catch (error) {
      toast.error("Error fetching speakers.");
      console.error("Error fetching speakers:", error);
    }
  };

  // Fetch speakers only once when the component mounts
  useEffect(() => {
    fetchSpeakers();
  }, []);  // Removed allSpeakers from the dependency array

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredUsers.map((allSpeakers) => ({
        "Full Name": allSpeakers?.fullName || "N/A",
        Email: allSpeakers?.email || "N/A",
        Institution: allSpeakers?.institution || "N/A",
        Designation: allSpeakers?.designation || "N/A",
        "Session": allSpeakers.session || "N/A",
        "Session Time": allSpeakers.sessionTime || "N/A",
        "Second Session": allSpeakers.session2 || "N/A",
        "Second Session Time": allSpeakers.sessionTime2 || "N/A",
      }))
    );

    ws["!cols"] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 35 },
      { wch: 35 },
      { wch: 50 },
      { wch: 50 },
      { wch: 50 },
      { wch: 40 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    XLSX.writeFile(wb, "acsic_participant_details.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-2">
        Total Speakers : {allSpeakers.length}
      </h1>

      <div>
        <div className="flex flex-col sm:flex-row sm:space-x-4 w-full mb-4 justify-between items-center">
          <input
            type="text"
            placeholder="Search by name, email, or institution..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="p-2 border rounded w-full sm:w-full text-black mb-2 sm:mb-0 text-sm sm:text-base"
          />
          <select
            id="institutionFilter"
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="p-2 border rounded focus:ring focus:ring-gray-200 bg-transparent text-black w-full sm:w-auto text-sm sm:text-base"
          >
            <option value="">All Institutions</option>
            {institutions.map((inst) => (
              <option key={inst} value={inst} className="text-black">
                {inst}
              </option>
            ))}
          </select>
          <button
            onClick={exportToExcel}
            className="p-2 w-20 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center"
          >
            <img
              src={excelIcon}
              alt="Export to Excel"
              className="w-8 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5"
            />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal bg-transparent shadow-md">
            <thead>
              <tr className="bg-[#3051A0] text-white">
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  SN
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Institution
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider w-10">
                  Email
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Assigned Session
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                  Session Time
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((speaker, index) => (
                <tr
                  key={speaker._id}
                  className={`border-b border-gray-200 hover:bg-gray-100}`}
                >
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                    {indexOfFirstUser + index + 1}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                    {speaker.fullName || 'N/A'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                    {speaker.designation || 'N/A'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600">
                    {speaker.institution || 'N/A'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600 w-10">
                    {speaker.email || 'N/A'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600 break-all">
                    <ul className="list-disc list-inside">
                      <li>{speaker.session || 'N/A'}</li>
                      {speaker.session2 && <li>{speaker.session2}</li>}
                    </ul>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-600 break-all">
                    <ul className="list-disc list-inside">
                      <li>{speaker.sessionTime || 'N/A'}</li>
                      {speaker.sessionTime2 && <li>{speaker.sessionTime2}</li>}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Stack spacing={2} className="mt-4">
          <Pagination
            count={Math.ceil(filteredUsers.length / usersPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </div>
    </div>
  );
};

export default AllSpeakers;
