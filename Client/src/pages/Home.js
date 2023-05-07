import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useStyles } from "../styles/styles.js";
import { Card, CardActionArea, CardMedia, CardContent, CircularProgress, Grid, Typography } from "@material-ui/core";
import NewsData from "../data/newsData.json";
import noNewsImage from "../images/noNewsImage.png";
import axios from "axios";
import "../App.css";
import { AuthContext } from "../firebase/Auth";
import LiveScores from "./LiveScores.js";

const Home = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [newsData, setnewsData] = useState([]);
  // eslint-disable-next-line
  const { currentUser } = useContext(AuthContext);

  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        const { data } = await axios.get("http://localhost:3001/");
        //console.log(data);
        setnewsData(data);
      } catch (e) {
        console.log(e);
        setnewsData(NewsData.articles);
      }
    }
    fetchData();
    setLoading(false);
  }, []);

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
        <LiveScores />
        <br />
        <br />
        <Typography> LATEST CRICKET NEWS </Typography>
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

export default Home;
