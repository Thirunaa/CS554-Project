import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useStyles } from "../styles/styles.js";
import {
  Card,
  CardActionArea,
  Button,
  ButtonGroup,
  Container,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
//import ErrorComponent from "./ErrorComponent";
import "../App.css";
import SearchData from "../components/SearchData.js";
import Error400 from "../components/Error400.js";
import RouteNotFound from "../components/RouteNotFound.js";

const PlayersList = () => {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const navigate = useNavigate();
  let { pagenum } = useParams();
  pagenum = parseInt(pagenum);
  const [nextPagePresent, setNextPagePresent] = useState(true);
  const [axiosError, setAxiosError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [playersData, setPlayersData] = useState([]);
  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        let authtoken = await currentUser.getIdToken();
        let pageId = pagenum;
        const { data } = await axios.get("http://localhost:3001/players/playersList/page/" + pageId, {
          headers: { authtoken: authtoken },
        });
        console.log(data);
        if (data.length < 25) {
          setNextPagePresent(false);
        }
        setAxiosError("");
        setPlayersData(data);
      } catch (e) {
        console.log(e);
        setAxiosError(e.response.data.message);
      }
    }
    fetchData();
    setLoading(false);
  }, [pagenum, currentUser]);

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        let authtoken = await currentUser.getIdToken();
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get("http://localhost:3001/players/search/" + searchTerm, {
          headers: { authtoken: authtoken },
        });
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log("searchTerm is set");
      fetchData();
    }
  }, [searchTerm, currentUser]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const buildCard = (player) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={player.id}>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <Link to={`/player/${player.id}`}>
              <CardContent>
                <Typography className={classes.titleHead} gutterBottom variant="h6" component="h2">
                  {player.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {player && player.country ? player.country : ""}
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((player) => {
        return buildCard(player);
      });
  } else {
    card =
      playersData &&
      playersData.map((player) => {
        return buildCard(player);
      });
  }

  if (axiosError !== "") {
    if (axiosError?.includes("400")) {
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
                sx={{ marginRight: "1.5%" }}
                variant={"contained"}
                onClick={() => {
                  navigate("/players/page/" + parseInt(parseInt(pagenum) - 1), {
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
                  navigate("/players/page/" + parseInt(parseInt(pagenum) + 1), {
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
        Search Player <SearchData searchValue={searchValue} />
        <br />
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
      </div>
    );
  }
};

export default PlayersList;
