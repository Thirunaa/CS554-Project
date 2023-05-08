const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const players = require("../data/player");
const users = require("../data/user");
const validation = require("../validations/routeValidations");
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

function formattedDate(dateString) {
  if (dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffInMs = today.getTime() - date.getTime();
    const diffInYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const outputString = `${month} ${day}, ${year} (${diffInYears} years)`;
    return outputString;
  } else {
    return "";
  }
}

function getStats(stats) {
  let battingStats = stats?.filter((x) => x.fn == "batting");
  let bowlingStats = stats?.filter((x) => x.fn == "bowling");
  let matchtypes = ["odi", "t20i", "ipl"];
  let newStats = {
    batting: matchtypes.map((matchtype) => {
      let obj = { matchtype };
      let arr = battingStats?.filter((x) => x.matchtype == matchtype);
      arr?.forEach((element) => {
        obj[element.stat] = element.value;
      });
      return obj;
    }),
    bowling: matchtypes.map((matchtype) => {
      let obj = { matchtype };
      let arr = bowlingStats?.filter((x) => x.matchtype == matchtype);
      arr?.forEach((element) => {
        obj[element.stat] = element.value;
      });
      return obj;
    }),
  };

  return newStats;
}

router.get("/playersList/page/:pageNo", async (req, res) => {
  try {
    let pageNo = req.params.pageNo;
    let validationStatus = validation.validatePageNo(pageNo);
    console.log(validationStatus);
    if (!validationStatus.isValid) {
      if (validationStatus.message.includes("404")) {
        res.status(404).json({ errorCode: 404, message: validationStatus.message });
        return;
      }
      if (validationStatus.message.includes("400")) {
        res.status(400).json({ errorCode: 400, message: validationStatus.message });
        return;
      }
    }
    if (!client.isOpen) await client.connect();
    let playersListFromCache = await client.get("playersList" + pageNo);
    if (playersListFromCache) {
      console.log("playersList from redis");
      res.status(200).json(JSON.parse(playersListFromCache));
      return;
    } else {
      let playersList = await players.getPlayersList(pageNo);
      try {
        // Set this key expiration date to 24 hours - watching for player list updates
        await client.set("playersList" + pageNo, JSON.stringify(playersList), "EX", 24 * 60 * 60);
      } catch (e) {
        console.log("Set playersList in Redis Error");
        console.log(e);
      }
      //console.log(playersList);
      res.status(200).json(playersList);
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.get("/search/:searchTerm", async (req, res) => {
  try {
    let searchTerm = req.params.searchTerm;
    if (!client.isOpen) await client.connect();
    let searchedPlayersListFromCache = await client.get("searchPlayer_" + searchTerm);
    if (searchedPlayersListFromCache) {
      console.log("searched players from redis");
      res.status(200).json(JSON.parse(searchedPlayersListFromCache));
      return;
    } else {
      let searchedPlayersList = await players.searchPlayersByName(searchTerm);
      try {
        // Set this key expiration date to 24 hours - watching for player list updates
        await client.set("searchPlayer_" + searchTerm, JSON.stringify(searchedPlayersList), "EX", 24 * 60 * 60);
      } catch (e) {
        console.log("Set searched playersList in Redis Error");
        console.log(e);
      }
      //console.log(searchedPlayersList);
      res.status(200).json(searchedPlayersList);
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.get("/player/:id", async (req, res) => {
  try {
    let id = req.params.id;
    if (!client.isOpen) await client.connect();

    let playerFromCache = await client.get("player_" + id);
    let currentUser = req.authenticatedUser;
    const user = await users.getUserById(currentUser);
    console.log("user", user);
    if (playerFromCache) {
      console.log("player from redis");
      res.status(200).json({ playerObj: JSON.parse(playerFromCache), user });
      return;
    } else {
      let playerObj = await players.getPlayerById(id);
      playerObj.dateOfBirth = formattedDate(playerObj.dateOfBirth);
      playerObj.stats = getStats(playerObj.stats);
      try {
        // Set this key expiration date to 24 hours - watching for player stats updates
        await client.set("player_" + id, JSON.stringify(playerObj), "EX", 24 * 60 * 60);
      } catch (e) {
        console.log("Set player in Redis Error");
        console.log(e);
      }
      //console.log(player);
      res.status(200).json({ playerObj, user });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

module.exports = router;
