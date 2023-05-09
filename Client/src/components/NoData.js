import React from "react";
import { Typography } from "@mui/material";
function NoData() {
  return (
    <div>
      <br />
      <br />
      <Typography variant="h1">No Data</Typography>
      <Typography component="h2" variant="overline">
        {"No data available for this Page. Please try a lesser page number."}
      </Typography>
      <Typography component="h2" variant="overline">
        {"Please click on Home!"}
      </Typography>
    </div>
  );
}

export default NoData;
