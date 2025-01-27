import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getMealsAndExcursionsApi, updateMealStatusApi } from "../../apis/Api";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/loading.json";
import Pagination from "@mui/material/Pagination";
import { Tabs, Tab, Stack } from "@mui/material";
import { toast } from "react-hot-toast";
import {
  FaFilePdf,
  FaFileExcel,
  FaCalendarAlt,
  FaUtensils,
  FaMugHot,
  FaUtensilSpoon,
} from "react-icons/fa";
import useDocumentTitle from "../../components/DocTitle";

// DATE PICKER
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MealsExcursionsAdmin = () => {
  useDocumentTitle("Manage Meals and Excursions - Uranus Event Management");

  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [participantsPerPage] = useState(10);
  const [currentTab, setCurrentTab] = useState(0);

  // =========================================
  //  DATE-RANGE FILTER
  // =========================================
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch and filter by date range
  const filterDataByDateRange = async () => {
    try {
      setIsLoading(true);

      const response = await getMealsAndExcursionsApi();
      const allParticipants = response.data.participants || [];

      // Normalize data
      const participantsWithMeals = allParticipants.map((participant) => ({
        ...participant,
        meals: participant.meals || [],
        excursions: participant.excursions || [],
      }));

      // If no dates selected, show all participants
      if (!startDate && !endDate) {
        setParticipants(participantsWithMeals);
      } else {
        // Convert to timestamps for inclusive range checking
        const startTime = startDate
          ? new Date(startDate).setHours(0, 0, 0, 0)
          : null;
        const endTime = endDate
          ? new Date(endDate).setHours(23, 59, 59, 999)
          : null;

        const filtered = participantsWithMeals.filter((participant) => {
          const hasMealInRange = participant.meals.some((meal) => {
            const mealTime = new Date(meal.date).getTime();
            return (
              (startTime === null || mealTime >= startTime) &&
              (endTime === null || mealTime <= endTime)
            );
          });

          const hasExcursionInRange = participant.excursions.some((exc) => {
            const excTime = new Date(exc.date).getTime();
            return (
              (startTime === null || excTime >= startTime) &&
              (endTime === null || excTime <= endTime)
            );
          });

          return hasMealInRange || hasExcursionInRange;
        });

        setParticipants(filtered);
      }
    } catch (error) {
      console.error("Error fetching meals and excursions:", error);
      toast.error("Failed to fetch participants.");
    } finally {
      setIsLoading(false);
    }
  };

  // Run filter whenever startDate/endDate changes
  useEffect(() => {
    filterDataByDateRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  // parseDate: now includes time (unchanged from your code)
  const parseDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  };

  // =========================================
  // SUMMARIES (Daily Totals) for the filtered participants
  // =========================================
  const totalBreakfast = participants.reduce((count, p) => {
    return (
      count +
      p.meals.filter((meal) => meal.type === "breakfast" && meal.status).length
    );
  }, 0);

  const totalLunch = participants.reduce((count, p) => {
    return (
      count +
      p.meals.filter((meal) => meal.type === "lunch" && meal.status).length
    );
  }, 0);

  const totalDinner = participants.reduce((count, p) => {
    return (
      count +
      p.meals.filter((meal) => meal.type === "dinner" && meal.status).length
    );
  }, 0);

  // const totalExcursion = participants.reduce((count, p) => {
  //   return count + p.excursions.filter((exc) => exc.status).length;
  // }, 0);

  // =========================================
  // Pagination + Tab Logic
  // =========================================
  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;

  // We filter out participants based on the current tab and the search term
  const currentParticipants = participants
    .filter((participant) => {
      // Match search term
      const fullName = `${
        participant.personalInformation?.fullName?.firstName || ""
      } ${
        participant.personalInformation?.fullName?.lastName || ""
      }`.toLowerCase();
      const institution =
        participant.personalInformation?.nameOfInstitution?.toLowerCase() || "";

      const matchesSearch =
        fullName.includes(searchTerm) || institution.includes(searchTerm);
      if (!matchesSearch) return false;

      // Tab-based filtering:
      // If currentTab = 0 => Show participants that have 'breakfast' in range
      // If currentTab = 1 => 'lunch', etc.
      if (currentTab === 0) {
        return participant.meals.some(
          (meal) => meal.type === "breakfast" && meal.status
        );
      } else if (currentTab === 1) {
        return participant.meals.some(
          (meal) => meal.type === "lunch" && meal.status
        );
      } else if (currentTab === 2) {
        return participant.meals.some(
          (meal) => meal.type === "dinner" && meal.status
        );
      } else if (currentTab === 3) {
        return participant.excursions.some((exc) => exc.status);
      }

      return false;
    })
    .slice(indexOfFirstParticipant, indexOfLastParticipant);

  // pagination event
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // tab event
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setCurrentPage(1);
  };

  // =========================================
  // PDF EXPORT (unchanged from your code)
  // =========================================
  const generatePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    // Title
    doc.setFontSize(14);
    doc.setTextColor(33, 37, 41);
    doc.text("Meals and Excursions Report", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(`Generated on: ${currentDate}`);
    doc.text(`Generated on: ${currentDate}`, pageWidth - textWidth - 14, 22);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 24, pageWidth - 14, 24);

    const tableColumn = ["Name", "Institution", "Meal Type", "Date"];
    const tableRows = [];

    participants.forEach((participant) => {
      const breakfast = participant.meals.find(
        (meal) => meal.type === "breakfast"
      );
      const lunch = participant.meals.find((meal) => meal.type === "lunch");
      const dinner = participant.meals.find((meal) => meal.type === "dinner");

      const participantData = [
        `${participant.personalInformation?.fullName?.firstName || ""} ${
          participant.personalInformation?.fullName?.lastName || ""
        }`,
        participant.personalInformation?.nameOfInstitution || "N/A",
        `Breakfast: ${breakfast?.status ? "Yes" : "No"}
Lunch: ${lunch?.status ? "Yes" : "No"}
Dinner: ${dinner?.status ? "Yes" : "No"}`,
        parseDate(breakfast?.date),
      ];

      tableRows.push(participantData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "striped",
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3,
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
        pageWidth - 20,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        "Energy Transition for Resilient and Low Carbon Economy Summit 2025",
        14,
        doc.internal.pageSize.height - 10
      );
    }

    doc.save(`meals_excursions_report_${currentDate.replace(/ /g, "_")}.pdf`);
  };

  // =========================================
  // EXCEL EXPORT (unchanged from your code)
  // =========================================
  const generateExcel = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    const ws = XLSX.utils.json_to_sheet(
      participants.map((participant) => ({
        Name: `${participant.personalInformation?.fullName?.firstName || ""} ${
          participant.personalInformation?.fullName?.lastName || ""
        }`,
        Institution:
          participant.personalInformation?.nameOfInstitution || "N/A",
        Breakfast: participant.meals.find((meal) => meal.type === "breakfast")
          ?.status
          ? "Yes"
          : "No",
        Lunch: participant.meals.find((meal) => meal.type === "lunch")?.status
          ? "Yes"
          : "No",
        Dinner: participant.meals.find((meal) => meal.type === "dinner")?.status
          ? "Yes"
          : "No",
        Excursion: participant.excursions.find((excursion) => excursion.status)
          ? "Yes"
          : "No",
        Date: parseDate(
          participant.meals.find((meal) => meal.type === "breakfast")?.date
        ),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Meals and Excursions");

    XLSX.utils.sheet_add_aoa(ws, [["Generated on:", currentDate]], {
      origin: -1,
    });

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `meals_excursions_report_${currentDate.replace(/ /g, "_")}.xlsx`
    );
  };

  // =========================================
  // HANDLE CHECKBOX (unchanged from your code)
  // =========================================
  const handleCheckboxChange = async (participantId, mealType) => {
    try {
      const participant = participants.find((p) => p._id === participantId);
      if (!participant) {
        console.error(`Participant with ID ${participantId} not found.`);
        toast.error("Participant not found.");
        return;
      }

      const validMealTypes = ["breakfast", "lunch", "dinner"];
      if (!validMealTypes.includes(mealType) && mealType !== "excursion") {
        console.error(`Invalid meal type: ${mealType}`);
        toast.error("Invalid meal type.");
        return;
      }

      let mealOrExcursion, updatedStatus;

      if (mealType === "excursion") {
        mealOrExcursion = participant.excursions[0];
        updatedStatus = !mealOrExcursion.status;
      } else {
        mealOrExcursion = participant.meals.find(
          (meal) => meal.type === mealType
        );
        if (!mealOrExcursion) {
          console.error(
            `Meal type ${mealType} not found for participant ${participantId}.`
          );
          toast.error("Meal type not found.");
          return;
        }
        updatedStatus = !mealOrExcursion.status;
      }

      await updateMealStatusApi(participantId, mealType, updatedStatus);

      setParticipants((prevParticipants) =>
        prevParticipants.map((p) =>
          p._id === participantId
            ? {
                ...p,
                meals: p.meals.map((meal) =>
                  meal.type === mealType
                    ? { ...meal, status: updatedStatus }
                    : meal
                ),
                excursions: p.excursions.map((excursion) =>
                  mealType === "excursion"
                    ? { ...excursion, status: updatedStatus }
                    : excursion
                ),
              }
            : p
        )
      );

      toast.success(
        `${
          mealType.charAt(0).toUpperCase() + mealType.slice(1)
        } status updated successfully.`
      );
    } catch (error) {
      console.error("Error updating meal status:", error);
      toast.error("Failed to update meal status.");
    }
  };

  return (
    <>
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-3">
        Manage Meals and Excursions
      </h1>

      {/* (B) NEW DATE RANGE PICKER */}
      <div className="flex items-center space-x-4 mb-4 text-gray-500">
        {/* START DATE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="h-5 w-5 text-gray-500 absolute top-1/2 left-3 transform -translate-y-1/2 pointer-events-none" />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              maxDate={endDate || null}
              placeholderText="Select From Date"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 focus:border-indigo-300"
            />
          </div>
        </div>

        {/* END DATE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <div className="relative text-gray-500">
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate || null}
              placeholderText="Select To Date"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 focus:border-indigo-300"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="w-full max-w bg-white p-5 rounded-lg shadow-lg">
            {/* SUMMARY/STATISTICS SECTION */}
            <div className="my-4 p-4 border rounded-md bg-gray-50">
              {/* Grid with 4 summary "cards" */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Breakfast Card */}
                <div className="bg-white shadow-sm rounded-md p-4 flex items-center">
                  <FaMugHot className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Breakfast</p>
                    <p className="text-lg font-bold text-black">
                      {totalBreakfast}
                    </p>
                  </div>
                </div>

                {/* Lunch Card */}
                <div className="bg-white shadow-sm rounded-md p-4 flex items-center">
                  <FaUtensilSpoon className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Lunch</p>
                    <p className="text-lg font-bold text-black">{totalLunch}</p>
                  </div>
                </div>

                {/* Dinner Card */}
                <div className="bg-white shadow-sm rounded-md p-4 flex items-center">
                  <FaUtensils className="h-6 w-6 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Dinner</p>
                    <p className="text-lg font-bold text-black">
                      {totalDinner}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TABS */}
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              className="mb-4"
            >
              <Tab
                icon={<FaMugHot className="h-5 w-5" />}
                label={`Breakfast (${participants.reduce(
                  (count, p) =>
                    count +
                    p.meals.filter(
                      (meal) => meal.type === "breakfast" && meal.status
                    ).length,
                  0
                )})`}
              />
              <Tab
                icon={<FaUtensilSpoon className="h-5 w-5" />}
                label={`Lunch (${participants.reduce(
                  (count, p) =>
                    count +
                    p.meals.filter(
                      (meal) => meal.type === "lunch" && meal.status
                    ).length,
                  0
                )})`}
              />
              <Tab
                icon={<FaUtensils className="h-5 w-5" />}
                label={`Dinner (${participants.reduce(
                  (count, p) =>
                    count +
                    p.meals.filter(
                      (meal) => meal.type === "dinner" && meal.status
                    ).length,
                  0
                )})`}
              />
              {/* <Tab
                icon={<MapIcon className="h-5 w-5" />}
                label={`Excursion (${participants.reduce(
                  (count, p) =>
                    count + p.excursions.filter((exc) => exc.status).length,
                  0
                )})`}
              /> */}
            </Tabs>

            {/* SEARCH BOX */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or institution"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border text-gray-600">
                <thead className="bg-[#3051A0] border-b text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Institution</th>
                    <th className="py-3 px-6 text-center">
                      {currentTab === 0 && "Breakfast"}
                      {currentTab === 1 && "Lunch"}
                      {currentTab === 2 && "Dinner"}
                      {currentTab === 3 && "Excursion"}
                    </th>
                    <th className="py-3 px-6 text-center">Date/Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentParticipants.length > 0 ? (
                    currentParticipants.map((participant) => {
                      let status, date;
                      if (currentTab === 0) {
                        const meal = participant.meals.find(
                          (meal) => meal.type === "breakfast"
                        );
                        status = meal?.status;
                        date = meal?.date;
                      } else if (currentTab === 1) {
                        const meal = participant.meals.find(
                          (meal) => meal.type === "lunch"
                        );
                        status = meal?.status;
                        date = meal?.date;
                      } else if (currentTab === 2) {
                        const meal = participant.meals.find(
                          (meal) => meal.type === "dinner"
                        );
                        status = meal?.status;
                        date = meal?.date;
                      } else if (currentTab === 3) {
                        const excursion = participant.excursions.find(
                          (excursion) => excursion.status && excursion.date
                        );
                        status = excursion?.status;
                        date = excursion?.date;
                      }

                      return (
                        <tr key={participant._id} className="border-b">
                          <td className="py-3 px-6">
                            {`${
                              participant.personalInformation?.fullName
                                ?.firstName || ""
                            } ${
                              participant.personalInformation?.fullName
                                ?.lastName || ""
                            }`}
                          </td>
                          <td className="py-3 px-6">
                            {participant.personalInformation
                              ?.nameOfInstitution || "N/A"}
                          </td>
                          <td className="py-3 px-6 text-center">
                            <input
                              type="checkbox"
                              checked={!!status}
                              onChange={() =>
                                handleCheckboxChange(
                                  participant._id,
                                  currentTab === 0
                                    ? "breakfast"
                                    : currentTab === 1
                                    ? "lunch"
                                    : currentTab === 2
                                    ? "dinner"
                                    : "excursion"
                                )
                              }
                              className="cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-6 text-center">
                            {date ? parseDate(date) : "N/A"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-4 text-center text-gray-600"
                      >
                        No participants found for this date range (and search
                        criteria).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <Stack spacing={2} className="mt-4">
              <Pagination
                count={Math.ceil(
                  participants.filter((p) => {
                    // Reuse the same filter logic as above but without pagination
                    const fullName = `${
                      p.personalInformation?.fullName?.firstName || ""
                    } ${
                      p.personalInformation?.fullName?.lastName || ""
                    }`.toLowerCase();
                    const institution =
                      p.personalInformation?.nameOfInstitution?.toLowerCase() ||
                      "";
                    if (
                      !(
                        fullName.includes(searchTerm) ||
                        institution.includes(searchTerm)
                      )
                    )
                      return false;

                    if (currentTab === 0) {
                      return p.meals.some(
                        (meal) => meal.type === "breakfast" && meal.status
                      );
                    } else if (currentTab === 1) {
                      return p.meals.some(
                        (meal) => meal.type === "lunch" && meal.status
                      );
                    } else if (currentTab === 2) {
                      return p.meals.some(
                        (meal) => meal.type === "dinner" && meal.status
                      );
                    } else if (currentTab === 3) {
                      return p.excursions.some((excursion) => excursion.status);
                    }
                    return false;
                  }).length / participantsPerPage
                )}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>

            {/* EXPORT BUTTONS */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={generatePDF}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 flex items-center"
              >
                <FaFilePdf className="mr-2" />
                Download PDF
              </button>
              <button
                onClick={generateExcel}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 flex items-center"
              >
                <FaFileExcel className="mr-2" />
                Download Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MealsExcursionsAdmin;
