import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createEventWithPDF,
  deleteEventWithPDF,
  getAllEventWithPDF,
  updateEventWithPDF,
} from "../../apis/Api";
import { MdDelete, MdEdit } from "react-icons/md";
import useDocumentTitle from "../../components/DocTitle";

const DayWiseEvent = () => {
  useDocumentTitle(" Day Wise Event With PDF - International Youth Camp 2025");

  const [allEventWithPdf, setAllEventWithPdf] = useState([]);
  const [formData, setFormData] = useState({
    day: "",
    date: "",
    title: "",
    // pdf: null,
  });
  const [editingPdfWithTitle, seteditingPdfWithTitle] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // const handlePdfChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   setFormData({ ...formData, pdf: selectedFile });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("day", formData.day);
    data.append("date", formData.date);
    data.append("title", formData.title);

    // if (formData.pdf) {
    //   data.append("pdf", formData.pdf);
    // }

    try {
      if (editingPdfWithTitle) {
        const res = await updateEventWithPDF(editingPdfWithTitle, data);
        if (res.status === 200 || res.status === 201) {
          toast.success("Event updated successfully");
          seteditingPdfWithTitle(null);
        } else {
          toast.error("Failed to update PDF with title");
        }
      } else {
        const res = await createEventWithPDF(data);
        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message);
        }
      }
      setFormData({
        day: "",
        date: "",
        title: "",
        // pdf: null,
      });
      fetchAllEventWithPdf();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`${error.response.data.message}`);
      } else {
        toast.error(`${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchAllEventWithPdf();
  }, []);

  const fetchAllEventWithPdf = async () => {
    try {
      const res = await getAllEventWithPDF();
      // console.log(res.data)
      setAllEventWithPdf(res.data.allEventWithPDF);
    } catch (error) {
      toast.error("Unable to Fetch All Event");
    }
  };

  // const getSelectedPDF = (pdfUrl) => {
  //   // if (pdfUrl) {
  //   //     window.open(
  //   //         `https://energy-transition-api.onrender.com/${pdfUrl}`,
  //   //         "_blank"
  //   //     );
  //   // }
  //   if (pdfUrl) {
  //     window.open(`https://energy-transition-api.onrender.com/${pdfUrl}`, "_blank");
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      const res = await deleteEventWithPDF(id);
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message);
        fetchAllEventWithPdf();
      }
    } catch (error) {
      toast.error(`Unable to delete due to ${error}`);
    }
  };
  const handleEdit = async (event) => {
    console.log(event);
    try {
      // const res = await deleteEventWithPDF(id);
      // if (res.status === 200 || res.status === 201) {
      //   toast.success(res.data.message);
      //   fetchAllEventWithPdf();
      // }
      seteditingPdfWithTitle(event._id);
      setFormData({
        day: event.day || "",
        date: event.date || "",
        title: event.title || "",
        // pdf: pdf.pdf || "",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(`Unable to edit due to ${error}`);
    }
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-start mb-4 text-black mt-2">
        Add Day Wise Event With PDF
      </h2>
      <div className="mt-2 p-2 rounded-lg w-full text-black">
        <form
          className="w-full max p-2 text-black shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="w-full mb-2">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Event Day
              </label>
              <input
                type="text"
                name="day"
                placeholder="* Day"
                autoComplete="title"
                onChange={handleChange}
                value={formData.day}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="w-full mb-2">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Event Full date
              </label>
              <input
                type="text"
                name="date"
                placeholder="* Full Date"
                autoComplete="title"
                onChange={handleChange}
                value={formData.date}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="w-full mb-4 mt-2">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="* title"
              autoComplete="title"
              onChange={handleChange}
              value={formData.title}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-semibold text-gray-700">
              Upload PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-500"
            />
          </div> */}
          <button
            type="submit"
            className="w-full p-3 mt-5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            {editingPdfWithTitle
              ? "Update Day Wise Event"
              : " Add Day Wise Event"}
          </button>
        </form>

        <div className="overflow-x-auto mt-8 text-black">
          <table className="min-w-full leading-normal shadow-md bg-transparent  border-black">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-l-sm text-xs uppercase tracking-wider">
                  SN
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider hidden md:block">
                  Day
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                  Date and Time
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                  Title
                </th>
                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                  PDF
                </th> */}
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allEventWithPdf.length > 0 &&
                allEventWithPdf.map((event, index) => (
                  <tr key={event._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                      {event.day}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                      {event.date}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                      {event.title}
                    </td>
                    {/* <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                      <button
                        onClick={() => getSelectedPDF(event.pdf)}
                        className="p-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded flex items-center"
                      >
                        {" "}
                        {event.pdf !== null ? (
                          <img
                            src={pdfIcon}
                            alt="Export to PDF"
                            className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5"
                          />
                        ) : (
                          <>
                            <h1>NA</h1>
                          </>
                        )}
                      </button>
                    </td> */}
                    <td className="border p-2">
                      <button
                        className="text-blue-500"
                        onClick={() => handleEdit(event)}
                      >
                        <MdEdit size={25} />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-500 ml-2"
                      >
                        <MdDelete size={25} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DayWiseEvent;
