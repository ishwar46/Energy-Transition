import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/uranusevents.png";
import { userLoginApi } from "../../apis/Api";
import toast from "react-hot-toast";
import useDocumentTitle from "../../components/DocTitle";
import { Link } from "react-router-dom";

const LoginPage = () => {
  useDocumentTitle("Member Login - Uranus Event Management");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedPassword = password.trim();
    const data = {
      firstName: firstName,
      password: trimmedPassword,
    };

    userLoginApi(data)
      .then((res) => {
        if (res.data.success) {
          toast.success("Logged in successfully!");
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/userdashboard");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        let errorMessage = "Internal server error";
        if (err.response && err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        toast.error(errorMessage);
      });
  };

  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <img src={Logo} className="h-[200px]" alt="ACSIC Logo" />

          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Log in to your account
              </h1>
              <p className="text-red-700">
                Please log in with the username and password sent to your
                confirmation email.
              </p>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-lg font-medium text-gray-900"
                  >
                    Enter your username
                  </label>
                  <input
                    onChange={handleFirstName}
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Username"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-lg font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    onChange={handlePassword}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required=""
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-green-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Login
                </button>
              </form>
              <div className="flex justify-center items-center">
                <Link className="text-black " to="/changepassword">
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
