import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/leologo.png";
import { adminLoginApi } from "../../apis/Api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../components/DocTitle";

const AdminLogin = () => {
  useDocumentTitle("Admin Login - International Youth Camp");

  useEffect(() => {
    const logoutSuccessMessage = localStorage.getItem("logoutSuccessMessage");
    if (logoutSuccessMessage) {
      toast.success(logoutSuccessMessage, {
        duration: 3000,
        position: "top-right",
      });
      localStorage.removeItem("logoutSuccessMessage");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { email, password };

    adminLoginApi(data)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.admin));
          if (res.data.admin.isAdmin) {
            navigate("/admindashboard");
          }
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        let errorMessage = "Internal server error";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        toast.error(errorMessage);
      });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-40 h-40 md:w-64 md:h-64 bg-white opacity-20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 md:w-96 md:h-96 bg-white opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-20 w-48 h-48 md:w-64 md:h-64 bg-green-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-20 w-64 h-64 md:w-80 md:h-80 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>

      {/* Login Card */}
      <div className="relative z-10 w-11/12 sm:w-3/4 md:w-full max-w-md bg-white bg-opacity-90 shadow-2xl rounded-2xl p-6 sm:p-8 backdrop-blur-md">
        <div className="text-center mb-6">
          <img
            src={Logo}
            alt="LEO Logo"
            className="h-16 sm:h-20 mx-auto mb-4 opacity-90"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500">
            Log in to manage the conference
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 sm:px-10 sm:py-2.5 border border-gray-300 text-black rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 focus:outline-none"
                placeholder="Enter your email"
                required
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <i className="fas fa-envelope"></i>
              </span>
            </div>
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 sm:px-10 sm:py-2.5 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 focus:outline-none"
                placeholder="Enter your password"
                required
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <i className="fas fa-lock"></i>
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-500 hover:to-green-500 hover:shadow-lg transition duration-300 sm:py-2.5"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500">
          Forgot your password?{" "}
          <a href="/reset-password" className="text-green-600 hover:underline">
            Reset it here
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
