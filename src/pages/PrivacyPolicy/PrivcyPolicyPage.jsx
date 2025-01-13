import React from "react";
import jsPDF from "jspdf";
import useDocumentTitle from "../../components/DocTitle";
import logo from "../../assets/images/leologo.png";
import html2canvas from "html2canvas";

const PrivacyPolicy = () => {
  useDocumentTitle("Privacy Policy - Crown The Vision");

  const printDocument = () => {
    const input = document.getElementById("divToPrint");
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      logging: true,
      letterRendering: 1,
      allowTaint: false,
      windowHeight: input.scrollHeight,
      windowWidth: input.scrollWidth,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("privacy-policy.pdf");
    });
  };

  return (
    <>
      <div className="relative container mx-auto px-4 mt-10 mb-10">
        {/* Watermark logo */}
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

        {/* Title */}
        <div
          className="text-3xl font-bold text-blue-800 pt-5 text-center mb-5"
          style={{ animation: "fadeIn 2s ease-out" }}
        >
          Privacy Policy
        </div>

        {/* Subtitle */}
        <div
          className="text-xl font-semibold text-green-700 text-center mb-10"
          style={{ animation: "fadeIn 2s ease-out" }}
        >
          Please carefully review our updated Privacy Policy, which outlines how
          we handle your personal data and your rights under applicable laws.
        </div>

        {/* Download button */}
        <div className="text-right">
          <button
            onClick={printDocument}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5"
          >
            <i className="fa fa-download" aria-hidden="true"></i>
          </button>
        </div>

        {/* Content */}
        <div
          className="bg-transparent rounded-lg p-6 mb-10"
          style={{ animation: "slideUp 0.8s ease-out forwards" }}
        >
          <div id="divToPrint" className="grid grid-cols-1 gap-8">
            {/* Collection of Personal Information */}
            <div className="bg-transparent rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Collection of Personal Information
              </h2>
              <p className="text-gray-600">
                We collect personal information you voluntarily provide during
                registration and account setup. This information may include
                your name, email address, phone number, and organization. The
                data collected is crucial to facilitate your event participation
                and ensure you receive relevant updates and resources related to
                our services.
              </p>
            </div>

            {/* Use of Personal Information */}
            <div className="bg-transparent rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Use of Personal Information
              </h2>
              <p className="text-gray-600">
                We use the information we collect to process your registration,
                manage payments, and send you updates regarding the conference
                and related logistics. Additionally, with your consent, we may
                occasionally send you news about future events or initiatives
                that align with your interests.
              </p>
            </div>

            {/* Data Sharing */}
            <div className="bg-transparent rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Data Sharing
              </h2>
              <p className="text-gray-600">
                We will not share your personal information with third parties
                without your explicit consent unless required by law or
                necessary to provide our services (e.g., payment processors or
                hotel partners). In such cases, we only share the minimum
                necessary data with trusted partners who maintain robust privacy
                standards.
              </p>
            </div>

            {/* Data Security */}
            <div className="bg-transparent rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Data Security
              </h2>
              <p className="text-gray-600">
                We take commercially reasonable precautions to safeguard your
                personal information from unauthorized access, disclosure, or
                alteration. We store your information on secure servers and use
                industry-standard technical and organizational measures to
                maintain its integrity and confidentiality.
              </p>
            </div>

            {/* Your Rights */}
            <div className="bg-transparent rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Your Rights
              </h2>
              <p className="text-gray-600">
                You have the right to access, correct, or delete your personal
                information at any time. You may also withdraw consent for
                certain uses of your data. To exercise these rights, please
                contact us at{" "}
                <a
                  href="mailto:crownthevision@gmail.com"
                  className="text-blue-500 hover:underline"
                >
                  crownthevision@gmail.com
                </a>
                . We will promptly respond to your inquiries and take necessary
                actions to address your concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
