import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useStyles } from "../styles/styles.js";
import { Card, CardActionArea, CardContent, CircularProgress, Grid, Typography } from "@material-ui/core";
//import ErrorComponent from "./ErrorComponent";
import "../App.css";

const CurrentMatchesList = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [matchesData, setMatchesData] = useState([]);
  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        const { data } = await axios.get("http://localhost:4000/match/currentMatches");
        console.log(data);
        setMatchesData(data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  }, []);

  const buildCard = (match) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={match.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/match/${match.id}`}>
              <CardContent>
                <Typography className={classes.titleHead} gutterBottom variant="h6" component="h2">
                  {match.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {match && match.venue ? match.venue : ""}
                </Typography>

                <Typography variant="body2" color="textSecondary" component="p">
                  {match && match.teams ? match.teams[0] + " vs " + match.teams[1] : ""}
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
