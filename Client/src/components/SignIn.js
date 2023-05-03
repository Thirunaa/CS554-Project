import React, { useContext } from "react";
//import SocialSignIn from "./SocialSignIn";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { doSignInWithEmailAndPassword, doPasswordReset } from "../firebase/FirebaseFunctions";
import { TextField, Button, Grid, Typography, Link, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: "auto",
    maxWidth: 400,
    padding: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  submitButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function SignIn() {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  const handleLogin = async (event) => {
    event.preventDefault();
    let { email, password } = event.target.elements;

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
      alert("Login successful");
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      alert("Password reset email was sent");
    } else {
      alert("Please enter an email address below before you click the forgot password link");
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" component="h1" align="center" className={classes.title}>
        Log in
      </Typography>
      <form onSubmit={handleLogin}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField variant="outlined" fullWidth id="email" label="Email" name="email" type="email" required />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth className={classes.submitButton}>
              Log in
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Link href="#" onClick={passwordReset}>
              Forgot Password
            </Link>
          </Grid>
        </Grid>
      </form>
      <br />
      <Button className={classes.button} key={"signup"} href="/signup" sx={{ my: 2, color: "white", display: "block" }}>
        SignUp
      </Button>
    </div>
  );
}

export default SignIn;
