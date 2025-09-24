import React, { useState, useEffect, useCallback } from "react";
import {
  uploadEventPdfApi,
  getEventPdfsApi,
  deleteEventPdfApi,
  uploadExcursionPdfApi,
  getExcursionPdfsApi,
  deleteExcursionPdfApi,
} from "../../apis/Api";
import toast from "react-hot-toast";
import useDocumentTitle from "../../components/DocTitle";

const PdfManagement = () => {
  useDocumentTitle("Manage PDFs - Uranus Event Management");

  const [pdfs, setPdfs] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isExcursion, setIsExcursion] = useState(false);

  // Define fetchPdfs using useCallback
  const fetchPdfs = useCallback(async () => {
    try {
      if (isExcursion) {
        const response = await getExcursionPdfsApi();
        if (response.data.success) {
          setPdfs(response.data.files);
        }
      } else {
        const response = await getEventPdfsApi();
        if (response.data.success) {
          setPdfs(response.data.files);
        }
      }
    } catch (error) {
      toast.error("Error fetching PDFs.");
      console.error("Error fetching PDFs:", error);
    }
  }, [isExcursion]);

  useEffect(() => {
    fetchPdfs();
  }, [isExcursion, fetchPdfs]);

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
    setFileName(file ? file.name : "");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      toast.error("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfFile);

    try {
      if (isExcursion) {
        await uploadExcursionPdfApi(formData);
        toast.success("Excursion PDF uploaded successfully!");
      } else {
        await uploadEventPdfApi(formData);
        toast.success("Event PDF uploaded successfully!");
      }

      fetchPdfs();
      setPdfFile(null);
      setFileName("");
    } catch (error) {
      toast.error("Error uploading PDF.");
      console.error("Error uploading PDF:", error);
    }
  };

  const handleDelete = async (filename) => {
    try {
      if (isExcursion) {
        await deleteExcursionPdfApi(filename);
        toast.success("Excursion PDF deleted successfully!");
      } else {
        await deleteEventPdfApi(filename);
        toast.success("Event PDF deleted successfully!");
      }

      fetchPdfs();
    } catch (error) {
      toast.error("Error deleting PDF.");
      console.error("Error deleting PDF:", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-3">
        {isExcursion ? "Manage Excursion PDFs" : "Manage Event PDFs"}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Upload PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-500"
            />
            {fileName && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {fileName}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Upload PDF
          </button>
        </form>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg border">
        <h2 className="text-base font-medium text-gray-900 mb-3">
          List of PDFs
        </h2>
        {pdfs.length > 0 ? (
          <div className="space-y-2">
            {pdfs.map((pdf, index) => (
              <div
                key={pdf}
                className="bg-gray-50 border border-gray-200 p-3 rounded flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <i className="fas fa-file-pdf text-red-500 text-lg"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">
                      {pdf}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF Document #{index + 1}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={`https://api-energy.onrender.com/public/uploads/${
                      isExcursion ? "excursionPdfs" : "eventPdfs"
                    }/${pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(pdf)}
                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <i className="fas fa-file-pdf text-gray-400 text-4xl mb-3"></i>
            <p className="text-gray-500 text-sm">No PDFs uploaded yet</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setIsExcursion(!isExcursion)}
          className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
        >
          {isExcursion ? "Switch to Event PDFs" : "Switch to Excursion PDFs"}
        </button>
      </div>
    </>
  );
};

export default PdfManagement;
