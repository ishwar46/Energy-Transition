import React, { useEffect, useRef, useState } from "react";
import institutions from "../../data/institution";
import dcgfimg from "../../assets/images/dcgffullogo.jpg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getNamesbyInstitutionApi } from "../../apis/Api";

const GenerateReceiptForInstitution = () => {
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [participants, setParticipants] = useState(1);
  const [email, setEmail] = useState("");
  const [officeAddress, setOfficeAddres] = useState("");
  const [invoice, setInvoice] = useState(null);
  const invoiceRef = useRef();
  const [chiefDelegates, setChiefDelegates] = useState([]);
  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    const fetchUserofSelectedInstitution = async () => {
      if (selectedInstitution) {
        try {
          const userbyInstitution = await getNamesbyInstitutionApi(
            selectedInstitution
          );
          const data = userbyInstitution.data;
          // //console.log("Users data:", data);
          const chiefDelegatesData = data.filter(
            (user) => user.chiefDelegateOrSpeaker.chiefDelegate
          );
          const speakersData = data.filter(
            (user) => user.chiefDelegateOrSpeaker.participant
          );
          // //console.log("Chief Delegates:", chiefDelegatesData);
          // //console.log("Speakers:", speakersData);
          setChiefDelegates(chiefDelegatesData);
          setSpeakers(speakersData);
          setParticipants(chiefDelegatesData.length + speakersData.length);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    fetchUserofSelectedInstitution();
    // //console.log(JSON.stringify(fetchUserofSelectedInstitution()))
  }, [selectedInstitution]);

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

  const handleGenerateReceipt = async () => {
    const conferenceFee = 300;
    const totalAmount = participants * conferenceFee;
    const invoiceNumber = generateInvoiceNumber();

    const institution = institutions.find(
      (inst) => inst.name === selectedInstitution
    );

    const newInvoice = {
      institution: institution?.name || "?",
      email: email || "N/A",
      officeAddress: officeAddress || "N/A",
      participants,
      conferenceFee,
      totalAmount,
      invoiceNumber,
      date: formatDate(new Date()),
    };
    setInvoice(newInvoice);

    // //console.log("Generated Receipt:", JSON.stringify(newInvoice, null, 2));
  };
  return (
    <>
      <div className="text-2xl font-bold text-start mb-4 text-black pt-5">
        Receipt For Institution
      </div>
      <div className="mt-5 p-5 border border-gray-200 rounded-md bg-white shadow-sm">
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">
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
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Number of Participants
          </label>
          <input
            type="number"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            min="1"
            readOnly
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Office Address
          </label>
          <input
            type="text"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
            value={officeAddress}
            onChange={(e) => setOfficeAddres(e.target.value)}
            placeholder="Enter office address"
          />
        </div>
        <div>
          <button
            onClick={handleGenerateReceipt}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Generate Receipt
          </button>
        </div>
      </div>
      {invoice && (
        <>
          <div
            ref={invoiceRef}
            className="mt-10 p-5 border border-gray-200 rounded-md shadow-lg tear text-indigo-600"
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
                    {invoice.participants}
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
                <p className="text-red-500">
                  <strong>Total Amount Due:</strong> ${invoice.totalAmount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-900">
                  <strong>Due Date:</strong> {invoice.dueDate}
                </p>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="text-lg font-bold mb-4">Chief Delegates</h2>
              {chiefDelegates.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2 bg-gray-100 text-gray-900">
                        Name
                      </th>
                      <th className="border border-gray-300 p-2 bg-gray-100 text-gray-900">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chiefDelegates.map((delegate) => (
                      <tr key={delegate._id}>
                        <td className="border border-gray-300 p-2">
                          {delegate.personalInformation.fullName.firstName}{" "}
                          {delegate.personalInformation.fullName.lastName}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {delegate.personalInformation.emailAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>N/A</p>
              )}
              <h2 className="text-lg font-bold mt-8 mb-4">Participants</h2>
              {speakers.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2 bg-gray-100 text-gray-900">
                        Name
                      </th>
                      <th className="border border-gray-300 p-2 bg-gray-100 text-gray-900">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {speakers.map((speaker) => (
                      <tr key={speaker._id}>
                        <td className="border border-gray-300 p-2">
                          {speaker.personalInformation.fullName.firstName}{" "}
                          {speaker.personalInformation.fullName.lastName}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {speaker.personalInformation.emailAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>N/A</p>
              )}
            </div>

            <div className="mt-4 py-4 text-gray-900">
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

export default GenerateReceiptForInstitution;
