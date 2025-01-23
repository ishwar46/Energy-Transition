// import React from "react";
// import "../../css/animations.css";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import useDocumentTitle from "../../components/DocTitle";

// import districtPresident from "../../assets/images/abhaya.jpeg";
// import districtTreasurer from "../../assets/images/kushal.jpeg";
// import samratAidi from "../../assets/images/samratAidi.jpeg";
// import sponsorshipImg from "../../assets/images/sponsorManager.jpeg";
// import volunteerImg from "../../assets/images/volunteerHead.jpeg";
// import clubPresident from "../../assets/images/clubPresident.jpeg";
// import member from "../../assets/images/leoAr.jpeg";

// const MeetOurTeam = () => {
//   useDocumentTitle("Meet Our Team - Leo District Council 325L");

//   const teamMembers = [
//     {
//       name: "Leo Abhaya Thapa",
//       role: "Event Chairperson",
//       title: "District President",
//       image: districtPresident,
//     },
//     {
//       name: "Leo Kushal Lamsal",
//       role: "Event Coordinator",
//       title: "District Treasurer",
//       image: districtTreasurer,
//     },
//     {
//       name: "Leo Samrat Jung Aidi",
//       role: "Logistics Head",
//       title: "District Secretary",
//       image: samratAidi,
//     },
//     {
//       name: "Leo Nabin Basnet",
//       role: "Sponsorship Manager",
//       title: "Club President",
//       image: sponsorshipImg,
//     },
//     {
//       name: "Leo Sagesh Adhikari",
//       role: "Volunteer Head",
//       title: "Region Coordinator",
//       image: volunteerImg,
//     },
//     {
//       name: "Leo Ritika Agrawal ",
//       role: " Leo District Council 325 L",
//       title: "Club President",
//       image: clubPresident,
//     },
//     {
//       name: "Lion Ar. Aayushma Shah",
//       role: "LCI District 325 L",
//       title: "Member",
//       image: member,
//     },
//     // {
//     //   name: "Leo Yashshree Basnet",
//     //   role: "Communication Head",
//     //   title: "Region Coordinator",
//     //   image: communicationImg,
//     // },
//   ];

//   return (
//     <>
//       <Navbar />
//       <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
//         {/* Page Title */}
//         <div
//           className="text-4xl font-bold text-blue-800 text-center mb-10"
//           style={{ animation: "fadeIn 1s ease-out" }}
//         >
//           Meet Our Team
//         </div>

//         {/* Team Members Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {teamMembers.map((member, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-lg shadow-lg p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl group"
//               style={{ animation: "slideUp 0.8s ease-out forwards" }}
//             >
//               {/* Image */}
//               <div className="relative">
//                 <img
//                   src={member.image}
//                   alt={member.name}
//                   className="h-32 w-32 mx-auto rounded-full object-cover mb-4 border-4 border-blue-100 group-hover:border-blue-500 transition-colors duration-300"
//                 />
//               </div>
//               {/* Name */}
//               <h3 className="text-xl font-bold text-blue-800 group-hover:text-blue-600 transition-colors duration-300">
//                 {member.name}
//               </h3>
//               {/* Role */}
//               <p className="text-md font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
//                 {member.role}
//               </p>
//               {/* Title */}
//               <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
//                 {member.title}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default MeetOurTeam;
