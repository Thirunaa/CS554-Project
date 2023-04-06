import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useStyles } from "../styles/singleElementStyles.js";
import { Box, Card, CardContent, CircularProgress, Typography, CardHeader, Button } from "@material-ui/core";
import "../App.css";

const Match = (props) => {
  const [matchData, setMatchData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  let { id } = useParams();
  const matchUrl = "https://api.cricapi.com/v1/match_info?";
  const API_KEY = "apikey=f9262a85-d559-439c-b1c0-4817f5e46208";

  useEffect(() => {
    console.log("SHOW useEffect fired");
    async function fetchData() {
      try {
        const { data } = await axios.get(matchUrl + API_KEY + "&id=" + id);
        console.log(data);
        setMatchData(data.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <Box
        style={{
          //   backgroundImage: `url(${bigImage})`,
          backgroundSize: "cover",
          height: "auto",
          color: "#0f0101",
        }}
      >
        <Card className={classes.card} variant="outlined">
          <CardHeader className={classes.titleHead} title={matchData && matchData.name ? matchData.name : ""} />
          {/* <CardMedia className={classes.media} component="img" image={bigImage} title="show image" /> */}

          <CardContent>
            <Typography variant="body2" color="textSecondary" component="span">
              <dl>
                <p>
                  <dt className="title">Match Type: </dt>
                  {matchData && matchData.matchType ? matchData.matchType : ""}
                </p>
                <p>
                  <dt className="title">Status: </dt>
                  {matchData && matchData.status ? matchData.status : ""}
                </p>
                <p>
                  <dt className="title">Venue: </dt>
                  {matchData && matchData.venue ? matchData.venue : ""}
                </p>
                <p>
                  <dt className="title">Date: </dt>
                  {matchData && matchData.date ? matchData.date : ""}
                </p>
                <p>
                  <dt className="title">Teams: </dt>

                  {matchData && matchData.teams && matchData.teams[0] && matchData.teams[1]
                    ? matchData.teams[0] + " vs " + matchData.teams[1]
                    : ""}
                </p>
              </dl>
              <br />
              <br />
              <Button
                to="/home"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
              >
                Back
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }
};

export default Match;
