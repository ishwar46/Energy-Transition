import React, { useState, useEffect } from "react";
import { getAllSubscribersApi } from "../../apis/Api";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/loading.json";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";
import useDocumentTitle from "../../components/DocTitle";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const Queries = () => {
  useDocumentTitle("Manage Queries - Event Management");
  const [queries, setQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [queriesPerPage] = useState(10);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const response = await getAllSubscribersApi();
      setQueries(response.data.subscriptions || []);
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Error fetching queries.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredQueries = queries.filter(
    (query) =>
      query.fullname.toLowerCase().includes(searchTerm) ||
      query.email.toLowerCase().includes(searchTerm) ||
      query.message.toLowerCase().includes(searchTerm)
  );

  const indexOfLastQuery = currentPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
  const currentQueries = filteredQueries.slice(
    indexOfFirstQuery,
    indexOfLastQuery
  );

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
    doc.text("Queries Report", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 27, {
      align: "center",
    });

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(14, 30, pageWidth - 14, 30);

    const tableColumn = ["SN", "Full Name", "Email", "Message", "Date"];
    const tableRows = [];

    filteredQueries.forEach((query, index) => {
      const queryData = [
        index + 1,
        query.fullname,
        query.email,
        query.message,
        formatDate(query.createdAt),
      ];
      tableRows.push(queryData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: "striped",
      headStyles: {
        fillColor: [33, 150, 243],
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

    doc.save(`queries_report_${currentDate.replace(/ /g, "_")}.pdf`);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-3">
        Manage Queries
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="w-full max-w bg-transparent p-5 rounded-lg shadow-lg">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name, email, or message"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-transparent border text-gray-600">
                <thead className="bg-[#3051A0] border-b text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">SN</th>
                    <th className="py-3 px-6 text-left">Full Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Message</th>
                    <th className="py-3 px-6 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQueries.length > 0 ? (
                    currentQueries.map((query, index) => (
                      <tr key={query._id} className="border-b">
                        <td className="py-3 px-6">
                          {indexOfFirstQuery + index + 1}
                        </td>
                        <td className="py-3 px-6">{query.fullname}</td>
                        <td className="py-3 px-6">{query.email}</td>
                        <td className="py-3 px-6">{query.message}</td>
                        <td className="py-3 px-6">
                          {formatDate(query.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-4 text-center text-gray-600"
                      >
                        No queries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Stack spacing={2} className="mt-4">
              <Pagination
                count={Math.ceil(filteredQueries.length / queriesPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={generatePDF}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Queries;
