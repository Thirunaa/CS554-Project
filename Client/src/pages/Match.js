import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useStyles } from "../styles/singleElementStyles.js";
// import App.css
import "../App.css";
import {
  Box,
  Card,
  Grid,
  CardContent,
  CircularProgress,
  Typography,
  CardHeader,
  CardMedia,
  Button,
} from "@material-ui/core";
import "../App.css";
// change a different image
import noNewsImage from "../images/noNewsImage.png";
const Match = (props) => {
  const [matchData, setMatchData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [scoreList, setScoreList] = useState([]);
  const classes = useStyles();
  let { id } = useParams();
  //const matchUrl = "https://api.cricapi.com/v1/match_info?";
  //const API_KEY = "apikey=f9262a85-d559-439c-b1c0-4817f5e46208";

  useEffect(() => {
    console.log("SHOW useEffect fired");
    async function fetchData() {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/matches/match/" + id
        );
        let scoresArray = [];
        console.log(data);
        setMatchData(data);
        // set score
        if (data && data.score) {
          for (const score of data.score) {
            scoresArray.push(
              (
                score.inning +
                " - " +
                score.r +
                "/" +
                score.w +
                "   Overs: " +
                score.o +
                " "
              ).toString()
            );
          }
        }
        setScoreList(scoresArray);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [id]);

  function convertTo12Hour(timeString) {
    const [hour, minute] = timeString.split(":").map(Number);
    let amPm = "AM";
    let hour12 = hour;

    if (hour >= 12) {
      amPm = "PM";
      hour12 = hour - 12;
    }

    if (hour12 === 0) {
      hour12 = 12;
    }

    return `${hour12.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${amPm}`;
  }

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <Box
            style={{
              //   backgroundImage: `url(${bigImage})`,
              backgroundSize: "cover",
              height: "auto",
              color: "#0f0101",
            }}
          >
            <Card className={classes.card} variant="outlined">
              <CardHeader
                className={classes.titleHead}
                title={matchData && matchData.name ? matchData.name : ""}
              />
              <Grid container wrap="nowrap">
                <CardMedia
                  className={classes.media}
                  component="img"
                  image={
                    matchData &&
                    matchData.teamInfo &&
                    matchData.teamInfo[0]?.img &&
                    matchData.teamInfo[1]?.img
                      ? matchData.teamInfo[0].img
                      : noNewsImage
                  }
                  title="show image"
                />
                <CardMedia
                  className={classes.media}
                  component="img"
                  image={
                    matchData &&
                    matchData.teamInfo &&
                    matchData.teamInfo[0]?.img &&
                    matchData.teamInfo[1]?.img
                      ? matchData.teamInfo[1].img
                      : noNewsImage
                  }
                  title="show image"
                />
              </Grid>
              <CardContent>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  <dl>
                    {scoreList.length !== 0 && (
                      <p>
                        <dt className="title">Score </dt>

                        {scoreList.map((s) => {
                          return <Grid>{s}</Grid>;
                        })}
                      </p>
                    )}
                    <p>
                      {matchData && matchData.matchStarted && (
                        <div>
                          <dt className="title">Toss</dt>
                          {matchData.tossWinner
                            ? matchData.tossWinner +
                              " won the toss and chose to " +
                              matchData.tossChoice
                            : "Toss not yet decided"}
                        </div>
                      )}
                    </p>
                    <p>
                      <dt className="title">Status</dt>
                      {matchData && matchData.status ? matchData.status : ""}
                    </p>
                    <p>
                      <dt className="title">Venue</dt>
                      {matchData && matchData.venue ? matchData.venue : ""}
                    </p>
                    <p>
                      <dt className="title">Date</dt>
                      {matchData && matchData.date ? matchData.date : ""}
                    </p>
                    {matchData && matchData.date && matchData.dateTimeGMT ? (
                      <p>
                        <dt className="title">Time</dt>
                        {convertTo12Hour(matchData.dateTimeGMT.slice(11, 16))}
                      </p>
                    ) : (
                      ""
                    )}

                    <p>
                      <dt className="title">Teams</dt>

                      {matchData &&
                      matchData.teams &&
                      matchData.teams[0] &&
                      matchData.teams[1]
                        ? matchData.teams[0] + " vs " + matchData.teams[1]
                        : ""}
                    </p>
                  </dl>
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
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
        </Grid>
        <Grid item>
          <Box></Box>
        </Grid>
      </Grid>
    );
  }
};

export default Match;
