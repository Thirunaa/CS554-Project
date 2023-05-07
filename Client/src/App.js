import "./App.css";
import React from "react";
import CurrentMatchesList from "./pages/CurrentMatchesList";
import AllMatchesList from "./pages/AllMatchesList";
import Home from "./pages/Home";
import Footer from "./components/Footer";
// import Stack from "@mui/material/Stack";
// import { Button } from "@material-ui/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RouteNotFound from "./components/RouteNotFound";
import Match from "./pages/Match";
import Navbar from "./components/Navbar";
import PlayersList from "./pages/PlayersList";
import Player from "./pages/Player";
import { AuthProvider } from "./firebase/Auth";
import SignUp from "./components/SignUp";
import SignOut from "./components/SignOut";
import SignIn from "./components/SignIn";
import PrivateRoute from "./pages/PrivateRoute";
//import Predict from "./components/Predict";
import BallByBall from "./pages/BallByBall";
import ChangePassword from "./components/ChangePassword";
import Profile from "./pages/Profile";
import User from "./pages/User";
import MatchPreview from "./pages/MatchPreview";

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
              <Route path="/current-matches" element={<PrivateRoute />}>
                <Route path="/current-matches" element={<CurrentMatchesList />} />
              </Route>

              <Route path="/all-matches/page/:pagenum" element={<PrivateRoute />}>
                <Route path="/all-matches/page/:pagenum" element={<AllMatchesList />} />
              </Route>

              <Route path="/players/page/:pagenum" element={<PrivateRoute />}>
                <Route path="/players/page/:pagenum" element={<PlayersList />} />
              </Route>

              <Route path="/match/:id" element={<PrivateRoute />}>
                <Route path="/match/:id" element={<Match />} />
              </Route>

              <Route path="/match/preview" element={<PrivateRoute />}>
                <Route path="/match/preview" element={<MatchPreview />} />
              </Route>

              <Route path="/player/:id" element={<PrivateRoute />}>
                <Route path="/player/:id" element={<Player />} />
              </Route>

              <Route path="/user/:username" element={<PrivateRoute />}>
                <Route path="/user/:username" element={<User />} />
              </Route>

              <Route path="/match_bbb/:id" element={<PrivateRoute />}>
                <Route path="/match_bbb/:id" element={<BallByBall />} />
              </Route>

              <Route path="/change-password" element={<PrivateRoute />}>
                <Route path="/change-password" element={<ChangePassword />} />
              </Route>

              <Route path="/profile" element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
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
