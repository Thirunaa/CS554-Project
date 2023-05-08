import React, { useState, useContext, useEffect } from "react";
import {
  List,
  ListItemText,
  ListItem,
  CircularProgress,
  Container,
  Avatar,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";
//import ChangePassword from '../components/ChangePassword';
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";
import SearchData from "../components/SearchData.js";

const Profile = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { displayName, email } = currentUser;
  const [searchData, setSearchData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line
  const [profile, setProfile] = useState();
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [favouriteMatchesObjects, setFavouriteMatchesObjects] = useState([]);
  const [favouritePlayersObjects, setFavouritePlayersObjects] = useState([]);

  useEffect(() => {
    console.log("User profile useEffect fired");
    async function fetchData() {
      let authtoken = await currentUser.getIdToken();
      try {
        const {
          data: { user, favouriteMatchesObjects, favouritePlayersObjects },
        } = await axios.get("http://localhost:3001/users/profile/", {
          headers: { authtoken: authtoken },
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
  }, [currentUser]);

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchSearchData() {
      try {
        let authtoken = await currentUser.getIdToken();
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          "http://localhost:3001/users/search/" + searchTerm,
          {
            headers: { authtoken: authtoken },
          }
        );
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log("searchTerm is set");
      fetchSearchData();
    }
  }, [searchTerm, currentUser]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const handlePasswordReset = () => {
    setShowChangePassword(true);
  };

  if (showChangePassword) {
    return <Navigate to="/change-password" />;
  }

  // if (searchTerm) {
  //   return <div>Search data</div>;
  // }

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
        <div>
          Search Users: <SearchData searchValue={searchValue} />
          <List style={{ paddingLeft: "300px", paddingRight: "300px" }}>
            {searchTerm &&
              searchData?.map((result) => (
                <ListItem
                  style={{ border: "1px solid #ccc", borderRadius: "5px" }}
                  key={result._source.displayName}
                  component={Link}
                  to={"/user/" + result._source.displayName}
                >
                  <ListItemText primary={result._source.displayName} />
                </ListItem>
              ))}
          </List>
        </div>
        <br />
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          <Card>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ width: 100, height: 100, mr: 2 }}>
                {displayName.charAt(0)}
              </Avatar>
              <div>
                <Typography variant="h5">{displayName}</Typography>
                <Typography color="textSecondary">{email}</Typography>
              </div>
            </CardContent>
            <CardContent>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handlePasswordReset}>
                  Change Password
                </Button>
              </Grid>
            </CardContent>
          </Card>

          <Grid item xs={12}>
            <Box
              component="section"
              sx={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                p: 2,
                mb: 2,
              }}
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
              sx={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                p: 2,
                mb: 2,
              }}
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
        </Container>
      </div>
    );
  }
};

export default Profile;
