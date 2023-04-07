import "./App.css";
import React from "react";
import CurrentMatchesList from "./pages/CurrentMatchesList";
import AllMatchesList from "./pages/AllMatchesList";
import Home from "./pages/Home";
import Footer from "./components/Footer";
// import Stack from "@mui/material/Stack";
// import { Button } from "@material-ui/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RouteNotFound from "./pages/RouteNotFound";
import Match from "./pages/Match";
import Navbar from "./components/Navbar";
import PlayersList from "./pages/PlayersList";
import Player from "./pages/Player";

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <Navbar />
        </header>
        <br />
        <br />
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/current-matches" element={<CurrentMatchesList />} />
            <Route path="/all-matches" element={<AllMatchesList />} />
            <Route path="/players" element={<PlayersList />} />
            <Route path="/match/:id" element={<Match />} />
            <Route path="/player/:id" element={<Player />} />
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
