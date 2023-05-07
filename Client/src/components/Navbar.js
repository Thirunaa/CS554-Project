import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import logo from "../images/logo192.png";
import userImage from "../images/User.png";
import { useStyles } from "../styles/singleElementStyles.js";
//import { NavLink } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
// fixing the navbar merge issue
//const settings = ["Profile", "Logout"];
const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  console.log("current user", currentUser);
  if (currentUser) {
    console.log("current user available");
  } else {
    console.log("not logged in");
  }
  return <div>{currentUser ? <Navbar /> : <NavigationNonAuth />}</div>;
};

function Navbar() {
  const classes = useStyles();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // eslint-disable-next-line
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // eslint-disable-next-line
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={logo} className="App-logo" alt="logo" />
          <Typography
            variant="h6"
            noWrap
            component="a"
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LiveCricketHub
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Link
              className={classes.button}
              key={"Current Matches"}
              to="/current-matches"
              sx={{ my: 2, color: "white", display: "block" }}
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                color: "white",
                fontSize: "1rem",
              }}
            >
              Current Matches
            </Link>

            <Link
              className={classes.button}
              key={"All Matches"}
              to="/all-matches/page/0"
              sx={{
                my: 2,
                color: "white",
                display: "block",
                fontSize: "3rem",
              }}
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                color: "white",
                fontSize: "1rem",
              }}
            >
              All Matches
            </Link>

            <Link
              className={classes.button}
              key={"Players"}
              to="/players/page/0"
              sx={{ my: 2, color: "white", display: "block" }}
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                color: "white",
                fontSize: "1rem",
              }}
            >
              Players
            </Link>
          </Box>
          {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              className={classes.button}
              sx={{
                my: 2,
                color: "white",
                display: "block",
              }}
              onClick={doSignOut}
            >
              SignOut
            </Button>
          </Box> */}

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src={userImage} />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem
                key={"Profile"}
                onClick={() => {
                  handleCloseUserMenu();
                  navigate("/profile", { replace: true });
                }}
              >
                <Typography textAlign="center">{"Profile"}</Typography>
              </MenuItem>

              <MenuItem
                key={"Logout"}
                onClick={() => {
                  handleCloseUserMenu();
                  doSignOut();
                }}
              >
                <Typography textAlign="center">{"Logout"}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const NavigationNonAuth = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={logo} className="App-logo" alt="logo" />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Cricketify
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              className={classes.button}
              key={"signup"}
              href="/signup"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Signup
            </Button>

            <Button
              className={classes.button}
              key={"signin"}
              href="/signin"
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navigation;
