import { useState } from "react";
import toast from "react-hot-toast";
import useDocumentTitle from "../../components/DocTitle";

import { registerUserApi } from "../../apis/Api";

import SuccessDialog from "../../components/SuccessDialog";

const Registrations = () => {
  useDocumentTitle(
    "Registration Form - Energy Transition for Resilient and Low Carbon Economy Summit 2025"
  );

  // Form States
  const [institution, setInstitution] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // State for success dialog
  const [successOpen, setSuccessOpen] = useState(false);

  // Basic Client-Side Validation
  const validateForm = () => {
    if (!institution.trim()) {
      toast.error("Orginzation name is required.");
      return false;
    }
    if (!firstName.trim()) {
      toast.error("First name is required.");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required.");
      return false;
    }
    if (!jobPosition.trim()) {
      toast.error("Designation is required.");
      return false;
    }
    if (!mobileNumber.trim()) {
      toast.error("Mobile number is required.");
      return false;
    }
    // Basic email format check
    if (!emailAddress.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  // Handle Form Submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Stop if validation fails
    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1) Create FormData to match the backend fields
      const formData = new FormData();
      formData.append("nameOfInstitution", institution);
      formData.append("firstName", firstName);
      formData.append("middleName", middleName);
      formData.append("lastName", lastName);
      formData.append("jobPosition", jobPosition);
      formData.append("emailAddress", emailAddress);
      formData.append("mobileNumber", mobileNumber);

      // 2) **Call the registerUserApi** with the formData
      await registerUserApi(formData);

      // 3) Clear the form fields on success
      setInstitution("");
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setJobPosition("");
      setEmailAddress("");
      setMobileNumber("");

      // 4) Show your success dialog
      setSuccessOpen(true);
    } catch (error) {
      // Show error toast (or error modal if you prefer)
      console.error("Registration Error:", error);
      toast.error(
        error.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-4xl font-bold text-blue-800 text-center mb-8">
          Registration Form
        </h2>
        <div
          className="text-1xl font-semibold text-green-800 text-center mb-4"
          style={{ animation: "fadeIn 2s ease-out" }}
        >
          Welcome to the Energy Transition for Resilient and Low Carbon Economy
          Summit 2025
        </div>
        <p className="text-gray-600 text-center mb-6">
          Please fill in your details to register for the event.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Institution */}
          <div className="mb-6 text-blue-800">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orginization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="institution"
              placeholder="Enter your orginization"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Name Fields */}
          <div className="grid md:grid-cols-3 gap-4 mb-6 text-blue-800">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                placeholder="Middle Name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Job Position */}
          <div className="mb-6 text-blue-800">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jobPosition"
              placeholder="Designation"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Mobile Number */}
          <div className="mb-6 text-blue-800">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-6 text-blue-800">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="emailAddress"
              placeholder="Email Address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className={`w-full md:w-1/2 px-6 py-3 text-white font-bold rounded-lg shadow-md ${
                loading ? "bg-gray-400" : "bg-blue-800 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        open={successOpen}
        setOpen={setSuccessOpen}
        title="Registration Successful"
        description="Thank you for registering for the Energy Transition for Resilient and Low Carbon Economy Summit 2025! You will receive a confirmation email shortly with more details. We look forward to your participation."
        onConfirm={() => setSuccessOpen(false)}
      />
    </>
  );
};

export default Registrations;
