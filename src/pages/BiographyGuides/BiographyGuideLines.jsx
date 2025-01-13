import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BiographyGuidelines = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10 mb-10">
        <h1 className="text-3xl font-bold text-blue-800 text-center mb-10">
          Biography Guidelines
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-lg text-green-700 mb-4 font-bold">
            Please follow these guidelines when writing your biography for the
            conference materials and the ACSIC website:
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>
              <strong>Length:</strong> The biography should be between 150 and
              250 words.
            </li>
            <li>
              <strong>Language:</strong> Write your biography in clear, concise
              English.
            </li>
            <li>
              <strong>Note:</strong> Biography is required for the Chief
              Delegate only.
            </li>
            <li>
              <strong>Structure:</strong> Begin with your full name, current
              position, and organization.
            </li>
            <li>
              <strong>Education:</strong> Briefly mention your highest level of
              education and any relevant degrees or certifications.
            </li>
            <li>
              <strong>Experience:</strong> Highlight your professional
              experience and achievements, focusing on those most relevant to
              the conference and your role within ACSIC.
            </li>
            <li>
              <strong>Specialization:</strong> Describe your area(s) of
              expertise and any significant contributions to your field.
            </li>
            <li>
              <strong>Affiliations:</strong> List any relevant professional
              memberships or affiliations.
            </li>
            <li>
              <strong>Personal touch:</strong> Optionally, you may include a
              sentence about your personal interests or hobbies.
            </li>
            <li>
              <strong>Third-person perspective:</strong> Write your biography in
              the third person, as if someone else is describing you.
            </li>
          </ul>
          <p className="text-sm text-red-700 mt-4">
            * Please ensure that your biography adheres to these guidelines
            before submission. This will help maintain a consistent and
            professional appearance across all conference materials and on the
            ACSIC website.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BiographyGuidelines;
