const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const players = require("../data/player");
const users = require("../data/user");
const validation = require("../validations/routeValidations");
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

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
        await client.set("playersList" + pageNo, JSON.stringify(playersList));
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
        await client.set("searchPlayer_" + searchTerm, JSON.stringify(searchedPlayersList));
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
    if (playerFromCache) {
      console.log("player from redis");
      res.status(200).json(JSON.parse(playerFromCache));
      return;
    } else {
      let playerObj = await players.getPlayerById(id);
      try {
        await client.set("player_" + id, JSON.stringify(playerObj));
      } catch (e) {
        console.log("Set player in Redis Error");
        console.log(e);
      }
      //console.log(player);
      res.status(200).json(playerObj);
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

module.exports = router;
