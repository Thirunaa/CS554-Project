const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const players = require("../data/player");
const users = require("../data/user");
const validation = require("../validations/routeValidations");
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

router.get("/playersList", async (req, res) => {
  try {
    // fetch all players data here and process it
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.get("/players/:id", async (req, res) => {
  try {
    let validationStatus = validation.validateID(req.params.id);
    let id = req.params.id;
    if (!validationStatus.isValid) {
      res.status(400).json({ errorCode: 400, message: validationStatus.message });
      return;
    }
    // const match = await matches.getRecipeById(id);
    // if (!recipe) {
    //   res.status(404).json({ errorCode: 404, message: `No Recipe found for the recipe id ${id}` });
    //   return;
    // } else {
    //   res.status(200).json(recipe);
    //   return;
    // }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

module.exports = router;
