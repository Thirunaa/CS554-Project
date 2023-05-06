import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import axios from "axios";
import ballbyball from "../data/ballByBall.json";
import { useStyles }from "../styles/ballbyballStyles";
import {
  Typography,
  Divider,
  Box
} from "@mui/material";



const Balls_list = () => {
  //const ballbyballUrl = "https://api.cricapi.com/v1/match_bbb?";
  //const API_KEY = "apikey=f9262a85-d559-439c-b1c0-4817f5e46208";
  //const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(false);
  //const [errorMsg, seterrorMsg] = useState('No Data for this Page.');
  const [bbbData, setbbbData] = useState(undefined);
  const classes = useStyles();
  let score = 0;

  //let { match_id } = useParams();

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        //const { data } = await axios.get(ballbyballUrl + API_KEY + '&id=' + match_id);
        console.log(ballbyball, "ballbyball");
        setbbbData(ballbyball);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  }, [ballbyball]);

  let first20overs = [];
  let next20overs = [];

  if (bbbData) {
    bbbData.data.bbb.forEach((x) => {
      if (x.inning === 0) {
        first20overs.push(x);
      } else {
        next20overs.push(x);
      }
    });
  }
  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div style={{ width: "100%", backgroundColor: "#f1faee" }}>
        <br />
        <card>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h2"
            id="tableTitle"
            component="div"
          >
            {bbbData?.data?.name}
          </Typography>
          <br>
        </br>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h3"
            id="tableTitle"
            component="div"
          >
            Toss-winner:{bbbData?.data?.tossWinner}
          </Typography>
          <br>
        </br>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h4"
            id="tableTitle"
            component="div"
          >
            Toss-choice:{bbbData?.data?.tossChoice}
          </Typography>
        </card>
        <br>
        </br>
        <card>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h5"
            id="tableTitle"
            component="div"
          >
            INNINGS : {bbbData?.data?.score[0].inning}
          </Typography>
        </card>
        <br>
        </br>

        {bbbData &&
          first20overs.map((x, index) =>
            x.ball === 6 ? (
              <React.Fragment key={index}>
                <card className={classes.card1}>
                  <Typography variant="h4">
                    {x.over + 1}.{x.ball}    {" "}
                  </Typography>
                  <Typography
                    variant="h6"
                    className="classes.typography"
                  >
                    {x.bowler.name} to {x.batsman.name},run for this bowl is {x.runs},score is   {(score = score + x.runs)}
                  </Typography>
                </card>
                <Box boxShadow={3}>
                <card
                  className={classes.card}
                  variant="outlined"
                  sx={{ flex: "1 1 100%", width:"80%"}}
                >
                  <div className={classes.section}>
                    <Typography variant="h2">{x.over + 1}</Typography>
                  </div>
                  <Divider className={classes.divider} orientation="vertical" sx={ {
    height: '100%',
    margin: '0 8px',
  }} />
                  <div className={classes.section}>
                    <Typography variant="h4">
                      Score after {x.over + 1} over is {score}
                    </Typography>
                  </div>
                  <Divider className={classes.divider} orientation="vertical" sx={ {
    height: '100%',
    margin: '0 8px',
  }} />
                  <div className={classes.section}>
                    <Typography variant="h6">
                      With {x.batsman.name} being on the batting side and{" "}
                      {x.bowler.name} bowling the over.
                    </Typography>
                  </div>
                </card>
                </Box>
              </React.Fragment>
            ) : (
              <card className={classes.card1} sx={{ flex: "1 1 10%" }}>
                <Typography variant="h4">
                  {x.over + 1}.{x.ball}{" "}
                </Typography>
                <Typography 
                variant="h6"
                sx={{ flex: "1 1 10%" }}
                >
                {x.bowler.name} to {x.batsman.name},run for this bowl is {x.runs} ,score is {(score = score + x.runs)}
                </Typography>
              </card>
            )
          )}

        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h3"
          id="tableTitle"
          component="div"
        >
          INNINGS : {bbbData?.data?.score[1].inning}
        </Typography>

        {bbbData &&
          next20overs.map((x, index) =>
            x.ball === 6 ? (
              <React.Fragment key={index}>
                <card className={classes.card1}>
                  <Typography variant="h4">
                    {x.over + 1}.{x.ball}    {" "}
                  </Typography>
                  <Typography
                    variant="h6"
                    className="classes.typography"
                  >
                    {x.bowler.name} to {x.batsman.name},run for this bowl is {x.runs},score is   {(score = score + x.runs)}
                  </Typography>
                </card>
                <Box boxShadow={3}>
                <card
                  className={classes.card}
                  variant="outlined"
                  sx={{ flex: "1 1 100%", width:"80%"}}
                >
                  <div className={classes.section}>
                    <Typography variant="h2">{x.over + 1}</Typography>
                  </div>
                  <Divider className={classes.divider} orientation="vertical" sx={ {
    height: '100%',
    margin: '0 8px',
  }} />
                  <div className={classes.section}>
                    <Typography variant="h4">
                      Score after {x.over + 1} over is {score}
                    </Typography>
                  </div>
                  <Divider className={classes.divider} orientation="vertical" sx={ {
    height: '100%',
    margin: '0 8px',
  }} />
                  <div className={classes.section}>
                    <Typography variant="h6">
                      With {x.batsman.name} being on the batting side and{" "}
                      {x.bowler.name} bowling the over.
                    </Typography>
                  </div>
                </card>
                </Box>
              </React.Fragment>
            ) : (
              <card className={classes.card1} sx={{ flex: "1 1 10%" }}>
                <Typography variant="h4">
                  {x.over + 1}.{x.ball}{" "}
                </Typography>
                <Typography 
                variant="h6"
                sx={{ flex: "1 1 10%" }}
                >
                {x.bowler.name} to {x.batsman.name},run for this bowl is {x.runs} ,score is {(score = score + x.runs)}
                </Typography>
              </card>
            )
          )}
      </div>
    );
  }
};

export default Balls_list;
