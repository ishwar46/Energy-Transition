import React, { useState, useEffect } from "react";
import { getAllSubscribersApi } from "../../apis/Api";

const Queries = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscribers data
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await getAllSubscribersApi();
      if (response.status === 200) {
        setSubscribers(response.data.subscriptions || []);
      } else {
        throw new Error("Failed to fetch subscribers");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to fetch data every 1 minutes
  useEffect(() => {
    fetchSubscribers();
    const interval = setInterval(fetchSubscribers, 1 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">All Queries</h2>
      {subscribers.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Full Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Message</th>
              <th className="border border-gray-300 p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber._id}>
                <td className="border border-gray-300 p-2">
                  {subscriber.fullname}
                </td>
                <td className="border border-gray-300 p-2">
                  {subscriber.email}
                </td>
                <td className="border border-gray-300 p-2">
                  {subscriber.message}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(subscriber.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No queries found.</div>
      )}
    </div>
  );
};

export default Queries;
