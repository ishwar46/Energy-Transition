import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { checkTokenExpiration } from "../utils/checkTokenUtils.js";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import AlertTitle from "@mui/material/AlertTitle";

const AdminRoutes = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const checkAuthStatus = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      setUser(user);

      if (!token || !user || checkTokenExpiration()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAlertMessage("Session Expired. Please log in.");
        return;
      }

      if (!user.isAdmin) {
        navigate("/user/dashboard", { replace: true });
      }
    };

    // Check authentication status immediately
    checkAuthStatus();

    // Set up an interval to check authentication status every 5 minutes
    const intervalId = setInterval(checkAuthStatus, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [navigate]);

  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      {alertMessage ? (
        <Alert severity="warning">
          <AlertTitle>{alertMessage}</AlertTitle>
          <Link to="/admin" style={{ textDecoration: "none", color: "red" }}>
            Click here to login
          </Link>
        </Alert>
      ) : (
        user && user.isAdmin && <Outlet />
      )}
    </Stack>
  );
};

export default AdminRoutes;
