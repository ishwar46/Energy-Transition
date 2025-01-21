import React, { useState, useEffect } from "react";
import Logo from "../assets/images/nepal.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpCircleIcon,
  XCircleIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    return location.pathname === path
      ? "text-blue-700 font-bold"
      : "text-gray-600 hover:text-blue-500";
  };

  return (
    <nav className="bg-white border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-3">
        {/* Left Section with Logo and Text */}
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <img
            src={Logo}
            className="h-12 md:h-16 rounded"
            alt="Government Logo"
          />
          {/* Text */}
          <div className="hidden md:block">
            <h3 className="text-red-500 font-semibold text-xs md:text-xs whitespace-nowrap">
              Government of Nepal
            </h3>
            <h2 className="text-red-500 font-semibold text-base md:text-sm whitespace-nowrap">
              Ministry of Energy, Water Resources and Irrigation
            </h2>
            <h1 className="text-red-500 font-bold text-lg md:text-1xl whitespace-nowrap">
              Alternative Energy Promotion Centre
            </h1>
            <p className="text-gray-600 text-xs whitespace-nowrap">
              Making Renewable Energy Mainstream Supply in Nepal
            </p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-8 h-8 justify-center text-sm text-gray-800 rounded-lg md:hidden hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
          className={`w-full md:block md:w-auto ${
            isMenuOpen ? "block" : "hidden"
          }`}
          id="navbar-default"
        >
          {/* Close Button */}
          {isMenuOpen && (
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 md:hidden"
            >
              <XCircleIcon className="h-6 w-6 text-gray-600" />
            </button>
          )}
          <ul className="font-medium flex flex-col md:flex-row md:items-center md:space-x-6">
            <li>
              <Link
                to="/"
                className={`py-2 px-3 text-sm md:text-base ${isActive("/")}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/sessions"
                className={`py-2 px-3 text-sm md:text-base ${isActive(
                  "/sessions"
                )}`}
              >
                Session Details
              </Link>
            </li>
            <li>
              <Link
                to="/accomodation"
                className={`py-2 px-3 text-sm md:text-base ${isActive(
                  "/accomodation"
                )}`}
              >
                Venue
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className={`py-2 px-3 text-sm md:text-base ${isActive(
                  "/register"
                )}`}
              >
                Registration
              </Link>
            </li>
            <li>
              <Link
                to={isAdmin ? "/admindashboard" : "/userdashboard"}
                className={`py-2 px-3 text-sm md:text-base ${isActive(
                  "/userdashboard"
                )}`}
              >
                👋 Hey! {username}
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-red-500 hover:text-red-600"
                >
                  <PowerIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex items-center text-sm text-green-500 hover:text-green-600"
                >
                  <ArrowUpCircleIcon
                    className="h-5 w-5 mr-1"
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
