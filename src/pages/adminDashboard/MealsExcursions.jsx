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
  CakeIcon,
  BeakerIcon,
  MapIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { FaFilePdf, FaFileExcel, FaCalendarAlt } from "react-icons/fa";
import useDocumentTitle from "../../components/DocTitle";
import DatePicker from "react-datepicker";

const MealsExcursionsAdmin = () => {
  useDocumentTitle("Manage Meals and Excursions - Uranus Event Management");

  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [participantsPerPage] = useState(10);
  const [currentTab, setCurrentTab] = useState(0);

  //For Date Wise Filter
  const [selectDate, setSelectDate] = useState(null);

  const handleDateChange = (date) => {
    const isoDate = date.toISOString();
    setSelectDate(isoDate);
    console.log("Selected Date is", isoDate);
    filterDataByDate(isoDate);
  };

  const filterDataByDate = async (selectedDate) => {
    try {
      const response = await getMealsAndExcursionsApi();
      const participantsWithMeals = response.data.participants.map(
        (participant) => ({
          ...participant,
          meals: participant.meals || [],
          excursions: participant.excursions || [],
        })
      );
      const filteredParticipants = participantsWithMeals.filter(
        (participant) => {
          let valid = false;

          // Check if the date matches with any of the meal or excursion dates
          participant.meals.forEach((meal) => {
            if (
              meal.date &&
              new Date(meal.date).toISOString().split("T")[0] ===
                selectedDate.split("T")[0]
            ) {
              valid = true;
            }
          });

          participant.excursions.forEach((excursion) => {
            if (
              excursion.date &&
              new Date(excursion.date).toISOString().split("T")[0] ===
                selectedDate.split("T")[0]
            ) {
              valid = true;
            }
          });

          return valid;
        }
      );

      console.log("Filtered Participants:", filteredParticipants);

      setParticipants(filteredParticipants);
    } catch (error) {
      console.error("Error fetching meals and excursions:", error);
      toast.error("Failed to fetch participants.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    setSelectDate(today.toISOString());
    filterDataByDate(today.toISOString());
  }, []);

  // 1) Helper to check if a date (string) is today's date
  const isToday = (dateString) => {
    if (!dateString) return false;
    const dateObj = new Date(dateString);
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  };

  // 2) Show current date/time at the top (optional)
  const currentDateTimeString = new Date().toLocaleString();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

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

  // 3) Filter participants for the current page
  //    Only show participants whose relevant meal/excursion is on *today's* date.
  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;

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

      // Only show if there is data for today's date
      if (currentTab === 0) {
        const meal = participant.meals.find((m) => m.type === "breakfast");
        return meal?.date && isToday(meal.date);
      } else if (currentTab === 1) {
        const meal = participant.meals.find((m) => m.type === "lunch");
        return meal?.date && isToday(meal.date);
      } else if (currentTab === 2) {
        const meal = participant.meals.find((m) => m.type === "dinner");
        return meal?.date && isToday(meal.date);
      } else if (currentTab === 3) {
        const excursion = participant.excursions.find((ex) => ex.date);
        return excursion?.date && isToday(excursion.date);
      }
      return false;
    })
    .slice(indexOfFirstParticipant, indexOfLastParticipant);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

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
      // const excursion = participant.excursions.find((exc) => exc.status);

      const participantData = [
        `${participant.personalInformation?.fullName?.firstName || ""} ${
          participant.personalInformation?.fullName?.lastName || ""
        }`,
        participant.personalInformation?.nameOfInstitution || "N/A",
        `Breakfast: ${breakfast?.status ? "Yes" : "No"}
        Lunch: ${lunch?.status ? "Yes" : "No"}
        Dinner: ${dinner?.status ? "Yes" : "No"}
        `,
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
        prevParticipants.map((participant) =>
          participant._id === participantId
            ? {
                ...participant,
                meals: participant.meals.map((meal) =>
                  meal.type === mealType
                    ? { ...meal, status: updatedStatus }
                    : meal
                ),
                excursions: participant.excursions.map((excursion) =>
                  mealType === "excursion"
                    ? { ...excursion, status: updatedStatus }
                    : excursion
                ),
              }
            : participant
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
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-3">
        Manage Meals and Excursions
      </h1>

      {/* Display current date/time somewhere in your UI */}
      <p className="mb-2 text-gray-700">
        Current date/time: {currentDateTimeString}
      </p>

      <div className="relative">
        <DatePicker
          placeholderText="Select Date"
          selected={selectDate}
          onChange={handleDateChange}
          className="block w-full p-1 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
        />
        <FaCalendarAlt className="absolute left-3 top-2 text-black" />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="w-full max-w bg-white p-5 rounded-lg shadow-lg">
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              className="mb-4"
            >
              <Tab
                icon={<FolderOpenIcon className="h-5 w-5" />}
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
                icon={<CakeIcon className="h-5 w-5" />}
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
                icon={<BeakerIcon className="h-5 w-5" />}
                label={`Dinner (${participants.reduce(
                  (count, p) =>
                    count +
                    p.meals.filter(
                      (meal) => meal.type === "dinner" && meal.status
                    ).length,
                  0
                )})`}
              />
              <Tab
                icon={<MapIcon className="h-5 w-5" />}
                label={`Excursion (${participants.reduce(
                  (count, p) =>
                    count +
                    p.excursions.filter((excursion) => excursion.status).length,
                  0
                )})`}
              />
            </Tabs>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or institution"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
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
                        No participants found for today's date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <Stack spacing={2} className="mt-4">
              <Pagination
                count={Math.ceil(
                  // We must recalculate how many participants match the filter
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
                    const matchesSearch =
                      fullName.includes(searchTerm) ||
                      institution.includes(searchTerm);

                    if (!matchesSearch) return false;

                    if (currentTab === 0) {
                      const meal = p.meals.find((m) => m.type === "breakfast");
                      return meal?.date === selectDate;
                    } else if (currentTab === 1) {
                      const meal = p.meals.find((m) => m.type === "lunch");
                      return meal?.date && selectDate;
                    } else if (currentTab === 2) {
                      const meal = p.meals.find((m) => m.type === "dinner");
                      return meal?.date && selectDate;
                    } else if (currentTab === 3) {
                      const excursion = p.excursions.find((ex) => ex.date);
                      return excursion?.date && selectDate;
                    }
                    return false;
                  }).length / participantsPerPage
                )}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
            {/* Buttons to generate PDF and Excel */}
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
