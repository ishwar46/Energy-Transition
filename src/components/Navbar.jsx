import React, { useState, useEffect } from "react";
import Logo from "../assets/images/nepal.png";
import NepalFlag from "../assets/images/nepal-flag.gif";
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
    navigate("/admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("Guest");
    setIsAdmin(false);
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-blue-700 font-bold"
      : "text-gray-600 hover:text-blue-500";
  };

  return (
    <nav className="bg-white border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-3">
        {/* Left Section with Logo and Government Text */}
        <div className="flex items-center space-x-3">
          <img
            src={Logo}
            className="h-12 md:h-16 rounded"
            alt="Government Logo"
          />
          <div>
            <h3 className="text-red-500 font-semibold text-xs md:text-xs">
              Government of Nepal
            </h3>
            <h2 className="text-red-500 font-normal text-xs md:text-sm">
              Ministry of Energy, Water Resources and Irrigation
            </h2>
            <h1 className="text-red-500 font-bold text-sm md:text-lg">
              Alternative Energy Promotion Centre
            </h1>
            <p className="text-gray-600 text-xs">
              Making Renewable Energy Mainstream Supply in Nepal
            </p>
          </div>
        </div>

        {/* Right Section: Flag and Navbar Links */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Navbar Links */}
          <Link to="/" className={`text-sm font-medium ${isActive("/")}`}>
            Home
          </Link>
          <Link
            to="/sessions"
            className={`text-sm font-medium ${isActive("/sessions")}`}
          >
            Session Details
          </Link>
          <Link
            to="/accomodation"
            className={`text-sm font-medium ${isActive("/accomodation")}`}
          >
            Venue
          </Link>
          <Link
            to="/register"
            className={`text-sm font-medium ${isActive("/register")}`}
          >
            Registration
          </Link>
          <Link
            to={isAdmin ? "/admindashboard" : "/userdashboard"}
            className="text-sm font-medium text-gray-800 hover:text-blue-500"
          >
            👋 Hey! {username}
          </Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center"
            >
              <PowerIcon className="h-5 w-5 mr-1" />
              Logout
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="text-sm font-medium text-green-500 hover:text-green-600 flex items-center"
            >
              <ArrowUpCircleIcon className="h-5 w-5 mr-1" />
              Login
            </button>
          )}
          {/* Nepal Flag */}
          <img
            src={NepalFlag}
            className="h-12 w-auto rounded transform -scale-x-100"
            alt="Nepal Flag"
          />
        </div>

        {/* Hamburger Menu Button */}
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
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-40 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={toggleMenu}
        ></div>

        {/* Menu Content */}
        <div
          className={`absolute top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-lg transform transition-transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-300 focus:outline-none"
          >
            <XCircleIcon className="h-6 w-6 text-gray-600" />
          </button>

          {/* Menu Links */}
          <ul className="space-y-6 mt-16 px-6 text-gray-800">
            <li>
              <Link
                to="/"
                className={`block text-lg font-medium ${isActive("/")}`}
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/sessions"
                className={`block text-lg font-medium ${isActive("/sessions")}`}
                onClick={toggleMenu}
              >
                Session Details
              </Link>
            </li>
            <li>
              <Link
                to="/accomodation"
                className={`block text-lg font-medium ${isActive(
                  "/accomodation"
                )}`}
                onClick={toggleMenu}
              >
                Venue
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className={`block text-lg font-medium ${isActive("/register")}`}
                onClick={toggleMenu}
              >
                Registration
              </Link>
            </li>
            <li>
              <Link
                to={isAdmin ? "/admindashboard" : "/userdashboard"}
                className={`block text-lg font-medium ${isActive(
                  "/userdashboard"
                )}`}
                onClick={toggleMenu}
              >
                👋 Hey! {username}
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block text-lg text-red-500 hover:text-red-600 font-medium flex items-center"
                >
                  <PowerIcon className="h-5 w-5 mr-2" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLoginClick();
                    toggleMenu();
                  }}
                  className="block text-lg text-green-500 hover:text-green-600 font-medium flex items-center"
                >
                  <ArrowUpCircleIcon className="h-5 w-5 mr-2" />
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
