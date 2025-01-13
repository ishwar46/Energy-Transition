import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  deleteVolunteerByID,
  getAllVolunteer,
  registerVolunteer,
  updateVolunteer,
} from "../../apis/Api";
import { MdDelete, MdEdit } from "react-icons/md";
import CircularIndeterminate from "../../components/CircularIndeterminate";
import * as XLSX from "xlsx";
import excelIcon from "../../assets/images/sheet.png";

const VolunteerRegister = () => {
  const [allVolunteer, setAllVolunteer] = useState([]);
  const [imagePreview, setimagePreview] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [isEditingVolunteer, setisEditingVolunteer] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    contact: "",
    email: "",
    password: "",
    volunteerimage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        volunteerimage: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setimagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setimagePreview(
        formData.volunteerimage
          ? URL.createObjectURL(formData.volunteerimage)
          : null
      );
    }
  };

  useEffect(() => {
    fetchAllVolunteer();
  }, []);

  const fetchAllVolunteer = async () => {
    try {
      const res = await getAllVolunteer();
      if (res.status === 200 || res.status === 201) {
        setAllVolunteer(res.data.allVolunteer);
      }
    } catch (error) {
      toast.error(`Unable to Fetch All Voluntter ${error}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      let res;
      if (isEditingVolunteer) {
        res = await updateVolunteer(isEditingVolunteer, {
          fullName: formData.fullName || allVolunteer.fullName,
          address: formData.address || allVolunteer.address,
          contact: formData.contact || allVolunteer.contact,
          email: formData.email || allVolunteer.email,
          volunteerimage:
            formData.volunteerimage || allVolunteer.volunteerimage,
        });
        setisEditingVolunteer(null);
      } else {
        res = await registerVolunteer({
          fullName: formData.fullName,
          address: formData.address,
          contact: formData.contact,
          email: formData.email,
          volunteerimage: formData.volunteerimage,
        });
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message);
      }
      setFormData({
        fullName: "",
        address: "",
        contact: "",
        email: "",
        password: "",
        volunteerimage: null,
      });
      fetchAllVolunteer();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setisLoading(false);
    }
  };

  const handleEdit = async (volunteer) => {
    setisEditingVolunteer(volunteer._id);
    setFormData({
      fullName: volunteer.fullName,
      address: volunteer.address,
      contact: volunteer.contact,
      email: volunteer.email,
      password: "",
      volunteerimage: volunteer.volunteerimage || null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteVolunteerByID(id);
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message);
        fetchAllVolunteer();
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      allVolunteer.map((allVolunteer) => ({
        "Full Name": allVolunteer?.fullName || "N/A",
        Address: allVolunteer?.address || "N/A",
        Contact: allVolunteer?.contact || "N/A",
        Email: allVolunteer?.email || "N/A",
      }))
    );

    ws["!cols"] = [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    XLSX.writeFile(wb, "acsic_volunteer_details.xlsx");
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold text-start mb-4 text-black mt-2">
        Register New Volunteer
      </h2>
      <div className="mt-2 p-2 rounded-lg bg-white w-full text-black">
        <form
          className="w-full max p-2 text-black shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">
                Fullname
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="* Enter FullName"
                autoComplete="fullName"
                onChange={handleChange}
                value={formData.fullName}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="address"
                name="address"
                placeholder="* Enter Address"
                autoComplete="address"
                onChange={handleChange}
                value={formData.address}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Contact</label>
            <input
              type="contact"
              name="contact"
              placeholder="* Please Enter new contact"
              autoComplete="contact"
              onChange={handleChange}
              value={formData.contact}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="* Please Enter new Email"
              autoComplete="email"
              onChange={handleChange}
              value={formData.email}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">
              Volunteer Image
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              name="volunteerimage"
              className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {imagePreview && (
                <div className="relative w-32 h-32">
                  <img
                    src={imagePreview}
                    alt="Selected"
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          {isLoading ? (
            <CircularIndeterminate />
          ) : (
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mt-5"
            >
              Register Volunteer
            </button>
          )}
        </form>

        <div className="mt-4 text-right flex justify-end mr-5">
          <button
            onClick={exportToExcel}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded flex items-center justify-end"
          >
            <img
              src={excelIcon}
              alt="Export to Excel"
              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5"
            />
          </button>
        </div>

        <div className="overflow-x-auto mt-2 text-black">
          <table className="min-w-full leading-normal shadow-md bg-transparent  border-black">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-l-sm text-xs uppercase tracking-wider">
                  SN
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider hidden md:block">
                  Full Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                  Address
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white text-xs uppercase tracking-wider">
                  Image
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-[#3051A0] text-left font-semibold text-white rounded-r-sm text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allVolunteer.map((volunteer, index) => (
                <tr key={volunteer._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {volunteer.fullName}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {volunteer.address}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {volunteer.contact}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {volunteer.email}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-transparent text-sm text-gray-700">
                    {volunteer.volunteerimage && (
                      <img
                        // src={`https://crownthevisionapi.onrender.com/${volunteer.volunteerimage}`}
                        src={`https://crownthevisionapi.onrender.com/${volunteer.volunteerimage}`}
                        alt={`Volunteer ${volunteer.fullName}`}
                        className="w-16 h-16 object-cover mr-2 mb-2 rounded-full"
                      />
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(volunteer)}
                      className="text-blue-500"
                    >
                      <MdEdit size={25} />
                    </button>
                    <button
                      onClick={() => handleDelete(volunteer._id)}
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

export default VolunteerRegister;
