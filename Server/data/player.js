const mongoCollections = require("../config/mongoCollections");
const validation = require("../validations/dataValidations");
const { ObjectId } = require("mongodb");
const allplayersUrl = "https://api.cricapi.com/v1/players?";
const playerUrl = "https://api.cricapi.com/v1/players_info?";
const API_KEY = "apikey=62fea853-66e8-45e1-9e61-b8f56daa7058";
const players = mongoCollections.players;
const axios = require("axios");

const getPlayersList = async (PageNo) => {
  validation.validatePageNo(PageNo);
  PageNo = parseInt(PageNo);
  let offset = 25 * PageNo;
  const { data } = await axios.get(allplayersUrl + API_KEY + "&offset=" + offset);
  //console.log(data.data);
  return data.data;
};

const getPlayerById = async (id) => {
  const { data } = await axios.get(playerUrl + API_KEY + "&id=" + id);
  //console.log("data from data func", data.data);
  return data.data;
};

const searchPlayersByName = async (searchTerm) => {
  const { data } = await axios.get(allplayersUrl + API_KEY + "&offset=0&search=" + searchTerm);
  return data.data;
};

module.exports = {
  getPlayersList,
  getPlayerById,
  searchPlayersByName,
};
