import React, { useRef, useState } from "react";
import institutions from "../../data/institution";
import dcgfimg from "../../assets/images/uranuslogo.png";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "../../css/invoice.css";
import useDocumentTitle from "../../components/DocTitle";

const GenerateInvoiceIndividual = () => {
  useDocumentTitle("Generate Invoice Spouse - Uranus Event Management");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [accompanyPersonName, setAccompanyPersonName] = useState("");
  const [relation, setRelation] = useState("");
  const [showRelation, setShowRelation] = useState(false);
  const [email, setEmail] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [invoice, setInvoice] = useState(null);
  const invoiceRef = useRef();

  const handleGenerateInvoice = async () => {
    const accompanyFee = 300;
    const participantFee = 300;
    const totalAmount =
      participantFee + (accompanyPersonName ? accompanyFee : 0);
    const invoiceNumber = generateInvoiceNumber();

    const newInvoice = {
      participantName: participantName || "N/A",
      accompanyPersonName: accompanyPersonName || "",
      relation: relation || "",
      email: email || "N/A",
      officeAddress: officeAddress || "N/A",
      institution: selectedInstitution || "N/A",
      accompanyFee,
      participantFee,
      totalAmount,
      invoiceNumber,
      date: formatDate(new Date()),
      dueDate: formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
    };

    setInvoice(newInvoice);
  };

  const generateInvoiceNumber = () => {
    return (
      "ACSICNEP#" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
    );
  };

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

    const filename = `${participantName || "invoice"}.pdf`;
    pdf.save(filename);
  };

  return (
    <>
      <div className="text-2xl font-bold text-start mb-4 text-black pt-5">
        Generate Invoice for Individual
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
            Participant Name
          </label>
          <input
            type="text"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter participant name"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Name of Accompany Person
          </label>
          <input
            type="text"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
            value={accompanyPersonName}
            onChange={(e) => {
              setAccompanyPersonName(e.target.value);
              if (e.target.value) {
                setShowRelation(true);
              } else {
                setShowRelation(false);
                setRelation("");
              }
            }}
            onFocus={() => setShowRelation(true)}
            placeholder="Enter accompany person's name"
          />
        </div>
        {showRelation && (
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Relation
            </label>
            <input
              type="text"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 text-gray-900"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="Enter relation"
            />
          </div>
        )}
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
            onChange={(e) => setOfficeAddress(e.target.value)}
            placeholder="Enter office address"
          />
        </div>
        <div>
          <button
            onClick={handleGenerateInvoice}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Generate Invoice
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
              <h2 className="text-3xl font-bold text-indigo-600">Invoice</h2>
            </div>
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xl font-bold text-indigo-600">
                  Invoice Number: {invoice.invoiceNumber}
                </p>
                <p className="text-gray-900">
                  <strong>Invoiced Date:</strong> {invoice.date}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-900">
                <strong>Billed To:</strong> {invoice.participantName}
              </p>
              <p className="text-gray-900">
                <strong>Email:</strong> {invoice.email}
              </p>
              <p className="text-gray-900">
                <strong>Institution:</strong> {invoice.institution}
              </p>
              <p className="text-gray-900">
                <strong>Office Address:</strong> {invoice.officeAddress}
              </p>
              {invoice.accompanyPersonName && (
                <p className="text-gray-900">
                  <strong>Accompany Person:</strong>{" "}
                  {invoice.accompanyPersonName}
                </p>
              )}
              {invoice.relation && (
                <p className="text-gray-900">
                  <strong>Relation:</strong> {invoice.relation}
                </p>
              )}
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
                {invoice.participantName && (
                  <tr>
                    <td className="border border-gray-300 p-2 text-gray-900">
                      Individual Fee for 36th ACSIC Conference Nepal
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-900">
                      ${invoice.accompanyFee}
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-900">
                      1
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-900">
                      ${invoice.accompanyFee}
                    </td>
                  </tr>
                )}
                {invoice.accompanyPersonName && invoice.participantName && (
                  <tr>
                    <td className="border border-gray-300 p-2 text-gray-900">
                      Accompany Person Fee for 36th ACSIC Conference Nepal
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-900">
                      ${invoice.accompanyFee}
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-900">
                      1
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-900">
                      ${invoice.accompanyFee}
                    </td>
                  </tr>
                )}
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
            <div className="mt-4 text-gray-900">
              <p className="text-gray-900">
                <strong>Payment Method:</strong> SWIFT Payment
              </p>
              <p>
                Bank Name: Nabil Bank Limited
                <br />
                Account Name: Deposit and Credit Guarantee Fund
                <br />
                Account Number: 00201217505755
                <br />
                SWIFT Code: NARBNPKA
                <br />
                Bank Address: Nabil Centre, Beena Marga, Teendhara, Durbarmarg
                <br />
                Bank Phone Number: +977-1-5970015
              </p>
              <p>
                Please make the payment using the above SWIFT details and send
                the receipt to{" "}
                <a href="mailto:secretariat@dcgf.gov.np">
                  secretariat@dcgf.gov.np{" "}
                </a>
                and{" "}
                <a href="mailto:secretariat@acsicnepal.com">
                  secretariat@acsicnepal.com
                </a>
                .
              </p>
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

export default GenerateInvoiceIndividual;
