import React, { useState, useEffect } from "react";
import Logo from "../assets/images/logo.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpCircleIcon,
  BellIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setIsLoggedIn(true);
      if (user.isAdmin) {
        setIsAdmin(true);
        setUsername("Admin");
      } else if (
        user.personalInformation &&
        user.personalInformation.fullName
      ) {
        setUsername(user.personalInformation.fullName.firstName);
      } else {
        setUsername("User");
      }
    } else {
      setIsLoggedIn(false);
      setUsername("Guest");
      setIsAdmin(false);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // const toggleLoginDropdown = () => {
  //   setLoginDropdownOpen(!loginDropdownOpen);
  // };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("Guest");
    setIsAdmin(false);
    navigate("/homepage");
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-white" : "text-blue-300";
  };

  return (
    <nav className="bg-[#001942] border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        {/* Main Logo */}
        <a
          href="/homepage"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src={Logo}
            className="h-10 md:h-12 lg:h-16 rounded"
            alt="Main Logo"
          />
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-8 h-8 justify-center text-sm text-gray-200 rounded-lg md:hidden hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navbar Links */}
        <div
          className={`w-full md:block md:w-auto ${isMenuOpen ? "" : "hidden"}`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col items-start lg:items-center p-4 mt-4 border border-gray-100 rounded-lg bg-[#001942] md:flex-row md:space-x-4 lg:space-x-6 md:mt-0 md:border-0">
            <li>
              <Link
                to="/"
                className={`block py-1 px-2 text-sm md:text-base lg:text-sm rounded ${isActive(
                  "/"
                )} md:bg-transparent md:p-0 hover:text-white`}
              >
                Home
              </Link>
            </li>
            <li className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-1 py-1 px-2 text-sm md:text-base lg:text-sm rounded text-blue-300 md:bg-transparent md:p-0 hover:text-white"
              >
                About Us
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <ul
                className={`${
                  dropdownOpen ? "block" : "hidden"
                } absolute bg-white text-black shadow-lg border rounded mt-1 min-w-max text-sm`}
              >
                <li>
                  <Link
                    to="/introduction"
                    className="block py-1 px-3 hover:bg-gray-200"
                  >
                    Introduction
                  </Link>
                </li>
                <li>
                  <Link
                    to="/aboutus"
                    className="block py-1 px-3 hover:bg-gray-200"
                  >
                    Mission and Vision
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ourteam"
                    className="block py-1 px-3 hover:bg-gray-200"
                  >
                    Meet Our Team
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link
                to="/event"
                className={`block py-1 px-2 text-sm md:text-base lg:text-sm rounded ${isActive(
                  "/event"
                )} md:bg-transparent md:p-0 hover:text-white`}
              >
                Schedule
              </Link>
            </li>
            <li>
              <Link
                to="/accomodation"
                className={`block py-1 px-2 text-sm md:text-base lg:text-sm rounded ${isActive(
                  "/accomodation"
                )} md:bg-transparent md:p-0 hover:text-white`}
              >
                Venue
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className={`block py-1 px-2 text-sm md:text-base lg:text-sm rounded ${isActive(
                  "/register"
                )} md:bg-transparent md:p-0 hover:text-white`}
              >
                Registration Form
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className={`block py-1 px-2 text-sm md:text-base lg:text-sm rounded ${isActive(
                  "/gallery"
                )} md:bg-transparent md:p-0 hover:text-white`}
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/chiefguest"
                className={`block py-1 px-2 text-sm md:text-base lg:text-sm rounded ${isActive(
                  "/chiefguest"
                )} md:bg-transparent md:p-0 hover:text-white`}
              >
                Chief Guest
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className={`block py-1 px-2 text-sm md:text-base lg:text-sm rounded text-blue-300 hover:text-white`}
              >
                <BellIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link
                to={isAdmin ? "/admindashboard" : "/userdashboard"}
                className="block py-1 px-2 text-sm md:text-base lg:text-sm text-white font-semibold md:p-0 hover:text-emerald-500"
              >
                👋 Hey! {username}
              </Link>
            </li>
            <li className="relative">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-1 mt-2 bg-red-500 text-white rounded hover:bg-red-600 block text-sm"
                >
                  <PowerIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex items-center px-3 py-1 mt-2 bg-green-700 text-white rounded hover:bg-green-600 block text-sm"
                >
                  <ArrowUpCircleIcon
                    className="h-5 w-5 mr-2"
                    aria-hidden="true"
                  />
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
