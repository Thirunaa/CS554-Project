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
import { AuthProvider } from "./firebase/Auth";
import SignUp from "./pages/SignUp";
import SignOut from './pages/SignOut'
import SignIn from './pages/SignIn'
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <AuthProvider>
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
              <Route path="/current-matches" element={<PrivateRoute />} >
                <Route path='/current-matches' element={<CurrentMatchesList />} />
              </Route>

              <Route path="/all-matches" element={<PrivateRoute />} >
                <Route path="/all-matches" element={<AllMatchesList />} />
              </Route>

              <Route path="/players" element={<PrivateRoute />} >
                <Route path="/players" element={<PlayersList />} />
              </Route>

              <Route path="/match/:id" element={<PrivateRoute />} >
                <Route path="/match/:id" element={<Match />} />
              </Route>

              <Route path="/player/:id" element={<PrivateRoute />} >
                <Route path="/player/:id" element={<Player />} />
              </Route>

              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signout" element={<SignOut />} />
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
    </AuthProvider>
  );
}

export default App;
