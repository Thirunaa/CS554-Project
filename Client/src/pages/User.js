import React, { useState, useContext, useEffect } from "react";
import { CircularProgress, Container, Avatar, Card, CardContent, Typography, Grid, Box, Button } from "@mui/material";
//import ChangePassword from '../components/ChangePassword';
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";
// eslint-disable-next-line
import Profile from "./Profile";

const User = () => {
  const { currentUser } = useContext(AuthContext);
  //const { displayName, email } = currentUser;
  let { username } = useParams();
  let navigate = useNavigate();
  // eslint-disable-next-line
  const [profile, setProfile] = useState();
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [favouriteMatchesObjects, setFavouriteMatchesObjects] = useState([]);
  const [favouritePlayersObjects, setFavouritePlayersObjects] = useState([]);

  useEffect(() => {
    console.log("User profile useEffect fired");
    async function fetchData() {
      try {
        const {
          data: { user, favouriteMatchesObjects, favouritePlayersObjects },
        } = await axios.get("http://localhost:3001/users/" + username, {
          headers: { authtoken: await currentUser.getIdToken() },
        });
        console.log(user);
        setProfile(user);
        setFavouriteMatchesObjects(favouriteMatchesObjects);
        setFavouritePlayersObjects(favouritePlayersObjects);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [username, currentUser]);

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else if (username === currentUser.displayName) {
    return navigate("/profile", { replace: true });
  } else {
    return (
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Card>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ width: 100, height: 100, mr: 2 }}>
              {profile.displayName.charAt(0)}
            </Avatar>
            <div>
              <Typography variant="h5">{profile.displayName}</Typography>
              <Typography color="textSecondary">{profile.email}</Typography>
            </div>
          </CardContent>
          <CardContent></CardContent>
        </Card>

        <Grid item xs={12}>
          <Box
            component="section"
            sx={{ border: "1px solid #ccc", borderRadius: "5px", p: 2, mb: 2 }}
          >
            <Typography variant="h5" gutterBottom>
              Favorite Players
            </Typography>
            {favouritePlayersObjects.length === 0 && (
              <Typography variant="body1" gutterBottom>
                You have no saved matches.
              </Typography>
            )}
            <Grid container spacing={2}>
              {favouritePlayersObjects.map((player) => (
                <Grid item key={player.name} xs={12} sm={6} md={4}>
                  <Link to={`/player/${player.id}`}>
                    <Card sx={{ backgroundColor: "#F5F5F5", p: 1 }}>
                      <CardContent>
                        <Typography>{player.name}</Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            component="section"
            sx={{ border: "1px solid #ccc", borderRadius: "5px", p: 2, mb: 2 }}
          >
            <Typography variant="h5" gutterBottom>
              Saved Matches
            </Typography>
            {favouriteMatchesObjects.length === 0 && (
              <Typography variant="body1" gutterBottom>
                You have added any player to your favourites.
              </Typography>
            )}
            <Grid container spacing={2}>
              {favouriteMatchesObjects.map((match) => (
                <Grid item key={match.data.name} xs={12} sm={6} md={4}>
                  <Link to={`/match/${match.data.id}`}>
                    <Card sx={{ backgroundColor: "#EFEFEF", p: 1 }}>
                      <CardContent>
                        <Typography>{match.data.name}</Typography>
                        <Typography>{match.data.date}</Typography>
                        <Typography>{match.data.status}</Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
        >
          Back
        </Button>
      </Container>
    );
  }
};

export default User;
