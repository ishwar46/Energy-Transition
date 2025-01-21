import React, { useState } from "react";
import Wasapp from "../assets/images/M (2).png";
import SuccessDialog from "./SuccessDialog";
import AlertDialog from "./AlertDialog";
import { addSubscriberApi } from "../apis/Api";

const Footer = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleFullnameChange = (event) => setFullname(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleMessageChange = (event) => setMessage(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fullname || !email || !message) {
      alert("All fields are required!");
      return;
    }

    const formData = { fullname, email, message };

    try {
      const response = await addSubscriberApi(formData);

      if (response.status === 200) {
        setSuccessOpen(true);
        setDialogMessage(
          "Thank you! We have received your query and will get back to you as soon as possible."
        );
        setFullname("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(
          response.data.error ||
            "Unfortunately, we encountered a problem while processing your request. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorOpen(true);
      setDialogMessage(error.message);
    }
  };

  return (
    <>
      {" "}
      <div className="bg-[#0060df] p-10 w-full mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-between items-start">
          {/* Column 1: Event Details */}
          <div className="space-y-4">
            <h3 className="text-white text-2xl font-bold">
              Energy Transition for Resilient and Low Carbon Economy Summit 2025
            </h3>
            <p className="text-white font-semibold">28th Jan, 2025</p>
            <p className="text-white font-semibold">Kathmandu, Nepal</p>
            <div className="flex gap-2 items-center text-white">
              <img src={Wasapp} alt="WhatsApp" className="h-8" />
              <div>
                <span className="text-white font-semibold cursor-pointer">
                  +977-9840174852
                </span>{" "}
                <span>feel free to message for queries. (Chat Only)</span>
              </div>
            </div>
            <a
              href="https://www.aepc.gov.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 py-2 px-4 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
            >
              Know more about Alternative Energy Promotion Center
            </a>
          </div>

          {/* Column 2: Contact Form */}
          <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <h3 className="text-white text-2xl font-bold text-center">
                DO YOU HAVE ANY QUERIES?
              </h3>
              <input
                type="text"
                value={fullname}
                onChange={handleFullnameChange}
                placeholder="Enter your Full Name"
                className="w-full p-3 rounded-lg text-sm text-gray-700 bg-white border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter Your Email"
                className="w-full p-3 rounded-lg text-sm text-gray-700 bg-white border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
              />
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Enter your message"
                className="w-full p-3 min-h-[100px] rounded-lg text-sm text-gray-700 bg-white border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
              ></textarea>
              <button
                type="submit"
                className="h-10 px-5 text-white bg-teal-500 w-full rounded-xl hover:bg-teal-600 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        <hr className="mt-10 border-gray-400" />
        <div className="text-center text-white mt-5">
          © Alternative Energy Promotion Center, All rights reserved. |{" "}
          <a
            href="https://uranus-tech.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Designed and Developed by Uranus Tech Nepal Pvt. Ltd.
          </a>
        </div>
      </div>
      <SuccessDialog
        open={successOpen}
        setOpen={setSuccessOpen}
        title="Success"
        description={dialogMessage}
      />
      <AlertDialog
        open={errorOpen}
        setOpen={setErrorOpen}
        title="Error"
        description={dialogMessage}
      />
    </>
  );
};

export default Footer;
