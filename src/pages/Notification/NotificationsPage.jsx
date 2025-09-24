// import React, { useEffect, useState } from "react";
// import useDocumentTitle from "../../components/DocTitle";
// import { getAllNotificationsApi } from "../../apis/Api";
// import logo from "../../assets/images/leologo.png";
// import Navbar from "../../components/Navbar";
// import { io } from "socket.io-client";
// import { BellIcon } from "@heroicons/react/24/outline";

// const Notifications = () => {
//   useDocumentTitle("Notifications - ACSIC Conference");

//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await getAllNotificationsApi();
//         if (res.data) {
//           setNotifications(res.data);
//         }
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     fetchNotifications();

//     const socket = io("https://api-energy.onrender.com");

//     // Listen for live notifications
//     socket.on("receiveNotification", (newNotification) => {
//       setNotifications((prevNotifications) => [
//         newNotification,
//         ...prevNotifications,
//       ]);

//       if (Notification.permission === "granted") {
//         new Notification("New Notification", {
//           body: newNotification.title,
//         });
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="relative container mx-auto px-4 mt-10 mb-10">
//         <div
//           className="absolute inset-0 flex justify-center items-center z-0"
//           style={{
//             backgroundImage: `url(${logo})`,
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//             backgroundSize: "contain",
//             opacity: 0.1,
//           }}
//         ></div>
//         <div
//           className="text-3xl font-bold text-blue-800 pt-5 text-center mb-5"
//           style={{ animation: "fadeIn 2s ease-out" }}
//         >
//           Notices
//         </div>
//         <div
//           className="bg-transparent rounded-lg p-6 mb-10"
//           style={{ animation: "slideUp 0.8s ease-out forwards" }}
//         >
//           <div className="grid grid-cols-1 gap-8">
//             {notifications.length > 0 ? (
//               notifications.map((notification, index) => (
//                 <div
//                   key={index}
//                   className="bg-white rounded-lg shadow-lg p-6 flex items-start space-x-4 transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
//                   style={{ animation: "fadeIn 0.5s ease-out" }}
//                 >
//                   <div className="flex-shrink-0">
//                     <div className="bg-blue-500 h-10 w-10 flex items-center justify-center rounded-full text-white">
//                       <BellIcon className="h-6 w-6" />
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-lg font-semibold text-gray-800 mb-1">
//                       {notification.title}
//                     </h2>
//                     <p className="text-gray-600">{notification.message}</p>
//                     <p className="text-sm text-gray-400 mt-2">
//                       {new Date(notification.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-600">
//                 No notifications available.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Notifications;
