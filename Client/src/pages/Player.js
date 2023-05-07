import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import "../App.css";

const useStyles = makeStyles({
  table: {
    "& td": {
      border: "none",
      padding: 0,
      paddingBottom: "0.5rem",
      width: "fit-content",
    },
    "& th": {
      border: "none",
      fontWeight: "bold",
    },
  },
  alignLeft: {
    textAlign: "start",
  },
  itemPadding: {
    padding: "2%",
  },
  header: {
    textAlign: "start",
    display: "flex",
    gap: "3rem",
    "& h1": {
      fontSize: "3rem",
      marginBottom: "5px",
    },
    "& h4": {
      fontSize: "1.8rem",
      margin: "0",
      marginBottom: "1rem",
      color: "gray",
    },
    marginBottom: "1rem",
  },
  playerInfo: {
    "& div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "0rem",
      "& table": {
        width: "100%",
        padding: "0",
      },
    },
    backgroundColor: "#efefef",
    padding: "1rem",
    marginRight: "2rem",
  },
  subheading: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    marginTop: "1rem",
  },
  bold: {
    fontWeight: "bold",
  },
  playerImg: {
    maxWidth: "200px",
  },
});

const STATS_HEADERS = {
  batting: ["M", "Inn", "NO", "Runs", "HS", "Avg", "BF", "SR", "100s", "200s", "50s", "4s", "6s"],
  bowling: ["M", "Inn", "B", "Runs", "Wkts", "BBI", "BBM", "Econ", "Avg", "SR", "5W", "10W"],
};

const Player = (props) => {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  // eslint-disable-next-line
  const [favourite, setFavourite] = useState();
  const [playerData, setPlayerData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  let { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        let authtoken = await currentUser.getIdToken();
        setLoading(true);
        const {
          data: { playerObj, user },
        } = await axios.get("http://localhost:3001/players/player/" + id, {
          headers: { authtoken: authtoken },
        });
        console.log(playerObj);
        console.log(user);
        if (playerObj) {
          setPlayerData(playerObj);
        } else {
          setLoading(false);
          alert("No data found");
        }
        setUserData(user);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, [id, currentUser]);

  //favouritePlayers

  async function fetchUserData() {
    try {
      let authtoken = await currentUser.getIdToken();
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3001/users/addFavourite/" + id,
        {},
        {
          headers: { authtoken: authtoken },
        }
      );
      setUserData(data);
      console.log(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  function handleClick() {
    fetchUserData();
  }

  return loading && !playerData && !userData ? (
    <CircularProgress />
  ) : (
    <>
      <Grid container className={classes.itemPadding}>
        <Grid item xs={12}>
          <Grid direction="row" justifyContent="flex-start" alignItems="flex-end" container className={classes.header}>
            <Grid item>
              <img alt={playerData?.name} className={classes.playerImg} src={playerData?.playerImg || ""} />
            </Grid>
            <Grid item>
              <h1>{playerData?.name || ""}</h1>
              <h4>{playerData?.country || ""}</h4>
            </Grid>
            {!userData?.favouritePlayers.includes(id) && (
              <Button variant="contained" color="primary" onClick={() => handleClick()}>
                Add to Favourites
              </Button>
            )}
            {userData?.favouritePlayers.includes(id) && (
              <Button variant="contained" color="primary" onClick={() => handleClick()}>
                Remove from Favourites
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <PersonalInfo classes={classes} playerData={playerData} />
        </Grid>
        <Grid item xs={9}>
          <Grid container xs={12}>
            <Box>
              <h2 className={classes.subheading}>Batting Career Summary</h2>
            </Box>
            <StatsTable stats={playerData?.stats?.batting} classes={classes} type="batting" />
            <Box>
              <h2 className={classes.subheading}>Bowling Career Summary</h2>
            </Box>
            <StatsTable stats={playerData?.stats?.bowling} classes={classes} type="bowling" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

function StatsTable({ type, classes, stats }) {
  return type === "batting" ? (
    <>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              {STATS_HEADERS.batting.map((x) => {
                return (
                  <TableCell padding="none" align="left">
                    {x}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {stats?.map((x) => {
              return (
                <TableRow>
                  <TableCell component="th" scope="row">
                    {x.matchtype.toUpperCase()}
                  </TableCell>
                  <TableCell align="left">{x.m || "-"}</TableCell>
                  <TableCell align="left">{x.inn || "-"}</TableCell>
                  <TableCell align="left">{x.no || "-"}</TableCell>
                  <TableCell align="left">{x.runs || "-"}</TableCell>
                  <TableCell align="left">{x.hs || "-"}</TableCell>
                  <TableCell align="left">{x.avg || "-"}</TableCell>
                  <TableCell align="left">{x.bf || "-"}</TableCell>
                  <TableCell align="left">{x.sr || "-"}</TableCell>
                  <TableCell align="left">{x["100s"] || "-"}</TableCell>
                  <TableCell align="left">{x["200s"] || "-"}</TableCell>
                  <TableCell align="left">{x["50s"] || "-"}</TableCell>
                  <TableCell align="left">{x["4s"] || "-"}</TableCell>
                  <TableCell align="left">{x["6s"] || "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  ) : (
    <>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              {STATS_HEADERS.bowling.map((x) => {
                return <TableCell align="left">{x}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {stats?.map((x) => {
              return (
                <TableRow>
                  <TableCell component="th" scope="row">
                    {x.matchtype.toUpperCase()}
                  </TableCell>
                  <TableCell align="left">{x.m || "-"}</TableCell>
                  <TableCell align="left">{x.inn || "-"}</TableCell>
                  <TableCell align="left">{x.b || "-"}</TableCell>
                  <TableCell align="left">{x.runs || "-"}</TableCell>
                  <TableCell align="left">{x.wkts || "-"}</TableCell>
                  <TableCell align="left">{x.bbi || "-"}</TableCell>
                  <TableCell align="left">{x.bbm || "-"}</TableCell>
                  <TableCell align="left">{x.econ || "-"}</TableCell>
                  <TableCell align="left">{x.avg || "-"}</TableCell>
                  <TableCell align="left">{x.sr || "-"}</TableCell>
                  <TableCell align="left">{x["5w"] || "-"}</TableCell>
                  <TableCell align="left">{x["10w"] || "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function PersonalInfo({ playerData, classes }) {
  return (
    <>
      <Box className={classes.playerInfo}>
        <div>
          <h3 className={(classes.alignLeft, classes.subheading)}>Personal Information</h3>
          {playerData && (
            <TableContainer>
              <Table className={classes.table}>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.bold}>Born</TableCell>
                    <TableCell>{playerData?.dateOfBirth || "--"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.bold}>Birth Place</TableCell>
                    <TableCell>{playerData?.placeOfBirth || "--"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.bold}>Height</TableCell>
                    <TableCell>{playerData?.height || "--"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.bold}>Role</TableCell>
                    <TableCell>{playerData?.role}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.bold}>Batting Style</TableCell>
                    <TableCell>{playerData?.battingStyle}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.bold}>Bowling Style</TableCell>
                    <TableCell>{playerData?.bowlingStyle}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <h3 className={(classes.alignLeft, classes.subheading)}>ICC Rankings</h3>
          {playerData && (
            <TableContainer>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="none"></TableCell>
                    <TableCell padding="none">Test</TableCell>
                    <TableCell padding="none">ODI</TableCell>
                    <TableCell padding="none">T20</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell padding="none">Batting</TableCell>
                    <TableCell padding="none">{playerData?.iccRankings?.batting?.test || "--"}</TableCell>
                    <TableCell padding="none">{playerData?.iccRankings?.batting?.odi || "--"}</TableCell>
                    <TableCell padding="none">{playerData?.iccRankings?.batting?.t20 || "--"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell padding="none">Bowling</TableCell>
                    <TableCell padding="none">{playerData?.iccRankings?.bowling?.test || "--"}</TableCell>
                    <TableCell padding="none">{playerData?.iccRankings?.bowling?.odi || "--"}</TableCell>
                    <TableCell padding="none">{playerData?.iccRankings?.bowling?.t20 || "--"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </Box>
    </>
  );
}

export default Player;
