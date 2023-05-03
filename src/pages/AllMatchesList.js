import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useStyles } from "../styles/styles.js";
import { Card, CardActionArea, CardContent, CircularProgress, Grid, Typography, Button } from "@material-ui/core";

//import ErrorComponent from "./ErrorComponent";
import "../App.css";

const AllMatchesList = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [matchesData, setMatchesData] = useState([]);
  const allMatchesUrl = "https://api.cricapi.com/v1/matches?";
  const API_KEY = "apikey=f9262a85-d559-439c-b1c0-4817f5e46208";
  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        const { data } = await axios.get(allMatchesUrl + API_KEY + "&offset=0");
        console.log(data);
        setMatchesData(data.data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  }, []);

  //   useEffect(() => {
  //     console.log("search useEffect fired");
  //     async function fetchData() {
  //       let pageNo = pageId;
  //       try {
  //         console.log(`in fetch searchTerm: ${searchTerm}`);
  //         const { data } = await axios.get(eventUrl + pageNo + "&keyword=" + searchTerm + API_KEY);
  //         setSearchData(data);
  //         setLoading(false);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     }
  //     if (searchTerm) {
  //       console.log("searchTerm is set");
  //       fetchData();
  //     }
  //   }, [searchTerm, pageId]);

  //   const searchValue = async (value) => {
  //     setSearchTerm(value);
  //   };

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
            <Link to={`/ball-by-ball/${match.id}`}>
            <Button>Get ball by ball updates.</Button></Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  //   if (searchTerm) {
  //     card =
  //       searchData &&
  //       searchData._embedded &&
  //       searchData._embedded.venues &&
  //       searchData._embedded.venues.map((event) => {
  //         return buildCard(event);
  //       });
  //   } else {
  //     card =
  //       venuesData &&
  //       venuesData._embedded &&
  //       venuesData._embedded.venues &&
  //       venuesData._embedded.venues.map((venue) => {
  //         return buildCard(venue);
  //       });
  //   }

  card =
    matchesData &&
    matchesData.map((match) => {
      return buildCard(match);
    });

  //   if (err) {
  //     return (
  //       <div>
  //         <ErrorComponent />
  //       </div>
  //     );
  //   }

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div>
        {/* <Container>
          <ButtonGroup disableElevation variant="contained" color="secondary">
            {prevPageExists && (
              <Button>
                <Link to={`/ticketify/venues/page/${pageId - 1}`}>PREVIOUS</Link>
              </Button>
            )}
            {nextPageExists && (
              <Button>
                <Link to={`/ticketify/venues/page/${pageId + 1}`}>NEXT</Link>
              </Button>
            )}
          </ButtonGroup>
        </Container> */}
        {/* <br />
        Venues Keyword Search <SearchData searchValue={searchValue} />
        <br /> */}
        <br />
        {/* <Container>
          {err && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              This is an error alert — <strong>404 - Page Not Found</strong>
            </Alert>
          )}
        </Container> */}
        <br />
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
        <br />
        <br />
        {/* <Container>
          <ButtonGroup disableElevation variant="contained" color="secondary">
            {prevPageExists && (
              <Button>
                <Link role="button" to={`/ticketify/venues/page/${pageId - 1}`}>
                  PREVIOUS
                </Link>
              </Button>
            )}
            {nextPageExists && (
              <Button>
                <Link role="button" to={`/ticketify/venues/page/${pageId + 1}`}>
                  NEXT
                </Link>
              </Button>
            )}
          </ButtonGroup>
        </Container> */}
      </div>
    );
  }
};

export default AllMatchesList;
