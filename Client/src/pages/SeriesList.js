import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
//import ErrorComponent from "./ErrorComponent";
import "../App.css";
import { AuthContext } from "../firebase/Auth";

const SeriesList = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [seriesData, setseriesData] = useState([]);
  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        let authtoken = await currentUser.getIdToken();
        const { data } = await axios.get("http://localhost:3001/matches/seriesList", {
          headers: { authtoken: authtoken },
        });
        console.log(data);
        setseriesData(data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  }, [currentUser]);

  const buildCard = (series) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={series.id}>
        <Card key={series.id} sx={{ minWidth: 275, mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {series.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {series.startDate} - {series.endDate}
            </Typography>
            <Typography variant="body2">
              ODI: {series.odi} | T20: {series.t20} | Test: {series.test} | Squads: {series.squads} | Matches:{" "}
              {series.matches}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  card =
    seriesData &&
    seriesData.map((series) => {
      return buildCard(series);
    });

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div>
        <br />
        <div>{card}</div>
        <br />
      </div>
    );
  }
};

export default SeriesList;
