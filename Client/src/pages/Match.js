import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useStyles } from "../styles/singleElementStyles.js";
// import App.css
import "../App.css";
import io from "socket.io-client";
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
import MatchPrediction from "./MatchPrediction.js";
import "../App.css";

import noNewsImage from "../images/noNewsImage.png";

const Match = (props) => {
  const [matchData, setMatchData] = useState(undefined);
  const [matchDataFromDB, setMatchDataFromDB] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [scoreList, setScoreList] = useState([]);
  const classes = useStyles();
  let { id } = useParams();

  // eslint-disable-next-line
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

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

    return `${hour12.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${amPm}`;
  }

  function handleInputChange(event) {
    setMessage(event.target.value);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    // Send the new message to the server
    const socket = io("http://localhost:3002");
    console.log("SENDING MESSAGE");
    console.log("ID: " + id);
    console.log("MESSAGE: " + message);
    socket.emit("message", { id, message });

    // Clear the message input
    setMessage("");
  }

  useEffect(() => {
    console.log("SHOW useEffect fired");
    async function fetchData() {
      try {
        const { data } = await axios.get("http://localhost:3001/matches/match/" + id);
        let scoresArray = [];
        console.log(data);
        setMatchDataFromDB(data);
        setMatchData(data.data);
        // set score
        if (data && data.score) {
          for (const score of data.score) {
            scoresArray.push(
              (score.inning + " - " + score.r + "/" + score.w + "   Overs: " + score.o + " ").toString()
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

  useEffect(() => {
    // Set up Socket.io connection
    const socket = io("http://localhost:3002");

    // Join the chat room for the current match
    socket.emit("join", id);

    // Listen for new messages
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the Socket.io connection
    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <Grid id={matchData.id} container justifyContent="center" alignItems="center">
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
              <CardHeader className={classes.titleHead} title={matchData && matchData.name ? matchData.name : ""} />
              <Grid container wrap="nowrap">
                <CardMedia
                  className={classes.media}
                  component="img"
                  image={
                    matchData && matchData.teamInfo && matchData.teamInfo[0]?.img && matchData.teamInfo[1]?.img
                      ? matchData.teamInfo[0].img
                      : noNewsImage
                  }
                  title="show image"
                />
                <CardMedia
                  className={classes.media}
                  component="img"
                  image={
                    matchData && matchData.teamInfo && matchData.teamInfo[0]?.img && matchData.teamInfo[1]?.img
                      ? matchData.teamInfo[1].img
                      : noNewsImage
                  }
                  title="show image"
                />
              </Grid>
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="span">
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
                            ? matchData.tossWinner + " won the toss and chose to " + matchData.tossChoice
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

                      {matchData && matchData.teams && matchData.teams[0] && matchData.teams[1]
                        ? matchData.teams[0] + " vs " + matchData.teams[1]
                        : ""}
                    </p>
                  </dl>
                  <MatchPrediction key={matchData.id} matchData={matchDataFromDB} />
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

                  {matchData.bbbEnabled && <Link to={"/match_bbb/" + matchData.id}> Ball By Ball Details</Link>}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item>
          <div>
            <ul>
              {messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
            <form onSubmit={handleFormSubmit}>
              <input type="text" value={message} onChange={handleInputChange} />
              <button type="submit">Send</button>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
};

export default Match;
