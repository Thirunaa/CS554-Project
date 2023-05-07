import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useStyles } from "../styles/styles.js";
import Error400 from "../components/Error400.js";

import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  CircularProgress,
  Button,
  ButtonGroup,
  Grid,
  Typography,
  CardMedia,
} from "@material-ui/core";
//import { Alert } from "@mui/material";
import "../App.css";
import RouteNotFound from "../components/RouteNotFound.js";

const AllMatchesList = () => {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const navigate = useNavigate();
  let { pagenum } = useParams();
  pagenum = parseInt(pagenum);
  //const [prevPagePresent, setPrevPagePresent] = useState(false);
  const [nextPagePresent, setNextPagePresent] = useState(true);
  const [axiosError, setAxiosError] = useState("");
  const [loading, setLoading] = useState(true);
  const [matchesData, setMatchesData] = useState([]);
  let card = null;

  console.log("current user uid", currentUser.uid);
  useEffect(() => {
    console.log("on load useeffect all matches");
    async function fetchData() {
      try {
        let authtoken = await currentUser.getIdToken();
        let pageId = pagenum;
        const { data } = await axios.get("http://localhost:3001/matches/allMatches/page/" + pageId, {
          headers: { authtoken: authtoken },
        });
        //console.log(data);
        if (data.length < 25) {
          setNextPagePresent(false);
        }
        setAxiosError("");
        setMatchesData(data);
      } catch (e) {
        console.log(e);
        setAxiosError(e.response.data.message);
      }
    }
    fetchData();
    setLoading(false);
  }, [pagenum, currentUser]);

  console.log("Matches Data: ", matchesData);

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
                  <strong>Time:</strong>{" "}
                  {match && match.dateTimeGMT && convertTo12Hour(match.dateTimeGMT.slice(11, 16))}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <strong>Status: </strong>
                  {match && match.matchStarted ? (
                    <span style={{ color: "green" }}>{match.status}</span>
                  ) : (
                    <span style={{ color: "red" }}>{match.status}</span>
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
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

  if (axiosError !== "") {
    if (axiosError.includes("400")) {
      return (
        <div>
          <Error400 />;
        </div>
      );
    } else {
      return (
        <div>
          <RouteNotFound />;
        </div>
      );
    }
  }

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div>
        <Container>
          <ButtonGroup disableElevation variant="contained" color="secondary">
            {pagenum !== 0 && (
              <Button
                style={{ marginRight: "10px" }}
                variant={"contained"}
                onClick={() => {
                  navigate("/all-matches/page/" + parseInt(parseInt(pagenum) - 1), {
                    replace: true,
                  });
                }}
              >
                PREVIOUS
              </Button>
            )}
            {nextPagePresent && (
              <Button
                style={{ marginRight: "10px" }}
                variant={"contained"}
                onClick={() => {
                  navigate("/all-matches/page/" + parseInt(parseInt(pagenum) + 1), {
                    replace: true,
                  });
                }}
              >
                NEXT
              </Button>
            )}
          </ButtonGroup>
        </Container>
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
        <br />
      </div>
    );
  }
};

export default AllMatchesList;
