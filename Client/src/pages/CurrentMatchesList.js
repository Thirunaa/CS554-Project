import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useStyles } from "../styles/styles.js";
import { Card, CardActionArea, CardContent, CircularProgress, Grid, Typography, CardMedia } from "@material-ui/core";
//import ErrorComponent from "./ErrorComponent";
import "../App.css";
import { AuthContext } from "../firebase/Auth";

const CurrentMatchesList = () => {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [matchesData, setMatchesData] = useState([]);
  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        let authtoken = await currentUser.getIdToken();
        const { data } = await axios.get("http://localhost:3001/matches/currentMatches", {
          headers: { authtoken: authtoken },
        });
        console.log(data);
        setMatchesData(data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  }, [currentUser]);

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

  const buildCard = (match) => {
    return (
      <Grid item xs={12} key={match.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/match/${match.id}`}>
              <CardContent>
                <Typography className={classes.titleHead} gutterBottom variant="h6" component="h2">
                  {match.name && match.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <strong>Date:</strong> {match && match.dateTimeGMT && match.dateTimeGMT.slice(0, 10)}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {match && match.matchStarted ? (
                    <div>
                      <strong>Started At:</strong>

                      {match && match.dateTimeGMT && convertTo12Hour(match.dateTimeGMT.slice(11, 16))}
                    </div>
                  ) : (
                    <div>
                      <strong>Starts At:</strong>

                      {match && match.dateTimeGMT && convertTo12Hour(match.dateTimeGMT.slice(11, 16))}
                    </div>
                  )}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <strong>Status: </strong>
                  {match && match.matchStarted ? (
                    <span style={{ color: "green" }}>{match.status}</span>
                  ) : (
                    <span style={{ color: "red" }}>{match.status}</span>
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  <strong>Teams:</strong>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <CardMedia>
                    {match &&
                      match.teamInfo &&
                      match.teamInfo[0] &&
                      match.teamInfo[0].img &&
                      match.teamInfo[1] &&
                      match.teamInfo[1].img && (
                        <img src={match.teamInfo[0].img} alt={match.teamInfo[0].name} height={35} width={60} />
                      )}
                    {match.teams?.[0]}
                  </CardMedia>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      margin: "0 1rem",
                    }}
                  >
                    vs
                  </Typography>
                  <CardMedia>
                    {match &&
                      match.teamInfo &&
                      match.teamInfo[0] &&
                      match.teamInfo[0].img &&
                      match.teamInfo[1] &&
                      match.teamInfo[1].img && (
                        <img src={match.teamInfo[1].img} alt={match.teamInfo[1].name} height={35} width={60} />
                      )}
                    {match.teams?.[1]}
                  </CardMedia>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  card =
    matchesData &&
    matchesData.map((match) => {
      return buildCard(match);
    });

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div>
        <br />
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
        <br />
        <br />
      </div>
    );
  }
};

export default CurrentMatchesList;
