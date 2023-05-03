const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const matches = require("../data/match");
const users = require("../data/user");
const validation = require("../validations/routeValidations");
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

router.route("/login").post(async (req, res) => {
  try {
    if (req.session.userId) {
      res.status(400).json({
        errorCode: 400,
        message: "You're already logged in.",
      });
      return;
    }
    let body = req.body;
    let validationStatus = validation.validateLogin(body);
    if (!validationStatus.isValid) {
      if (validationStatus.message === "Either the username or password is invalid") {
        res.status(401).json({ errorCode: 401, message: validationStatus.message });
        return;
      } else {
        res.status(400).json({ errorCode: 400, message: validationStatus.message });
        return;
      }
    }
    try {
      const user = await users.loginUser(body.username, body.password);
      if (user.isAuthenticated) {
        req.session.userId = user.userDetails._id.toString();
        req.session.username = user.userDetails.username;
        res.status(200).json(user.userDetails);
        return;
      }
    } catch (e) {
      res.status(400).json({ errorCode: 400, message: e });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.route("/logout").get(async (req, res) => {
  try {
    if (!req.session.userId) {
      res.status(401).json({ errorCode: 401, message: "You've to be logged in to perform this action." });
      return;
    }
    req.session.destroy();
    res.status(200).json({ message: "You've been successfully logged out." });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.route("/signup").post(async (req, res) => {
  try {
    if (req.session.userId) {
      res.status(400).json({
        errorCode: 400,
        message: `You're already logged in.`,
      });
      return;
    }
    let body = req.body;
    let validationStatus = validation.validateSignup(body);
    if (!validationStatus.isValid) {
      res.status(400).json({ errorCode: 400, message: validationStatus.message });
      return;
    }
    try {
      const createdUser = await users.createUser(body.name, body.username, body.password);
      res.status(200).json(createdUser);
      return;
    } catch (e) {
      console.log(e);
      res.status(400).json({ errorCode: 400, message: e });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

module.exports = router;
