import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CommentSection from "../components/CommentSection";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignContent: "center",
    padding: "10px 40px",
  },
  matchDataContainer: {
    height: "694px",
    border: "1px solid black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& >span": {
      fontSize: "2rem",
    },
  },
});

const MatchPreview = (props) => {
  const classes = useStyles();

  return (
    <>
      <Grid container className={classes.container}>
        <Grid direction="row" container xs={12}>
          <Grid item xs={8} className={classes.matchDataContainer}>
            <span>Match Data will be displayed here</span>
          </Grid>
          <Grid item xs={4}>
            <CommentSection />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default MatchPreview;
