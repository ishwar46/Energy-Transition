import React from "react";
import logo from "../../assets/acsic.png";
import useDocumentTitle from "../../components/DocTitle";

const ImportantNotice = () => {
  useDocumentTitle("Terms & Conditions - ACSIC Conference");

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="relative container mx-auto px-4 mt-10 mb-10">
        <div
          className="absolute inset-0 flex justify-center items-center opacity-10 z-0"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            opacity: 0.1,
          }}
        ></div>
        <div
          className="text-3xl font-bold text-blue-800 pt-5 text-center mb-5"
          style={{ animation: "fadeIn 2s ease-out" }}
        >
          Terms and Conditions for the 36th ACSIC Conference Registration
        </div>
        <div className="text-right mb-4">
          <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <i className="fa fa-download" aria-hidden="true"></i>
          </button>
        </div>

        <div
          className="bg-transparent rounded-lg p-6 mb-10"
          style={{ animation: "slideUp 0.8s ease-out forwards" }}
        >
          <div className="bg-transparent rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Registration Fees/Duration Guidelines:
            </h2>
            <ul className="list-disc pl-5 list-outside font-semi-bold text-gray-600">
              <li>
                The registration fee for the conference is
                <span className="text-bold text-blue-500"> $300 USD </span> per
                participant.
              </li>
              <li>
                Registration for the conference is open from{" "}
                <span className="text-bold text-blue-500">
                  {" "}
                  May 16 to July 15, 2024{" "}
                </span>
                .
              </li>
            </ul>
          </div>
          <div className="bg-transparent rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Photo Upload Guidelines:
            </h2>
            <ul className="list-disc pl-5 list-outside text-gray-600">
              <li>
                Please submit your photo in JPEG or PNG format with at least 300
                DPI and a minimum size of 800 x 800 pixels in portrait
                orientation with a solid or neutral color background.
              </li>
              <li>
                Kindly ensure that the image file size does not exceed 5MB.
              </li>
              <li>
                Also kindly maintain a neutral/natural facial expression/smile
                in a professional or business attire, such as a suit or a
                collared shirt/blouse.
              </li>
              <li>
                And save the photo file with your full name and organization,
                e.g., "Ruchi_Stha_ABC_Organization.jpg".
              </li>
            </ul>
          </div>

          <div className="bg-transparent rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Biography Guidelines:
            </h2>
            <li className="text-red-600">
              <strong>Note:</strong> Biography is required for the Chief
              Delegate only.
            </li>
            <ul className="list-disc pl-5 list-outside text-gray-600">
              <li>
                Biography should be in English language between 100 and 150
                words, including your full name, current position, organization,
                mentioning your highest level of education and any relevant
                degrees or certifications.
              </li>
              <li>
                Describe your area(s) of expertise, any noteworthy contributions
                to your field, affiliations or professional memberships that are
                relevant. A statement describing your interests or hobbies on a
                personal level is also welcome. Additionally, write your
                biography as though someone else is describing you.
              </li>
              <li>
                Upload or write your biography in the given textfield or upload
                PDF file in registration form with your full name and
                organization, e.g., "Ruchi_Stha_ABC_Organization.pdf".
              </li>
            </ul>
          </div>

          <div className="bg-transparent rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Cancellation Policy:
            </h2>
            <ul className="list-decimal pl-5 list-outside text-gray-600">
              <li>
                All cancellation requests must be submitted in writing to{" "}
                <a
                  href="mailto:secretariat@acsicnepal.com"
                  className="text-blue-500 hover:underline"
                >
                  secretariat@acsicnepal.com
                </a>
              </li>
              <li>
                Cancellation requests received before{" "}
                <span className="text-bold text-blue-500"> June 30, 2024 </span>{" "}
                will receive a full refund.
              </li>
              <li>
                Cancellation requests received between{" "}
                <span className="text-bold text-blue-500">
                  {" "}
                  July 1 - July 31, 2024{" "}
                </span>{" "}
                will be subject to a 50% administration and cancellation fee.
              </li>
              <li>
                No refunds will be issued for cancellation requests received
                after{" "}
                <span className="text-bold text-blue-500"> August 1, 2024</span>
                . However, you may transfer your registration to another
                participant by notifying us in writing.
              </li>
              <li>
                In the event of unforeseen circumstances, such as extreme
                weather, natural disasters, or a global health crisis, the
                organizers reserve the right to cancel the conference. In such
                cases, a full or partial refund may be provided at the
                discretion of the organizers, with consideration given to
                non-refundable expenses incurred.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportantNotice;
