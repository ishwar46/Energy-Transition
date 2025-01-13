import React from "react";
import { Typography, Box } from "@mui/material";

const FooterNew = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Box>
        <Typography
          variant="body1"
          textAlign="center"
          color="textPrimary"
          style={{
            fontWeight: "bold",
          }}
        >
          Secretariat, 36th ACSIC Conference
          <br />
          Deposit & Credit Guarantee Fund (DCGF)
          <br />
          Kathmandu, Nepal
        </Typography>
      </Box>
    </Box>
  );
};

export default FooterNew;
