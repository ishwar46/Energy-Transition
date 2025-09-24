// import React, { useEffect, useState } from "react";
// import logo from "../../assets/images/leologo.png";
// import "../../css/animations.css";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import useDocumentTitle from "../../components/DocTitle";
// import { getAllMessages } from "../../apis/Api";
// import NoDataFound from "../../components/NoDataFound";

// const CeoMessage = () => {
//   const [getAllMessage, setGetAllMessages] = useState([]);

//   useEffect(() => {
//     const fetchAllMessage = async () => {
//       try {
//         const response = await getAllMessages();
//         if (response.status === 200 || response.status === 201) {
//           setGetAllMessages(response.data.allMessage);
//         }
//       } catch (error) {
//         //console.log(`Error getting all Messages ${error}`);
//       }
//     };
//     fetchAllMessage();
//   }, []);

//   useDocumentTitle("Messages - ACSIC Conference");

//   return (
//     <>
//       <Navbar />
//       <div className="relative container mx-auto px-4 mt-10 mb-10">
//         {getAllMessage.length > 0 ? (
//           getAllMessage.map((message, index) => (
//             <>
//               <div key={index}>
//                 <div
//                   className="lg:text-3xl text-2xl font-bold text-blue-800 pt-5 text-center"
//                   style={{ animation: "fadeIn 1s ease-out" }}
//                 >
//                   {message.msgFrom}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-1 gap-10 mt-10">
//                   <div
//                     className="relative transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl bg-transparent shadow-xl rounded-lg lg:p-6 text-gray-900 text-justify text-sm"
//                     style={{ animation: "slideUp 0.5s ease-out" }}
//                   >
//                     <div
//                       className="absolute inset-0"
//                       style={{
//                         backgroundImage: `url(${logo})`,
//                         backgroundRepeat: "no-repeat",
//                         backgroundSize: "50%",
//                         backgroundPosition: "center",
//                         opacity: 0.1,
//                       }}
//                     />
//                     <p className="max-w-6xl mx-auto px-6 text-lg font-bold text-green-700">
//                       {message.msgTitle}
//                     </p>
//                     <div className="max-w-6xl mx-auto px-6 py-5">
//                       <h1 className="text-lg font-semibold mb-4">
//                         {message.msgGreeting}
//                       </h1>
//                       <p className="mb-2 text-lg">{message.msgDescription}</p>
//                       <p className="mb-4 text-lg">{message.msgEndingRemarks}</p>
//                       <div className="flex justify-between items-center">
//                         {message.author1 &&
//                           (message.author1.author1fullName ||
//                             message.author1.author1image) && (
//                             <div className="text-left">
//                               {message.author1.author1fullName && (
//                                 <p className="font-bold text-lg text-green-800">
//                                   {message.author1.author1fullName} <br />
//                                   {message.author1.author1description}
//                                 </p>
//                               )}
//                               {message.author1.author1image && (
//                                 <img
//                                   src={`https://api-energy.onrender.com/${message.author1.author1image}`}
//                                   alt={
//                                     message.author1.author1fullName || "Author"
//                                   }
//                                   className="p-2 lg:w-[200px] lg:h-[200px] w-[100%] h-[100%] rounded-full"
//                                 />
//                               )}
//                             </div>
//                           )}
//                         {message.author2 &&
//                           (message.author2.author2fullName ||
//                             message.author2.author2image) && (
//                             <div className="text-left">
//                               {message.author2.author2fullName && (
//                                 <p className="font-bold text-lg text-green-800">
//                                   {message.author2.author2fullName} <br />
//                                   {message.author2.author2description}
//                                 </p>
//                               )}
//                               {message.author2.author2image && (
//                                 <img
//                                   src={`https://api-energy.onrender.com/${message.author2.author2image}`}
//                                   alt={
//                                     message.author2.author2fullName || "Author"
//                                   }
//                                   className="p-2 lg:w-[200px] lg:h-[200px] w-[100%] h-[100%] rounded-full"
//                                 />
//                               )}
//                             </div>
//                           )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ))
//         ) : (
//           <>
//             <NoDataFound />
//             <div className="text-center text-xl font-bold text-red-500">
//               No data available
//             </div>
//           </>
//         )}
//         {/* <h1 className="lg:text-3xl text-2xl font-bold text-blue-800 text-center pt-10 mt-10">
//           Short Introduction of Nepal | Welcome Delegates Message
//         </h1>
//         <WelcomeIntro />
//         <h1 className="lg:text-3xl text-2xl font-bold text-blue-800 text-center pt-4 mt-4">
//           Welcome to Nepal
//         </h1>
//         <AcsicVideo /> */}
//       </div>
//       <br />
//       <Footer />
//     </>
//   );
// };

// export default CeoMessage;
