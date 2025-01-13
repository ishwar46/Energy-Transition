import React from "react";
import { Typography } from "@mui/material";
import { styled, keyframes } from "@mui/system";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const GradientTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "40px",

  background: "linear-gradient(-45deg, #dbebff, #83a4d4, #b6fbff, #ffffff)",
  backgroundSize: "400% 400%",
  animation: `${gradientAnimation} 15s ease infinite`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  MozBackgroundClip: "text",
  MozTextFillColor: "transparent",
}));

const AnimatedTitle = () => {
  return (
    <GradientTypography component="h1" variant="h3" align="center" gutterBottom>
      Registration for ACSIC Conference Nepal 2024 will open soon.
    </GradientTypography>
  );
};

export default AnimatedTitle;
