import React from "react";
import { Box, Typography } from "@material-ui/core";
//import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div>
      <Box
        style={{ display: "flex", justifyContent: "center" }}
        sx={{ bgcolor: "background.paper", p: 6 }}
        component="footer"
      >
        <Typography style={{ marginRight: "3px" }} variant="body2" align="center" color="textSecondary">
          All rights reserved!
        </Typography>

        <Typography variant="body2" color="textSecondary" align="center">
          Copyright ©
          <Link style={{ marginLeft: "3px" }} color="inherit" to="/">
            LiveCricketHub
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Box>
    </div>
  );
}

export default Footer;
