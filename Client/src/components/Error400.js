import React from "react";
import { Typography } from "@mui/material";
function Error400() {
  return (
    <div>
      <br />
      <br />
      <Typography variant="h1">400</Typography>
      <Typography component="h2" variant="overline">
        {"Page not found! - Invalid Route"}
      </Typography>
      <Typography component="h2" variant="overline">
        {"Please click on Home!"}
      </Typography>
    </div>
  );
}

export default Error400;
