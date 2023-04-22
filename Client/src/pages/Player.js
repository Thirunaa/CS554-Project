import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useStyles } from "../styles/singleElementStyles.js";
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

const Player = (props) => {
  const [playerData, setplayerData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [statList, setstatList] = useState([]);
  const classes = useStyles();
  let { id } = useParams();
  const playerUrl = "https://api.cricapi.com/v1/players_info?";
  const API_KEY = "apikey=f9262a85-d559-439c-b1c0-4817f5e46208";

  useEffect(() => {
    console.log("SHOW useEffect fired");
    async function fetchData() {
      try {
        const { data } = await axios.get(playerUrl + API_KEY + "&id=" + id);
        let statsArray = [];
        console.log(data);
        setplayerData(data.data);
        // set stat
        if (data.data && data.data.stats) {
          for (const stat of data.data.stats) {
            statsArray.push(
              (stat.fn + " - " + stat.matchtype + " - " + stat.stat + " - " + stat.value + " ").toString()
            );
          }
        }
        setstatList(statsArray);
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
          //backgroundImage: `url(${bigImage})`,
          backgroundSize: "cover",
          height: "auto",
          color: "#0f0101",
        }}
      >
        <Card className={classes.card} variant="outlined">
          <CardHeader className={classes.titleHead} title={playerData && playerData.name ? playerData.name : ""} />
          <Grid container wrap="nowrap">
            <CardMedia
              component="img"
              image={playerData && playerData.playerImg ? playerData.playerImg : ""}
              title="show image"
              sx={{ objectFit: "contain" }}
            />
          </Grid>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="span">
              <dl>
                <p>
                  <dt className="title">Date Of Birth: </dt>
                  {playerData && playerData.dateOfBirth ? playerData.dateOfBirth.slice(0, 10) : ""}
                </p>

                <p>
                  <dt className="title">Role: </dt>
                  {playerData && playerData.role ? playerData.role : ""}
                </p>
                <p>
                  <dt className="title">Batting Style: </dt>
                  {playerData && playerData.battingStyle ? playerData.battingStyle : ""}
                </p>
                <p>
                  <dt className="title">Bowling Style: </dt>
                  {playerData && playerData.bowlingStyle ? playerData.bowlingStyle : ""}
                </p>
                <p>
                  <dt className="title">Country: </dt>
                  {playerData && playerData.country ? playerData.country : ""}
                </p>

                {statList.length !== 0 && (
                  <p>
                    <dt className="title">Stats</dt>

                    {statList.map((s) => {
                      return <Grid>{s}</Grid>;
                    })}
                  </p>
                )}
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

export default Player;
