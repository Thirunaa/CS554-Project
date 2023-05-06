import React, { useState, useEffect, useContext } from "react";
// import { Helmet } from "react-helmet";
// import Typekit from "react-typekit";
// import axios from "axios";
import { Link } from "react-router-dom";
import { useStyles } from "../styles/styles.js";
import { Card, CardActionArea, CardMedia, CardContent, CircularProgress, Grid, Typography } from "@material-ui/core";
import NewsData from "../data/newsData.json";
import noNewsImage from "../images/noNewsImage.png";
//import ErrorComponent from "./ErrorComponent";
import "../App.css";
import { AuthContext } from "../firebase/Auth";
// import LiveScoreScript from "../components/LiveScoreScript.js";
import Carousel from "./Carousel.js";

const Home = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [newsData, setnewsData] = useState([]);
  // eslint-disable-next-line
  const { currentUser } = useContext(AuthContext);
  //const allnewsUrl = "https://api.cricapi.com/v1/news?";
  //const API_KEY = "apikey=62fea853-66e8-45e1-9e61-b8f56daa7058";
  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        //const { data } = await axios.get(allnewsUrl + API_KEY + "&offset=0");
        //console.log(data);
        setnewsData(NewsData.articles);
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

  const buildCard = (article) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={article.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`${article.url}`}>
              <CardMedia
                className={classes.media}
                component="img"
                image={article.urlToImage ? article.urlToImage : noNewsImage}
                title="show image"
              />
              <CardContent>
                <Typography className={classes.titleHead} gutterBottom variant="h6" component="h2">
                  {article.title}
                </Typography>

                <Typography variant="body2" color="textSecondary" component="p">
                  {article.content ? article.content.substring(0, 150) + "...." : ""}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
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
    newsData &&
    newsData.map((article) => {
      return buildCard(article);
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
        <Carousel />
        <br />
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
        <Typography> LATEST CRICKET NEWS </Typography>
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

export default Home;
