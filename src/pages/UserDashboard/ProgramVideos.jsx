import React from "react";
import SessionOneVideo from "../../components/Video_Links/SessionOneVideo";
import DrYubjraj from "../../components/Video_Links/DrYubjraj";
import MrErik from "../../components/Video_Links/MrErik";
import SessionThree from "../../components/Video_Links/SessionThree";
import SessionFour from "../../components/Video_Links/SessionFour";
import Navbar from "../../components/Navbar";
import OpeningVideo from "../../components/Video_Links/OpeningVideo";
import DayThreeAcsic from "../../components/Video_Links/DayThreeAcsic";
import DayThree from "../../components/Video_Links/DayThree";
import DayFourFullVideo from "../../components/Video_Links/DayFourFullVideo";
import FairwellVideo from "../../components/Video_Links/FairwellVideo";
import DayFour from "../../components/Video_Links/DayFour";

const ProgramVideos = () => {
  return (
    <div>
      <Navbar />
      {/* Day 1 Section */}
      <h1 className="text-xl font-bold mb-3 text-green-700 text-center mt-8 ml-5">
        Day 1 (Fri 20 Sept) The Soaltee Hotel, Kathmandu
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-14 p-8">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            51st Anniversary of DCGF & 36th ACSIC Conference Inauguration
            Program
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <OpeningVideo />
          </div>
        </div>
      </div>

      {/* Day 2 Section */}
      <h1 className="text-xl font-bold mb-3 text-green-700 text-center mt-8 ml-5">
        Day 2 (Sat 21 Sept) The Soaltee Hotel, Kathmandu, Megha Malhar Hall
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-14 p-8">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            Opening Remarks by Dr. Yubaraj Khatiwada
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <DrYubjraj />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            Session One "Unlocking Opportunities in Financing Innovations"
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <SessionOneVideo />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            Deputy Chairperson - Mr. Erik Talasbaev
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <MrErik />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            Session Three "Asian best practices for innovative financing"
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <SessionThree />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            Unlocking Solutions Beyond Borders By Mr. Sanjay Thakur
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <SessionFour />
          </div>
        </div>
      </div>

      {/* Day 3 Section */}
      <h1 className="text-xl font-bold mb-3 text-green-700 text-center mt-8 ml-5">
        Day 3 (Sun 23 Sept) 36th ACSIC Conference Nepal The Soaltee Hotel,
        Kathmandu
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-14 p-8">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            Day Three Full Session
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <DayThree />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            Mr. Bam Bahadur Mishra - Deputy Governor of Nepal Rastra Bank
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <DayThreeAcsic />
          </div>
        </div>
      </div>

      {/* Day  Section */}
      <h1 className="text-xl font-bold mb-3 text-green-700 text-center mt-8 ml-5">
        Day 4 (Sun 23 Sept) 36th ACSIC Conference Nepal The Soaltee Hotel,
        Kathmandu
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-14 p-8">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            Day Four Session Video
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <DayFour />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            Day Four Session Video
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <DayFourFullVideo />
          </div>
        </div>
      </div>

      {/* Day 1 Section */}
      <h1 className="text-xl font-bold mb-3 text-green-700 text-center mt-8 ml-5">
        Day 5 (Sun 24 Sept) 36th ACSIC Conference Nepal The Soaltee Hotel,
        Kathmandu
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-14 p-8">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-3 text-blue-600 cursor-pointer">
            Farewell Dinner
          </h3>
          <div className="w-full max-w-4xl aspect-w-16 aspect-h-9">
            <FairwellVideo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramVideos;
