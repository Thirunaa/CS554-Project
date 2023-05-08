const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const matches = require("../data/match");
const players = require("../data/player");
const users = require("../data/user");
const validation = require("../validations/routeValidations");
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});
// catch the validation status from routeValidations.js - some validations has to be changed

router.route("/").get(async (req, res) => {
  try {
    if (!client.isOpen) await client.connect();
    let newsFromCache = await client.get("news");
    if (newsFromCache) {
      console.log("news from redis");
      res.status(200).json(JSON.parse(newsFromCache));
      return;
    } else {
      let newsData = await matches.getCricketNews();
      try {
        // Update the news in the homepage cache every 24 hours
        await client.set("news", JSON.stringify(newsData), "EX", 24 * 60 * 60);
      } catch (e) {
        console.log("Set news in Redis Error");
        console.log(e);
      }
      //console.log(newsData);
      res.status(200).json(newsData);
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.route("/users/login").post(async (req, res) => {
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
      if (
        validationStatus.message ===
        "Either the username or password is invalid"
      ) {
        res
          .status(401)
          .json({ errorCode: 401, message: validationStatus.message });
        return;
      } else {
        res
          .status(400)
          .json({ errorCode: 400, message: validationStatus.message });
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

router.route("/users/logout").get(async (req, res) => {
  try {
    if (!req.session.userId) {
      res.status(401).json({
        errorCode: 401,
        message: "You've to be logged in to perform this action.",
      });
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

router.route("/users/signup").post(async (req, res) => {
  try {
    let userId = req.body.userId;
    let emailAddress = req.body.emailAddress;
    let displayName = req.body.displayName;
    // validation blocks

    // catch the validation status from routeValidations.js - some validations has to be changed
    let validationStatus = validation.validateName(displayName);
    if (!validationStatus.isValid) {
      res
        .status(400)
        .json({ errorCode: 400, message: validationStatus.message });
      return;
    }

    if (!userId) {
      res.status(400).json({ success: false, error: "User id not provided. " });
      return;
    }
    const createdUser = await users.createUser(
      userId,
      emailAddress,
      displayName
    );
    res.status(200).json({ success: true, createdUser });
    return;
  } catch (e) {
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.route("/users/profile").get(async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    console.log("currentUser", currentUser);
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: "You've to be logged in to perform this action.",
      });
      return;
    }
    let user = await users.getUserById(currentUser);
    let favouriteMatchesObjects = [];
    for (let i = 0; i < user.favouriteMatches.length; i++) {
      let match = await matches.getMatchById(user.favouriteMatches[i]);
      favouriteMatchesObjects.push(match);
    }
    let favouritePlayersObjects = [];
    for (let i = 0; i < user.favouritePlayers.length; i++) {
      let player = await players.getPlayerById(user.favouritePlayers[i]);
      favouritePlayersObjects.push(player);
    }
    res
      .status(200)
      .json({ user, favouriteMatchesObjects, favouritePlayersObjects });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.get("/users/check/:displayName", async (req, res) => {
  try {
    let displayName = req.params.displayName;
    // try {
    //   validateDisplayName(displayName);
    // } catch (e) {
    //   console.log(e);
    //   res.status(400).json({ success: false, error: e });
    //   return;
    // }
    try {
      const { isAvailable } = await users.checkDisplayName(displayName);
      if (isAvailable) {
        res.status(200).json({ success: true, isAvailable: true });
        return;
      }
    } catch (e) {
      console.log(e);
      res.status(409).json({ success: false, isAvailable: false, message: e });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Sorry, something went wrong. " });
  }
});

router.route("/users/addFavourite/:playerId").post(async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: "You've to be logged in to perform this action.",
      });
      return;
    }
    let playerId = req.params.playerId;
    const updatedUser = await users.addRemoveFavoritePlayer(
      currentUser,
      playerId
    );
    console.log("updatedUser");
    console.log(updatedUser);
    res.status(200).json(updatedUser);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.route("/users/saveMatch/:matchId").post(async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: "You've to be logged in to perform this action.",
      });
      return;
    }
    let matchId = req.params.matchId;
    const updatedUser = await users.addRemoveFavoriteMatch(
      currentUser,
      matchId
    );
    console.log("updatedUser");
    console.log(updatedUser);
    res.status(200).json(updatedUser);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.get("users/searchUsers/:searchTerm", async (req, res) => {
  try {
    let searchTerm = req.params.searchTerm;
    let searchedUsers = await users.searchUsers(searchTerm);
    res.status(200).json(searchedUsers);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.route("/users/:username").get(async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    let username = req.params.username;
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: "You've to be logged in to perform this action.",
      });
      return;
    }
    console.log("username");
    let user = await users.getUserByUsername(username);
    let favouriteMatchesObjects = [];
    for (let i = 0; i < user.favouriteMatches.length; i++) {
      let match = await matches.getMatchById(user.favouriteMatches[i]);
      favouriteMatchesObjects.push(match);
    }
    let favouritePlayersObjects = [];
    for (let i = 0; i < user.favouritePlayers.length; i++) {
      let player = await players.getPlayerById(user.favouritePlayers[i]);
      favouritePlayersObjects.push(player);
    }
    res
      .status(200)
      .json({ user, favouriteMatchesObjects, favouritePlayersObjects });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.route("/users/search/:searchTerm").get(async (req, res) => {
  try {
    let searchTerm = req.params.searchTerm;
    let searchUsers = await users.searchUsers(searchTerm);
    res.status(200).json(searchUsers);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

module.exports = router;
