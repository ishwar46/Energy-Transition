import React, { useRef, useState } from "react";
import institutions from "../../data/institution";
import dcgfimg from "../../assets/images/dcgffullogo.jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import GenerateReceiptForInstitution from "./GenerateReceiptForInstitution";

const GenerateReceipt = () => {
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [accompanyPersonFullName, setAccompanyPersonFullName] = useState("");
  const [email, setEmail] = useState("");
  const [officeAddress, setOfficeAddres] = useState("");
  const [role, setRole] = useState("");
  const [invoice, setInvoice] = useState(null);
  const invoiceRef = useRef();

  const formatDate = (date) => {
    const options = { weekday: "long", year: "numeric", month: "long" };
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    return `${date.toLocaleDateString(
      "en-US",
      options
    )} ${day}${suffix}, ${date.getFullYear()}`;
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const handleDownloadPdf = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      allowTaint: true,
      useCORS: true,
    });
    const imageData = canvas.toDataURL("image/jpeg", 1);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imageData, "JPEG", 0, 0, canvas.width, canvas.height);

    const filename = `${selectedInstitution || "invoice"}.pdf`;
    pdf.save(filename);
  };

  const generateInvoiceNumber = () => {
    return (
      "ACSICNEP#" +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(6, "0")
    );
  };

  let accompanypersonaValue = 0;
  if (accompanyPersonFullName) {
    accompanypersonaValue = 1;
  }

  let participantValue = 0;
  if (participantName) {
    participantValue = 1;
  }

  const handleGenerateReceipt = async () => {
    const conferenceFee = 300;
    const totalAmount =
      (accompanypersonaValue + participantValue) * conferenceFee;
    const invoiceNumber = generateInvoiceNumber();

    const institution = institutions.find(
      (inst) => inst.name === selectedInstitution
    );

    const newInvoice = {
      institution: institution?.name || "?",
      participantName: participantName || "N/A",
      accompanyPersonFullName: accompanyPersonFullName || "N/A",
      email: email || "N/A",
      officeAddress: officeAddress || "N/A",
      conferenceFee,
      role,
      totalAmount,
      invoiceNumber,
      date: formatDate(new Date()),
    };
    setInvoice(newInvoice);
  };

  return (
    <>
      <div className="text-2xl font-bold text-start mb-4 text-black mt-2">
         Receipt For Individual
      </div>
      <div className="mt-5 p-5 border border-gray-200 rounded-md bg-white shadow-sm">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">
              Select Institution
            </label>
            <select
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
            >
              <option value="" disabled>
                Select an institution
              </option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.name}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">
              Name of Participants
            </label>
            <input
              type="text"
              placeholder="Enter name of participants"
              onChange={(e) => setParticipantName(e.target.value)}
              className=" w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
            />
          </div>
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="text-gray-700 text-sm font-medium">
              Accompany Person Fullname
            </label>
            <input
              type="text"
              placeholder="Enter Accompany person fullname"
              onChange={(e) => setAccompanyPersonFullName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md shadow-sm text-gray-900 focus:ring focus:ring-opacity-50 focus:ring-indigo-300"
            />
          </div>
          <div className="flex-1">
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md shadow-sm text-gray-900 focus:ring focus:ring-opacity-50 focus:ring-indigo-300"
            />
          </div>
        </div>
        <div className="flex space-x-5 items-center mb-4">
          <div className="w-1/2">
            <label className="text-gray-700 text-sm font-medium">
              Office Address
            </label>
            <input
              type="address"
              placeholder="Enter your address"
              onChange={(e) => setOfficeAddres(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md shadow-sm text-gray-900 focus:ring focus:ring-opacity-50 focus:ring-indigo-300"
            />
          </div>
          <div className="flex items-center justify-center mt-5">
            <span className="ml-2 text-black font-bold mr-4">
              Choose Any one
            </span>
            <input
              type="radio"
              name="role"
              value="chiefdelegate"
              checked={role === "chiefdelegate"}
              onChange={() => setRole("chiefdelegate")}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700 mr-4">Chief Delegate</span>
            <input
              type="radio"
              name="role"
              value="participants"
              checked={role === "participants"}
              onChange={() => setRole("participants")}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Participants</span>
          </div>
        </div>
        <div>
          <button
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            onClick={handleGenerateReceipt}
          >
            Generate Receipt
          </button>
        </div>
      </div>
      <GenerateReceiptForInstitution/>
      {invoice && (
        <>
          <div
            ref={invoiceRef}
            className="mt-10 p-5 border border-gray-200 rounded-md  shadow-lg tear text-indigo-600"
          >
            <div className="flex flex-col items-center mb-4">
              <img
                src={dcgfimg}
                alt="Conference Logo"
                className="w-30 h-20 mb-4"
              />
              <h2 className="text-3xl font-bold text-indigo-600">Receipt</h2>
            </div>
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xl font-bold text-indigo-600">
                  Receipt Number: {invoice.invoiceNumber}
                </p>
                <p className="text-gray-900">
                  <strong>Receipt Date:</strong> {invoice.date}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-900">
                <strong>Billed To:</strong> {invoice.institution}
              </p>
              <p className="text-gray-900">
                <strong>Participants Name:</strong> {invoice.participantName}
              </p>
              <p className="text-gray-900">
                <strong>Email:</strong> {invoice.email}
              </p>
              <p className="text-gray-900">
                <strong>Office Address:</strong> {invoice.officeAddress}
              </p>
            </div>
            <table className="w-full mb-4 border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-100 text-gray-900">
                    Description
                  </th>
                  <th className="border border-gray-300 p-2 bg-gray-100 text-gray-900">
                    Unit Cost
                  </th>
                  <th className="border border-gray-300 p-2 bg-gray-100 text-gray-900">
                    Quantity
                  </th>
                  <th className="border border-gray-300 p-2 bg-gray-100 text-gray-900">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 text-gray-900">
                    Registration Fee for 36th ACSIC Conference Nepal
                  </td>
                  <td className="border border-gray-300 p-2 text-gray-900">
                    ${invoice.conferenceFee}
                  </td>
                  <td className="border border-gray-300 p-2 text-gray-900">
                    {invoice.accompanyPersonFullName && invoice.participantName
                      ? accompanypersonaValue + participantValue
                      : invoice.accompanyPersonFullName
                      ? accompanypersonaValue
                      : invoice.participantName
                      ? participantValue
                      : "NA"}
                  </td>
                  <td className="border border-gray-300 p-2 text-gray-900">
                    ${invoice.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-900">
                  <strong>Sub Total:</strong> ${invoice.totalAmount}
                </p>
                <p className="text-green-500">
                  <strong>Total Amount Due:</strong> ${invoice.totalAmount}
                </p>
              </div>
            </div>

            <div>
              <h1 className="font-bold mt-4 text-xl text-blue-600">
                {role === "chiefdelegate" ? "Chief Delegate" : "Participant"}
              </h1>
              <strong className="ml-2">{invoice.participantName}</strong>
            </div>
            <div>
              <h1 className="font-bold mt-4 text-xl text-blue-600">
                Accompany Person
              </h1>
              <strong className="ml-2">
                {invoice.accompanyPersonFullName}
              </strong>
            </div>

            <div className="mt-4 text-gray-900">
              <strong className="text-green-600">
                Thank you for your payment.. we truly appreciate your promptness
                and partnership.
              </strong>
            </div>
            <div className="mt-4 text-center border-t border-gray-300 pt-4">
              <p className="text-gray-900">
                Deposit & Credit Guarantee Fund (DCGF)
              </p>
              <p className="text-gray-900">Tangal-05, Kathmandu 44600, Nepal</p>
              <p className="text-gray-900">+977 01-4521241/4510659/4510127</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Download PDF
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default GenerateReceipt;
