import { useState } from "react";
import toast from "react-hot-toast";
import useDocumentTitle from "../../components/DocTitle";
import { energyRegisterApi } from "../../apis/Api";
import SuccessDialog from "../../components/SuccessDialog";

const Registrations = () => {
  useDocumentTitle(
    "Registration Form - Energy Transition for Resilient and Low Carbon Economy Summit 2025"
  );

  // Form States
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("");
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
    if (!title.trim()) {
      toast.error("Title is required.");
      return false;
    }
    if (!gender) {
      toast.error("Gender is required.");
      return false;
    }
    if (!institution.trim()) {
      toast.error("Organization name is required.");
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
    if (!emailAddress.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  // Handle Form Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("gender", gender); // single string
      formData.append("nameOfInstitution", institution);
      formData.append("firstName", firstName);
      formData.append("middleName", middleName);
      formData.append("lastName", lastName);
      formData.append("jobPosition", jobPosition);
      formData.append("emailAddress", emailAddress);
      formData.append("mobileNumber", mobileNumber);

      // Call API
      await energyRegisterApi(formData);

      // Clear fields
      setTitle("");
      setGender("");
      setInstitution("");
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setJobPosition("");
      setEmailAddress("");
      setMobileNumber("");

      // Show success dialog
      setSuccessOpen(true);
    } catch (error) {
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
          className="text-xl font-semibold text-green-800 text-center mb-4 transition-opacity animate-fadeIn"
          style={{ animation: "fadeIn 2s ease-out" }}
        >
          Welcome to the Energy Transition for Resilient and Low Carbon Economy
          Summit 2025
        </div>
        <p className="text-gray-600 text-center mb-4">
          Please fill in your details to register for the event.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Organization + Title */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 text-blue-800">
            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="institution"
                placeholder="Enter your Organization"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                aria-label="Select your title"
              >
                <option value="">-- Select Title --</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
              </select>
            </div>
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
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Row 2: Gender + Designation */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 text-blue-800">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                aria-label="Select your gender"
              >
                <option value="">-- Select Gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobPosition"
                placeholder="Designation"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
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
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <p className="text-gray-700 text-sm text-start font-medium mb-6">
            All fields marked with <span className="text-red-500">*</span> are
            required.
          </p>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-1/2 px-6 py-3 text-white font-bold rounded-lg shadow-md transition-transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-800 hover:bg-green-700 hover:scale-105"
              }`}
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
        title="Application Received"
        description="Thank you for submitting your application for the Energy Transition for Resilient and Low Carbon Economy Summit 2025! Our team will review your application, and we will notify you via email with further details. We appreciate your patience and look forward to your participation."
        onConfirm={() => setSuccessOpen(false)}
      />
    </>
  );
};

export default Registrations;
