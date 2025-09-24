import { useState } from "react";
import toast from "react-hot-toast";
import useDocumentTitle from "../../components/DocTitle";
import { energyRegisterApi } from "../../apis/Api";
import SuccessDialog from "../../components/SuccessDialog";
import Navbar from "../../components/Navbar";

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
  const [participantType, setParticipantType] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for success dialog
  const [successOpen, setSuccessOpen] = useState(false);

  // Image resize function
  const resizeImage = (file, maxWidth = 600, maxHeight = 600) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and resize image
        ctx.drawImage(img, 0, 0, width, height);

        // Use quality 1.0 (no compression) - just resize
        canvas.toBlob(resolve, 'image/jpeg', 1.0);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    // Check initial file size - reject immediately if over 500KB
    if (file.size > 500 * 1024) {
      toast.error('Image is too large. Please select an image under 500KB.');
      // Clear the input
      e.target.value = '';
      return;
    }

    try {
      // Resize image to 600x600 (no compression)
      const resizedImage = await resizeImage(file);

      // Check if resized image is over 500KB
      if (resizedImage.size > 500 * 1024) {
        toast.error('Image is too large even after resizing. Please choose a smaller image or different format.');
        return;
      }

      setProfileImage(resizedImage);
      // Create preview URL for resized image
      const previewUrl = URL.createObjectURL(resizedImage);
      setImagePreview(previewUrl);

    } catch (error) {
      toast.error('Error processing image. Please try again.');
    }
  };

  // Basic Client-Side Validation
  const validateForm = () => {
    if (!institution.trim()) {
      toast.error("Organization name is required.");
      return false;
    }
    if (!title.trim()) {
      toast.error("Title is required.");
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
    if (!gender) {
      toast.error("Gender is required.");
      return false;
    }
    if (!participantType) {
      toast.error("Participant type is required.");
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
    if (!profileImage) {
      toast.error("Profile image is required.");
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
      const formData = new FormData();
      formData.append("title", title);
      formData.append("gender", gender);
      formData.append("participantType", participantType);
      formData.append("nameOfInstitution", institution);
      formData.append("firstName", firstName);
      formData.append("middleName", middleName);
      formData.append("lastName", lastName);
      formData.append("jobPosition", jobPosition);
      formData.append("emailAddress", emailAddress);
      formData.append("mobileNumber", mobileNumber);

      // Add image if selected
      if (profileImage) {
        // Create a File object with proper filename and extension
        const imageFile = new File([profileImage], `profile-image.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        formData.append("userimage", imageFile);
      }

      await energyRegisterApi(formData);

      // Reset fields
      setParticipantType("");
      setTitle("");
      setGender("");
      setInstitution("");
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setJobPosition("");
      setEmailAddress("");
      setMobileNumber("");
      setProfileImage(null);
      setImagePreview(null);
      setSuccessOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-4">
          Registration Form
        </h2>
        <div className="text-sm font-medium text-green-800 text-center mb-6">
          Energy Transition for Resilient and Low Carbon Economy Summit 2025
        </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                autoFocus
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Row 2: Gender + Participant Type */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 text-blue-800">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                aria-label="Select your gender"
              >
                <option value="">-- Select Gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Participant type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participant Type <span className="text-red-500">*</span>
              </label>
              <select
                value={participantType}
                onChange={(e) => setParticipantType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
                aria-label="Select participant type"
              >
                <option value="">-- Select Participant Type --</option>
                <option value="Session Chair">Session Chair</option>
                <option value="Moderator">Moderator</option>
                <option value="Presenter">Presenter</option>
                <option value="General Participant">General Participant</option>
                <option value="VIP Guest">VIP Guest</option>
                <option value="Keynote Speaker">Keynote Speaker</option>
                <option value="Media">Media</option>
              </select>
            </div>
          </div>

          {/* Row 3: Mobile + Designation */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 text-blue-800">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mobileNumber"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none"
              />
            </div>
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

          {/* Profile Image */}
          <div className="mb-6 text-blue-800">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max size: 500KB. Image will be automatically resized to 600x600px.
            </p>
            {imagePreview && (
              <div className="mt-3 flex justify-center">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProfileImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm text-start font-medium mb-6">
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
