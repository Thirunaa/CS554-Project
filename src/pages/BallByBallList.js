import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import ballbyball from "../data/ballByBall.json";
import { useStyles } from "../styles/styles.js";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
// const useStyles = makeStyles({
//     table: {
//       minWidth: 650,
//     },
//   });

const Balls_list = () => {
  // const ballbyballUrl = "https://api.cricapi.com/v1/match_bbb?";
  // const API_KEY = "apikey=f9262a85-d559-439c-b1c0-4817f5e46208";
  // const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(false);
  //const [errorMsg, seterrorMsg] = useState('No Data for this Page.');
  const [bbbData, setbbbData] = useState(undefined);
  let id = null;
  const nav = useNavigate();
  //const match_id = "&id=f2b8aa8a-f24c-40b4-99bb-4e6a222a1614";
  const classes = useStyles();

  let card = null;

  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        // console.log("before axios call")
        // const { data } = await axios.get(ballbyballUrl + API_KEY + match_id);
        // console.log("after axios call")
        // console.log(data.data.bb,"data");
        setbbbData(ballbyball?.data?.bbb);
        console.log(ballbyball.data.bbb);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  }, [ballbyball]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <br />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bowler</TableCell>
              <TableCell>Batsman</TableCell>
              <TableCell>RUN</TableCell>
              <TableCell>BALL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bbbData &&
              bbbData.map((x, index) => (
                <TableRow key={index}>
                  <TableCell>{x.bowler.name}</TableCell>
                  <TableCell>{x.batsman.name}</TableCell>
                  <TableCell>{x.runs}</TableCell>
                  <TableCell>
                    {x.over}.{x.ball}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
};

export default Balls_list;
