import React, { useState } from "react";
const QuestionsForm = ({ location }) => {
  const queryParams = new URLSearchParams(location.search);
  const sessionTitle = queryParams.get("session");

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    question: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    alert("Your question has been submitted.");
    setFormData({ from: "", to: "", question: "" });
  };

  return (
    <>
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          Questions Form
        </h1>
        <h2 className="text-xl text-gray-600 mb-8 text-center">
          Session: {sessionTitle || "General"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="from"
              className="block text-sm font-medium text-gray-700"
            >
              From
            </label>
            <input
              type="text"
              name="from"
              id="from"
              value={formData.from}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="to"
              className="block text-sm font-medium text-gray-700"
            >
              To
            </label>
            <input
              type="text"
              name="to"
              id="to"
              value={formData.to}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-gray-700"
            >
              Question
            </label>
            <textarea
              name="question"
              id="question"
              value={formData.question}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-800 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default QuestionsForm;
