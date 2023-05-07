import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../firebase/Auth";
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
//import MatchPrediction from "./MatchPrediction.js";
import "../App.css";

import noNewsImage from "../images/noNewsImage.png";
//import Predict from "../components/Predict";

const Match = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [matchData, setMatchData] = useState(undefined);
  // eslint-disable-next-line
  const [matchDataFromDB, setMatchDataFromDB] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [predictionObj, setPredictionObj] = useState();
  const [prediction, setPrediction] = useState("");
  const [scoreList, setScoreList] = useState([]);
  const classes = useStyles();
  let { id } = useParams();
  // eslint-disable-next-line
  const [matchId, setMatchId] = useState(id);

  // eslint-disable-next-line
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [team1Percent, setTeam1Percent] = useState(0);
  const [team2Percent, setTeam2Percent] = useState(0);
  const [tiePercent, setTiePercent] = useState(0);

  const userId = currentUser.uid;

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

  function handleClick(button) {
    setPrediction(button);
  }

  function setPredictionPercentage(match) {
    // Calculate percentages
    const totalPredictions =
      match.predictions.team1.length + match.predictions.team2.length + match.predictions.tie.length;
    if (totalPredictions > 0) {
      const team1Percent = (match.predictions.team1.length / totalPredictions) * 100;
      const team2Percent = (match.predictions.team2.length / totalPredictions) * 100;
      const tiePercent = (match.predictions.tie.length / totalPredictions) * 100;
      setTeam1Percent(team1Percent.toFixed(2));
      setTeam2Percent(team2Percent.toFixed(2));
      setTiePercent(tiePercent.toFixed(2));
    }
  }

  useEffect(() => {
    console.log(prediction);

    async function fetchData() {
      let authtoken = await currentUser.getIdToken();
      try {
        const { data } = await axios.post(
          "http://localhost:3001/matches/match/" + id + "/predict",
          {
            prediction,
          },
          {
            headers: {
              authtoken: authtoken,
            },
          }
        );
        console.log("from axios", data);
        setMatchDataFromDB(data);
        setMatchData(data.data);
        setPredictionObj(data.predictions);
        setPredictionPercentage(data);
        setLoading(false);
      } catch (e) {
        //setMatch(matchData);
        console.log(e);
      }
    }
    fetchData();
  }, [id, prediction, currentUser]);

  useEffect(() => {
    console.log("Match data useEffect fired");
    async function fetchData() {
      let authtoken = await currentUser.getIdToken();
      try {
        const { data } = await axios.get("http://localhost:3001/matches/match/" + matchId, {
          headers: { authtoken: authtoken },
        });
        let scoresArray = [];
        console.log(data);
        setMatchDataFromDB(data);
        setMatchData(data.data);
        setPredictionObj(data.predictions);
        setPredictionPercentage(data);
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
  }, [matchId, currentUser]);

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
                <Typography variant="body2" color="textSecondary" component="div">
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
                        <>
                          <dt className="title">Toss</dt>
                          {matchData.tossWinner
                            ? matchData.tossWinner + " won the toss and chose to " + matchData.tossChoice
                            : "Toss not yet decided"}
                        </>
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

                  {/* Prediction button logic */}
                  {!predictionObj.team1.includes(userId) &&
                    !predictionObj.team2.includes(userId) &&
                    !predictionObj.tie.includes(userId) && (
                      <div>
                        <Button color="primary" onClick={() => handleClick("team1")} variant="contained">
                          {matchData?.teams[0]}
                        </Button>
                        <Button onClick={() => handleClick("tie")} variant="contained">
                          Tie
                        </Button>
                        <Button color="secondary" onClick={() => handleClick("team2")} variant="contained">
                          {matchData?.teams[1]}
                        </Button>
                      </div>
                    )}
                  {predictionObj.team1.includes(userId) &&
                    !predictionObj.team2.includes(userId) &&
                    !predictionObj.tie.includes(userId) && (
                      <div>
                        <Button onClick={() => handleClick("tie")} variant="contained">
                          Tie
                        </Button>
                        <Button color="secondary" onClick={() => handleClick("team2")} variant="contained">
                          {matchData?.teams[1]}
                        </Button>
                      </div>
                    )}

                  {!predictionObj.team1.includes(userId) &&
                    predictionObj.team2.includes(userId) &&
                    !predictionObj.tie.includes(userId) && (
                      <div>
                        <Button color="primary" onClick={() => handleClick("team1")} variant="contained">
                          {matchData?.teams[0]}
                        </Button>
                        <Button onClick={() => handleClick("tie")} variant="contained">
                          Tie
                        </Button>
                      </div>
                    )}

                  {!predictionObj.team1.includes(userId) &&
                    !predictionObj.team2.includes(userId) &&
                    predictionObj.tie.includes(userId) && (
                      <div>
                        <Button color="primary" onClick={() => handleClick("team1")} variant="contained">
                          {matchData?.teams[0]}
                        </Button>
                        <Button color="secondary" onClick={() => handleClick("team2")} variant="contained">
                          {matchData?.teams[1]}
                        </Button>
                      </div>
                    )}

                  <p>
                    Predictions for {matchData?.teams[0]} ({team1Percent}) Predictions for {matchData?.teams[1]} (
                    {team2Percent}) Predictions for Tie ({tiePercent})
                  </p>
                  {/* End of Prediction button logic */}
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
