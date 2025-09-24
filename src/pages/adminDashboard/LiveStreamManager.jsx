import React, { useState, useEffect } from "react";
import { postLiveStreamUrlApi, getLiveStreamUrlApi } from "../../apis/Api";
import toast from "react-hot-toast";

const LiveStreamManager = () => {
  const [url, setUrl] = useState("");
  const [savedUrls, setSavedUrls] = useState([]);

  useEffect(() => {
    fetchSavedUrls();
  }, []);

  const fetchSavedUrls = async () => {
    try {
      const response = await getLiveStreamUrlApi();
      setSavedUrls([response.data.liveStream]);
    } catch (error) {
      if (error.response?.status === 404 && error.response?.data?.error === "No live stream URL found.") {
        setSavedUrls([]);
      } else {
        toast.error("Error fetching live stream URLs.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await postLiveStreamUrlApi({ url });
      toast.success("Live stream URL saved successfully.");
      setUrl("");
      fetchSavedUrls();
    } catch (error) {
      toast.error("Error saving the live stream URL.");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-start mb-4 text-black mt-3">
        Manage Live Stream
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <label htmlFor="url" className="block text-gray-700 font-semibold mb-2">
          YouTube Live Stream URL:
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-blue-500"
          placeholder="https://www.youtube.com/..."
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600"
        >
          Save URL
        </button>
      </form>

      {savedUrls.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Saved Live Streams
          </h2>
          <ul>
            {savedUrls.map((liveStream, index) => (
              <li key={index} className="text-gray-700">
                <a
                  href={liveStream.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {liveStream.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default LiveStreamManager;
