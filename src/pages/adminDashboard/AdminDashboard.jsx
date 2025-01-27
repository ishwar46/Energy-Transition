import React, { useState } from "react";
import logo from "../../assets/images/uranusevents.png";
import {
  UserGroupIcon,
  // CurrencyDollarIcon,
  CalendarIcon,
  CameraIcon,
  BellIcon,
  PowerIcon,
  ChartBarIcon,
  // TicketIcon,
  ClipboardDocumentCheckIcon,
  ArrowDownIcon,
  UserPlusIcon,
  ClipboardDocumentIcon,
  PhotoIcon,
  RectangleGroupIcon,
  PaperAirplaneIcon,
  BuildingOffice2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArchiveBoxIcon,
  DocumentArrowUpIcon,
  TruckIcon,
  FolderOpenIcon,
  GlobeAmericasIcon,
  IdentificationIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import MainDashboard from "./MainDashboard";
import GenerateInvoice from "./GenerateInvoice";
import bg from "../../assets/images/adminBg.png";
import Gallery from "./Gallery";
import AddSpeaker from "./AddSpeaker";
import LogoutModal from "../../components/LogoutComponent";
import GenerateReceipt from "./GenerateReceipt";
import ParticipantAttendance from "./Attendance";
import AgendaAdmin from "./AgendaAdmin";
import AddSession from "./AddSession";
import ViewSessions from "./ViewSessions";
import BannerManager from "./BannersPage";
import EventManager from "./EventManagement";
import AdminMessage from "./AdminMessage";
import SendNotifications from "./SendNotification";
import AddVenue from "./AddVenue";
import EventDetailsPdf from "./EventDetailsPdf";
import AddWagon from "./AddWagon";
import KitCheck from "./KitCheck";
import MealsExcursionsAdmin from "./MealsExcursions";
import UserLocation from "./UserLocation";
import GenerateIdCard from "./GenerateIdCard";
import LiveStreamManager from "./LiveStreamManager";
import AllParticipants from "./AllParticipants";
import CheckIn from "./CheckIn";
import { FaHotel } from "react-icons/fa";
import DayWiseEvent from "./DayWiseEvent";
import PdfWithTitle from "./PdfWithTitle";
import VolunteerRegister from "./VolunteerRegister";
import AllSpeakers from "./AllSpeakers";
import { MdVolunteerActivism } from "react-icons/md";
import Queries from "../queries/Queries";

const AdminDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeContainer, setActiveContainer] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEventsMenuOpen, setIsEventsMenuOpen] = useState(false);
  const [isFinanceMenuOpen, setIsFinanceMenuOpen] = useState(false);
  const [isVolunteerMenuOpen, setisVolunteerMenuOpen] = useState(false);
  const [isManagementMenuOpen, setIsManagementMenuOpen] = useState(false);
  const [isGalleryMenuOpen, setIsGalleryMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleContainerChange = (containerName) => {
    if (containerName === "logout") {
      setShowLogoutModal(true);
    } else {
      setActiveContainer(containerName.toLowerCase());
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("logoutSuccessMessage", "Logout successful");
    window.location.href = "/admin";
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const toggleSubMenu = (menu) => {
    if (menu === "events") {
      setIsEventsMenuOpen((prev) => !prev);
    } else if (menu === "finance") {
      setIsFinanceMenuOpen((prev) => !prev);
    } else if (menu === "management") {
      setIsManagementMenuOpen((prev) => !prev);
    } else if (menu === "gallery") {
      setIsGalleryMenuOpen((prev) => !prev);
    } else if (menu === "volunteermenu") {
      setisVolunteerMenuOpen((prev) => !prev);
    }
  };

  return (
    <>
      <div>
        <nav className="fixed top-0 z-50 w-full bg-[#3051A0] border-b border-gray-200">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen ? "true" : "false"}
                >
                  <span className="sr-only">Open sidebar</span>
                  <ChartBarIcon className="w-6 h-6" aria-hidden="true" />
                </button>

                <div to="/" className="flex md:me-24 rounded bg-white">
                  <img src={logo} className="h-10 m-1" alt="logo" />
                </div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-white text-xl font-semibold">
                  Energy Transition for Resilient and Low Carbon Economy Summit
                  2025
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center ms-3">
                  <div className="lg:flex gap-2 items-center">
                    <button
                      type="button"
                      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                    >
                      <img
                        src={logo}
                        className="h-10 m-1 rounded-full"
                        alt="logo"
                      />
                    </button>
                    <span className="text-white ms-2">{userEmail}</span>
                  </div>

                  {isDropdownOpen && (
                    <div
                      className="absolute lg:hidden md:hidden block left-0 top-0 w-full height-[100vh] p-3 bg-white border border-gray-200 divide-y divide-gray-100 rounded shadow-lg"
                      id="dropdown-user"
                    >
                      <div className="px-4 py-3" role="none">
                        <button
                          type="button"
                          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                          onClick={toggleDropdown}
                          aria-expanded={isDropdownOpen ? "true" : "false"}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <ArrowDownIcon
                            className="w-6 h-6"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      <ul className="space-y-2 font-medium">
                        <li>
                          <button
                            onClick={() => handleContainerChange("dashboard")}
                            className={`w-[100%] flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                              activeContainer === "dashboard"
                                ? "bg-purple-100 text-[#3051A0]"
                                : ""
                            }`}
                          >
                            <RectangleGroupIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                            <span className="ms-3">Dashboard</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
        <aside
          className="fixed top-0 left-0 z-40 w-64 md:w-fit lg:w-64 h-screen pt-20 transition-transform -translate-x-full bg-gray-100 border-r border-gray-200 sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  onClick={() => handleContainerChange("dashboard")}
                  className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-300 group ${
                    activeContainer === "dashboard"
                      ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                      : ""
                  }`}
                >
                  <RectangleGroupIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                  <div className="ms-3 lg:block md:hidden">Dashboard</div>
                </button>
              </li>

              {/* Events Menu */}
              <li>
                <button
                  onClick={() => toggleSubMenu("events")}
                  className="w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-300"
                >
                  <CalendarIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                  <span className="ml-3">Events</span>
                  {isEventsMenuOpen ? (
                    <ChevronUpIcon className="w-5 h-5 ms-auto" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 ms-auto" />
                  )}
                </button>
                {isEventsMenuOpen && (
                  <ul className="pl-8 space-y-2">
                    <li>
                      <button
                        onClick={() => handleContainerChange("addevent")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "addevent"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <CalendarIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Add Session
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("viewsession")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "viewsession"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <ClipboardDocumentIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          View Sessions
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("eventmanager")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "eventmanager"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <ClipboardDocumentIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Manage Events
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("livestream")}
                        className={`w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 ${
                          activeContainer === "livestream"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <VideoCameraIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ml-3">Live Stream</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("agendaadmin")}
                        className={`w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 ${
                          activeContainer === "agendaadmin"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <ClipboardDocumentCheckIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ml-3">Agendas</span>
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={() => handleContainerChange("wagon")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "wagon"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <TruckIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Add Wagon
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("eventpdf")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "eventpdf"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <DocumentArrowUpIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Event PDF
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("daywiseevent")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "daywiseevent"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <DocumentArrowUpIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Day Wise PDF
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("pdfwithtitle")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "pdfwithtitle"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <DocumentArrowUpIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          PDF With Title
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("generateidcard")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "generateidcard"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <IdentificationIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          General registration
                        </span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>
              {/* Management Menu */}
              <li>
                <button
                  onClick={() => toggleSubMenu("management")}
                  className="w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-300"
                >
                  <UserGroupIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                  <span className="ml-3">Management</span>
                  {isManagementMenuOpen ? (
                    <ChevronUpIcon className="w-5 h-5 ms-auto" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 ms-auto" />
                  )}
                </button>
                {isManagementMenuOpen && (
                  <ul className="pl-8 space-y-2">
                    <li>
                      <button
                        onClick={() => handleContainerChange("arrivalcheckin")}
                        className={`w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 ${
                          activeContainer === "arrivalcheckin"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <FaHotel className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ml-3">Registration Check-in</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("attendance")}
                        className={`w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 ${
                          activeContainer === "attendance"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <UserGroupIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ml-3">Attendance</span>
                      </button>
                    </li>
                    {/* Queries */}
                    <li>
                      <button
                        onClick={() => handleContainerChange("queries")}
                        className={`w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 ${
                          activeContainer === "queries"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ml-3">Queries</span>
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={() => handleContainerChange("allparticipants")}
                        className={`w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 ${
                          activeContainer === "allparticipants"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <UserGroupIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ml-3">User Details</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("allspeakers")}
                        className={`w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 ${
                          activeContainer === "allspeakers"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <SpeakerWaveIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ml-3">All Speaker</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("notification")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "notification"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <BellIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Notification
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("mealsexc")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "mealsexc"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <FolderOpenIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Meals/Excursion
                        </span>
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={() => handleContainerChange("venue")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "venue"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <BuildingOffice2Icon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Add Venue
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("kitcheck")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "kitcheck"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <ArchiveBoxIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3">Conference Kit</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("location")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "location"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <GlobeAmericasIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Track Journey
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("speaker")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "speaker"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <UserPlusIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Add Speaker
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("messages")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "messages"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <PaperAirplaneIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Add Messages
                        </span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* Gallery Menu */}
              <li>
                <button
                  onClick={() => toggleSubMenu("gallery")}
                  className="w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-300"
                >
                  <CameraIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                  <span className="ml-3">Gallery</span>
                  {isGalleryMenuOpen ? (
                    <ChevronUpIcon className="w-5 h-5 ms-auto" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 ms-auto" />
                  )}
                </button>
                {isGalleryMenuOpen && (
                  <ul className="pl-8 space-y-2">
                    <li>
                      <button
                        onClick={() => handleContainerChange("gallery")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "gallery"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <CameraIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">Gallery</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("banner")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "banner"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <PhotoIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Add Banner
                        </span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* Finance Menu
              <li>
                <button
                  onClick={() => toggleSubMenu("finance")}
                  className="w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-300"
                >
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                  <span className="ml-3">Finance</span>
                  {isFinanceMenuOpen ? (
                    <ChevronUpIcon className="w-5 h-5 ms-auto" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 ms-auto" />
                  )}
                </button>
                {isFinanceMenuOpen && (
                  <ul className="pl-8 space-y-2">
                    <li>
                      <button
                        onClick={() => handleContainerChange("generateinvoice")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "generateinvoice"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <CurrencyDollarIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Generate Invoice
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContainerChange("generatereceipt")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "generatereceipt"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <TicketIcon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Generate Receipt
                        </span>
                      </button>
                    </li>
                  </ul>
                )}
              </li> */}

              {/* Volunteer Menu */}
              <li>
                <button
                  onClick={() => toggleSubMenu("volunteermenu")}
                  className="w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-300"
                >
                  <MdVolunteerActivism className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                  <span className="ml-3">Volunteer</span>
                  {isFinanceMenuOpen ? (
                    <ChevronUpIcon className="w-5 h-5 ms-auto" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 ms-auto" />
                  )}
                </button>
                {isVolunteerMenuOpen && (
                  <ul className="pl-8 space-y-2">
                    <li>
                      <button
                        onClick={() => handleContainerChange("volunteer")}
                        className={`w-[100%] flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-200 group ${
                          activeContainer === "volunteer"
                            ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                            : ""
                        }`}
                      >
                        <MdVolunteerActivism className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                        <span className="ms-3 lg:block md:hidden">
                          Register Volunteer
                        </span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              {/* Logout */}
              <li>
                <button
                  onClick={() => handleContainerChange("logout")}
                  className={`w-full flex items-center p-2 text-gray-900 rounded-r-lg hover:bg-blue-300 ${
                    activeContainer === "logout"
                      ? "bg-blue-200 text-[#3051A0] border-l-4 border-[#3051A0]"
                      : ""
                  }`}
                >
                  <PowerIcon className="w-5 h-5 text-gray-500 transition group-hover:text-[#3051A0]" />
                  <span className="ml-3">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <LogoutModal
          open={showLogoutModal}
          setOpen={setShowLogoutModal}
          title="Confirm Logout"
          description="Are you sure you want to logout?"
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />

        <div
          className="p-4 sm:ml-64 pt-[75px]"
          style={{ backgroundImage: `url(${bg})` }}
        >
          {activeContainer === "dashboard" && <MainDashboard />}
          {activeContainer === "generateinvoice" && <GenerateInvoice />}
          {activeContainer === "generatereceipt" && <GenerateReceipt />}
          {activeContainer === "addevent" && <AddSession />}
          {activeContainer === "gallery" && <Gallery />}
          {activeContainer === "banner" && <BannerManager />}
          {activeContainer === "attendance" && <ParticipantAttendance />}
          {activeContainer === "notification" && <SendNotifications />}
          {activeContainer === "speaker" && <AddSpeaker />}
          {activeContainer === "viewsession" && <ViewSessions />}
          {activeContainer === "agendaadmin" && <AgendaAdmin />}
          {activeContainer === "generateidcard" && <GenerateIdCard />}
          {activeContainer === "eventmanager" && <EventManager />}
          {activeContainer === "messages" && <AdminMessage />}
          {activeContainer === "eventpdf" && <EventDetailsPdf />}
          {activeContainer === "venue" && <AddVenue />}
          {activeContainer === "wagon" && <AddWagon />}
          {activeContainer === "kitcheck" && <KitCheck />}
          {activeContainer === "mealsexc" && <MealsExcursionsAdmin />}
          {activeContainer === "location" && <UserLocation />}
          {activeContainer === "livestream" && <LiveStreamManager />}
          {activeContainer === "allparticipants" && <AllParticipants />}
          {activeContainer === "arrivalcheckin" && <CheckIn />}
          {activeContainer === "daywiseevent" && <DayWiseEvent />}
          {activeContainer === "pdfwithtitle" && <PdfWithTitle />}
          {activeContainer === "volunteer" && <VolunteerRegister />}
          {activeContainer === "allspeakers" && <AllSpeakers />}
          {activeContainer === "queries" && <Queries />}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
