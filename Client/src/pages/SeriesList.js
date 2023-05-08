import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const SeriesList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://api.cricapi.com/v1/series?apikey=62fea853-66e8-45e1-9e61-b8f56daa7058");
      const jsonData = await response.json();
      setData(jsonData.data);
    };
    fetchData();
  }, []);

  return (
    <>
      {data.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={item.id}>
          <Card key={item.id} sx={{ minWidth: 275, mb: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {item.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {item.startDate} - {item.endDate}
              </Typography>
              <Typography variant="body2">
                ODI: {item.odi} | T20: {item.t20} | Test: {item.test} | Squads: {item.squads} | Matches: {item.matches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
};


export default SeriesList

