import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { TextField, Button, Card } from "@material-ui/core";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../firebase/Auth";
//import SocialSignIn from "./SocialSignIn";
import firebase from "firebase/compat/app";
import axios from "axios";
function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { displayName, email, passwordOne, passwordTwo } = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch("Passwords do not match");
      return false;
    }
    console.log(displayName.value);

    // check to see if the display name is available.
    try {
      await axios.get(`http://localhost:3001/users/check/${displayName.value}`);
    } catch (e) {
      alert("This user name is already taken. Please try another one.");
      return;
    }

    try {
      await doCreateUserWithEmailAndPassword(email.value, passwordOne.value, displayName.value);
      let userId = firebase.auth().currentUser.uid;
      let emailAddress = firebase.auth().currentUser.email;
      let username = displayName.value;
      let loweredEmailAddress = emailAddress.toLowerCase();
      const { data } = await axios.post("http://localhost:3001/users/signup", {
        userId,
        emailAddress: loweredEmailAddress,
        displayName: username,
      });
      console.log(data);
      alert("Sign up successful");
      // api - Sign Up call to backend
    } catch (error) {
      alert(error);
    }
    e.target.reset();
  };

  if (currentUser) {
    return <Navigate to="/signin" />;
  }

  return (
    <div>
      <h1>Sign up</h1>
      {pwMatch && <h4 className="error">{pwMatch}</h4>}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card style={{ height: "50%", width: "50%" }}>
          <form onSubmit={handleSignUp}>
            <TextField id="displayName" name="displayName" label="Name" required fullWidth margin="normal" autoFocus />
            <TextField id="email" name="email" label="Email" type="email" required fullWidth margin="normal" />
            <TextField
              id="passwordOne"
              name="passwordOne"
              label="Password"
              type="password"
              autoComplete="off"
              required
              fullWidth
              margin="normal"
            />
            <TextField
              id="passwordTwo"
              name="passwordTwo"
              label="Confirm Password"
              type="password"
              autoComplete="off"
              required
              fullWidth
              margin="normal"
            />
            <Button id="submitButton" name="submitButton" type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
          </form>
        </Card>
      </div>
      <br />
      {/* <SocialSignIn /> */}
    </div>
  );
}

export default SignUp;
