import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Carousel.css";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const api_key = "f9262a85-d559-439c-b1c0-4817f5e46208";
const matchUrl = `https://api.cricapi.com/v1/cricScore?apikey=${api_key}`;

function Carousel() {
  const [currMatch, setCurrMatch] = useState(0);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(matchUrl);
        const data = response.data.data;
        setMatches(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMatches();
  }, []);
  return (
    <>
      {matches.length > 0 && (
        <div
          className="carousel"
          style={{ backgroundColor: "#2196f3", height: 225 }}
        >
          <div
            className="carouselInner"
            style={{ margin: "0 100px", position: "relative" }}
          >
            <div
              className="left"
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
            <Grid container className="center">
              {currMatch < matches.length ? (
                matches.map((match, index) => {
                  if (index >= currMatch && index < currMatch + 4) {
                    return (
                      <Grid
                        item
                        xs={3}
                        key={index}
                        style={{ marginBottom: "20px", marginTop: "20px" }}
                      >
                        <Card
                          style={{
                            height: 185,
                            width: 400,
                            backgroundColor: "white",
                            borderRadius: 10,
                            wrap: "wrap !important",
                            display: "flex",
                            fontSize: "0.75rem",
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
                            {match.status ? (
                              <p style={{ textAlign: "left" }}>
                                Status: {match.status}
                              </p>
                            ) : null}

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
            </Grid>
            <div
              className="right"
              onClick={() => {
                if (currMatch < matches.length - 4) setCurrMatch(currMatch + 4);
              }}
              style={{
                position: "absolute",
                top: "50%",
                right: 27,
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

export default Carousel;
