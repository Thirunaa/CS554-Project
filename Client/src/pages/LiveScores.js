import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";
import { Grid, Card, CardContent } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useStyles } from "../styles/liveScoresStyles.js";
import { useNavigate } from "react-router-dom";

function LiveScores() {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const [currMatch, setCurrMatch] = useState(0);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        let authtoken = await currentUser.getIdToken();
        const { data } = await axios.get("http://localhost:3001/matches/liveScores", {
          headers: { authtoken: authtoken },
        });
        console.log(data);
        setMatches(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMatches();
  }, [currentUser]);
  return (
    <>
      {matches.length > 0 && (
        <div className={classes.carousel} style={{ backgroundColor: "#2196f3", height: 235 }}>
          <div style={{ margin: "0 100px", position: "relative" }}>
            <div
              className={classes.item}
              onClick={() => {
                currMatch > 0 && setCurrMatch(currMatch - 1);
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <ArrowBackIosIcon
                style={{
                  fontSize: 15,
                  color: "white",
                  backgroundColor: "green",
                  borderRadius: "100%",
                  width: 25,
                  height: 25,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                }}
              />
            </div>
            <Grid container spacing={2}>
              {currMatch < matches.length ? (
                matches.map((match, index) => {
                  if (index >= currMatch && index < currMatch + 4) {
                    return (
                      <Grid
                        item
                        xs={3}
                        key={index}
                        style={{
                          justifyContent: "center",
                          marginTop: 7,
                        }}
                      >
                        <Card
                          onClick={() => {
                            navigate("/match/" + match.id, { replace: true });
                          }}
                          style={{
                            height: 190,
                            width: 310,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: 10,
                            wrap: "wrap !important",
                            display: "flex",
                            fontSize: "0.70rem",
                            cursor: "pointer",
                          }}
                        >
                          <CardContent>
                            <p style={{ textAlign: "left" }}>
                              <strong>{match.t1}</strong>
                            </p>

                            <p style={{ textAlign: "left" }}>
                              <strong>{match.t2}</strong>
                            </p>
                            {match.matchType ? (
                              <p
                                style={{
                                  textAlign: "left",
                                }}
                              >
                                Match Type: {match.matchType}
                              </p>
                            ) : null}
                            {match.status ? <p style={{ textAlign: "left" }}>Status: {match.status}</p> : null}

                            {match.t1s ? (
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <span>{match.t1} :</span>

                                <span>{match.t1s}</span>
                              </div>
                            ) : null}

                            <br />
                            {match.t2s ? (
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <span>{match.t2} :</span>

                                <span>{match.t2s}</span>
                              </div>
                            ) : null}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  }
                  return null;
                })
              ) : (
                <h1>No matches found.</h1>
              )}
              <p style={{ textDecoration: "underline" }}></p>
            </Grid>
            <div
              className={classes.item}
              onClick={() => {
                if (currMatch < matches.length - 4) setCurrMatch(currMatch + 4);
              }}
              style={{
                position: "absolute",
                top: "50%",
                right: -8,
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <ArrowForwardIosIcon
                style={{
                  fontSize: 15,
                  color: "white",
                  backgroundColor: "green",
                  borderRadius: "100%",
                  width: 25,
                  height: 25,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LiveScores;
