// import React, { useState, useEffect } from "react";
// import "../../css/animations.css";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import logo from "../../assets/images/leologo.png";
// import { getAllEventWithPDF, getallOnlyPDF } from "../../apis/Api";
// import toast from "react-hot-toast";
// import NoDataFound from "../../components/NoDataFound";
// import { FaHandPointRight } from "react-icons/fa";

// const Schedule = () => {
//   const [allEventWithPdf, setAllEventWithPdf] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [allPdf, setAllPdf] = useState([]);

//   useEffect(() => {
//     fetchallPdfOnly();
//     fetchAllEventWithPdf();
//   }, []);

//   const openPdf = (pdfUrl) => {
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank");
//     }
//   };

//   const fetchAllEventWithPdf = async () => {
//     try {
//       const res = await getAllEventWithPDF();
//       setAllEventWithPdf(res.data.allEventWithPDF);
//     } catch (error) {
//       toast.error("Unable to Fetch All Event");
//     }
//   };

//   const handleEventClick = (index) => {
//     setSelectedEvent(index);
//   };

//   const fetchallPdfOnly = async () => {
//     try {
//       const res = await getallOnlyPDF();
//       if (res.status === 200 || res.status === 201) {
//         // console.log(res.data.allPdfwithtitle);
//         setAllPdf(res.data.allPdfwithtitle);
//       }
//     } catch (error) {
//       toast.error("Unable to Fetch All PDF");
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="relative container mx-auto px-4 mt-10 mb-10">
//         <div
//           className="absolute inset-0 flex justify-center items-center"
//           style={{
//             backgroundImage: `url(${logo})`,
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//             backgroundSize: "contain",
//             opacity: 0.1,
//             zIndex: 0,
//           }}
//         ></div>
//         <div
//           className="relative z-10 text-3xl font-bold text-blue-800 text-center"
//           style={{ animation: "fadeIn 1s ease-out" }}
//         >
//           EVENT SCHEDULE DETAILS
//         </div>

//         {allPdf.length > 0 ? (
//           <div className="mt-8">
//             {allPdf.map((pdf, index) => (
//               <div key={index} className="flex items-center gap-4">
//                 <FaHandPointRight color="green" />
//                 <h1
//                   className="relative z-10 text-1xl lg:text-lg font-bold text-blue-800 text-left cursor-pointer"
//                   style={{ animation: "fadeIn 1s ease-out" }}
//                   onClick={
//                     () =>
//                       openPdf(
//                         `https://energy-transition-api-eg0r.onrender.com/${pdf.pdf}`
//                       )
//                     // openPdf(`http://localhost:5000/${pdf.pdf}`)
//                   }
//                 >
//                   {pdf.title}
//                 </h1>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <></>
//         )}
//         <div className="relative z-10 text-1xl font-bold text-green-800 text-left mb-10 mt-8">
//           Our event will be held on the following dates:
//         </div>
//         <div className="relative z-10 mt-2 text-black">
//           {allEventWithPdf.length > 0 ? (
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-8">
//               {allEventWithPdf.map((event, index) => (
//                 <div key={index}>
//                   <div
//                     className={`p-5 text-center shadow-md border transition duration-500 ease-in-out transform hover:scale-105 cursor-pointer ${
//                       selectedEvent === index ? "bg-[#001942] text-white" : ""
//                     }`}
//                     onClick={() => handleEventClick(index)}
//                   >
//                     <div className="text-1xl font-bold">{event.day}</div>
//                     <div>{event.date}</div>
//                   </div>

//                   {selectedEvent === index && (
//                     <div
//                       className="mt-3 p-5 bg-[#001942] text-white transition-transform duration-500 text-center"
//                       style={{
//                         animation: "slideIn 0.5s forwards",
//                       }}
//                     >
//                       <h3 className="text-base mb-4">{event.title}</h3>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-gray-500 mt-10">
//               <NoDataFound />
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Schedule;
