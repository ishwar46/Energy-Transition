import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  sendGlobalNotificationApi,
  getAllNotificationsApi,
} from "../../apis/Api";
import useDocumentTitle from "../../components/DocTitle";

const SendNotifications = () => {
  useDocumentTitle("Send Notification - Uranus Event Management");
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);

  useEffect(() => {
    fetchSentNotifications();
  }, []);

  const fetchSentNotifications = async () => {
    try {
      const res = await getAllNotificationsApi();
      const notifications = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSentNotifications(notifications);
    } catch (error) {
      toast.error("Error fetching notifications.");
      console.error("Error fetching notifications:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendGlobalNotificationApi(formData);
      toast.success("Notification sent successfully!");
      setFormData({ title: "", message: "" });
      fetchSentNotifications();
    } catch (error) {
      toast.error("Error sending notification.");
      console.error("Error sending notification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-start mb-4 text-black">
        Send Notification
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 w-full">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full text-gray-700 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              placeholder="Enter Notification Title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full p-3 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              rows="4"
              placeholder="Enter Notification Message"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Sent Notifications
        </h2>
        {sentNotifications.length > 0 ? (
          <ul
            className="space-y-4 max-h-96 overflow-y-auto"
            style={{ minHeight: "150px" }}
          >
            {sentNotifications.map((notification, index) => (
              <li
                key={index}
                className="border border-gray-200 p-4 rounded-lg shadow-sm"
              >
                <h3 className="font-semibold text-gray-700">
                  {notification.title}
                </h3>
                <p className="text-gray-600">{notification.message}</p>
                <span className="text-sm text-gray-500">
                  Sent on: {new Date(notification.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No notifications sent yet.</p>
        )}
      </div>
    </div>
  );
};

export default SendNotifications;
