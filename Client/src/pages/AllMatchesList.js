import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useStyles } from "../styles/styles.js";
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
} from "@material-ui/core";
import "../App.css";

const AllMatchesList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  let { pagenum } = useParams();
  pagenum = parseInt(pagenum);
  //const [pageNo, setPageNo] = useState(parseInt(pagenum));
  const [prevPagePresent, setPrevPagePresent] = useState(false);
  const [nextPagePresent, setNextPagePresent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [matchesData, setMatchesData] = useState([]);
  let card = null;

  useEffect(() => {
    console.log("on load useeffect all matches");
    async function fetchData() {
      try {
        let pageId = pagenum;
        if (pageId !== 0) {
          setPrevPagePresent(true);
        }
        const { data } = await axios.get("http://localhost:4000/match/allMatches/page/" + pageId);
        console.log(data);

        if (data.length < 25) {
          setNextPagePresent(false);
        }
        setMatchesData(data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  }, [pagenum]);

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
        <Container>
          <ButtonGroup disableElevation variant="contained" color="secondary">
            {prevPagePresent && (
              <Button
                sx={{ marginRight: "1.5%" }}
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
                sx={{ marginRight: "1.5%" }}
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
