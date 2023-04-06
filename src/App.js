import "./App.css";
import React from "react";
import CurrentMatchesList from "./pages/CurrentMatchesList";
import AllMatchesList from "./pages/AllMatchesList";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Stack from "@mui/material/Stack";
import { Button } from "@material-ui/core";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import RouteNotFound from "./pages/RouteNotFound";
import Match from "./pages/Match";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1 className="App-title">Welcome to the our cricket application. Check the scores, Share your thoughts!</h1>

          <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
            <Button variant="contained">
              <Link className="link" to="/home">
                Home
              </Link>
            </Button>
            <Button variant="contained">
              <Link className="link" to="/current-matches">
                Current Matches
              </Link>
            </Button>
            <Button variant="contained">
              <Link className="link" to="/all-matches">
                All Matches
              </Link>
            </Button>
          </Stack>
        </header>
        <br />
        <br />
        <div className="App-body">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/current-matches" element={<CurrentMatchesList />} />
            <Route path="/all-matches" element={<AllMatchesList />} />
            <Route path="/match/:id" element={<Match />} />
            <Route path="*" element={<RouteNotFound />} />
          </Routes>
        </div>
        <br />
        <br />
        <div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
