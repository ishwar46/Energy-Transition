import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  ClockIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import UserTable from "./UserRegTable";
import { getAllUsersApi, getAllNotificationsApi } from "../../apis/Api";
import useDocumentTitle from "../../components/DocTitle";

const MainDashboard = () => {
  useDocumentTitle("Admin Dashboard - Uranus Event Management");
  const [userCount, setUserCount] = useState(0);
  const [pendingUserCount, setPendingUserCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchUserCounts();
    // fetchSpeakerCounts();
    fetchNotificationCount();
  }, []);

  const fetchUserCounts = async () => {
    try {
      const response = await getAllUsersApi();
      if (response && response.data && response.data.users) {
        const users = response.data.users;
        setUserCount(users.length);

        const pendingUsers = users.filter(
          (user) => user.adminVerification.status === "pending"
        );
        setPendingUserCount(pendingUsers.length);
      }
    } catch (error) {
      console.error("Error fetching user counts:", error);
    }
  };

  // const fetchSpeakerCounts = async () => {
  //   try {
  //     const response = await getAllSpeakersApi();
  //     if (response && response.data && response.data.speakers) {
  //       const speakers = response.data.speakers;
  //       setSpeakerCount(speakers.length);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching speaker counts:", error);
  //   }
  // };

  const fetchNotificationCount = async () => {
    try {
      const response = await getAllNotificationsApi();
      if (response && response.data) {
        setNotificationCount(response.data.length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <>
      <div className="text-2xl font-bold text-start text-black mt-2">
        Dashboard
      </div>
      <div className="pt-5">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
          {/* Total Registered */}
          <div className="border rounded-xl p-5 bg-white shadow hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div className="flex items-center gap-3">
              {/* User Group Icon */}
              <UserGroupIcon className="w-10 h-10 text-blue-600 bg-blue-100 p-2 rounded transition-transform transform hover:scale-105" />
              <div className="text-lg text-gray-800 font-semibold">
                Total Applications
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-700 mt-3">
              {userCount}
            </div>
          </div>

          {/* Pending Requests */}
          <div className="border rounded-xl p-5 bg-white shadow hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div className="flex items-center gap-3">
              {/* Clock Icon */}
              <ClockIcon className="w-10 h-10 text-yellow-600 bg-yellow-100 p-2 rounded transition-transform transform hover:scale-105" />
              <div className="text-lg text-gray-800 font-semibold">
                Pending Applications
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-700 mt-3">
              {pendingUserCount}
            </div>
          </div>

          {/* Notification Sent */}
          <div className="border rounded-xl p-5 bg-white shadow hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div className="flex items-center gap-3">
              {/* Bell Icon */}
              <BellIcon className="w-10 h-10 text-green-600 bg-green-100 p-2 rounded transition-transform transform hover:scale-105" />
              <div className="text-lg text-gray-800 font-semibold">
                Notification Sent
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-700 mt-3">
              {notificationCount}
            </div>
          </div>
        </div>

        <UserTable />
      </div>
    </>
  );
};

export default MainDashboard;
