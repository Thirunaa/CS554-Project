import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import axios from "axios";
//import ballbyball from "../data/ballByBall.json";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography
} from "@mui/material";

const Balls_list = () => {
  const ballbyballUrl = "https://api.cricapi.com/v1/match_bbb?";
  const API_KEY = "apikey=f9262a85-d559-439c-b1c0-4817f5e46208";
  //const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(false);
  //const [errorMsg, seterrorMsg] = useState('No Data for this Page.');
  const [bbbData, setbbbData] = useState(undefined);
  let { match_id } = useParams();
  
  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        
        const { data } = await axios.get(ballbyballUrl + API_KEY + '&id' + match_id);
        //console.log(ballbyball,"ballbyball")
        setbbbData(data);
        
        
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  });
  

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
        <card>
          <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >{bbbData?.data?.name} {console.log(bbbData)}
        </Typography>
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >Toss-winner:{bbbData?.data?.tossWinner}
        </Typography>
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >Toss-choice:{bbbData?.data?.tossChoice}
        </Typography>
        </card>
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
              bbbData?.data?.bbb?.map((x, index) => (
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
