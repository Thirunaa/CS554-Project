const mongoCollections = require("../config/mongoCollections");
const validation = require("../validations/dataValidations");
const { ObjectId } = require("mongodb");
const matches = mongoCollections.matches;
const comments = mongoCollections.comments;
const users = require("../data/user");
const currentMatchesUrl = "https://api.cricapi.com/v1/currentMatches?";
const allMatchesUrl = "https://api.cricapi.com/v1/matches?";
const matchUrl = "https://api.cricapi.com/v1/match_info?";
const ballbyballUrl = "https://api.cricapi.com/v1/match_bbb?";
const liveScoresUrl = "https://api.cricapi.com/v1/cricScore?";
const newsAPI = "https://newsapi.org/v2/top-headlines?country=in&category=sports&q=Cric&";
const newAPI_KEY = "apiKey=f1a6e7d5baf347b5b46b2b32ac608252";
const API_KEY = "apikey=62fea853-66e8-45e1-9e61-b8f56daa7058";

const axios = require("axios");

const getCricketNews = async () => {
  const { data } = await axios.get(newsAPI + newAPI_KEY);
  //console.log(data);
  return data.articles;
};

const getCurrentMatches = async () => {
  let currentMatchesList = [];
  for (let i = 0; i < 2; i++) {
    const { data } = await axios.get(currentMatchesUrl + API_KEY + "&offset=" + (i * 25).toString());
    //console.log(data.data);
    currentMatchesList = currentMatchesList.concat(data.data);
  }
  //console.log(currentMatchesList.length);
  return currentMatchesList;
};

const getLiveScores = async () => {
  const { data } = await axios.get(liveScoresUrl + API_KEY);
  //console.log(data.data);
  return data.data;
};

const getAllMatchesByPageNo = async (PageNo) => {
  validation.validatePageNo(PageNo);
  PageNo = parseInt(PageNo);
  let offset = 25 * PageNo;
  const { data } = await axios.get(allMatchesUrl + API_KEY + "&offset=" + offset);
  //console.log(data.data);
  return data.data;
};

const getMatchById = async (id) => {
  const matchesCollection = await matches();
  const { data } = await axios.get(matchUrl + API_KEY + "&id=" + id);
  metaData = data.data;
  let match = await matchesCollection.findOne({ matchId: id });

  if (match) {
    //console.log("data from data func - Match already in DB", match);
    const updatedMatchMetaData = await matchesCollection.updateOne({ matchId: id }, { $set: { data: metaData } });
    if (!updatedMatchMetaData.modifiedCount) return match;
    return await matchesCollection.findOne({ matchId: id });
  } else {
    //console.log("data from data func - Match inserted into DB", metaData);
    let matchObject = {
      _id: new ObjectId(),
      matchId: id,
      data: metaData,
      comments: [],
      predictions: { team1: [], team2: [], tie: [] },
    };
    const createdMatch = await matchesCollection.insertOne(matchObject);
    if (!createdMatch.insertedId) throw `Creating this match was unsuccessful.`;
    return await matchesCollection.findOne({ matchId: id });
  }
};

const getBBBMatchDataById = async (id) => {
  const { data } = await axios.get(ballbyballUrl + API_KEY + "&id=" + id);
  return data;
};

const getMatchByIdFromDB = async (id) => {
  const matchesCollection = await matches();
  const match = await matchesCollection.findOne({ matchId: id });
  if (!match) throw `No match found with that id ${id}`;
  return match;
};

const getCommentById = async (id) => {
  const commentsCollection = await comments();
  const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });
  if (!comment) throw `No comment found with that id ${id}`;
  return comment;
};

const getCommentObjectsByMatchId = async (id) => {
  const matchesCollection = await matches();
  const match = await matchesCollection.findOne({ matchId: id });
  if (!match) throw `No match found with that id ${id}`;
  let commentsArray = [];
  for (let i = 0; i < match.comments.length; i++) {
    let comment = await getCommentById(match.comments[i]);
    commentsArray.push(comment);
  }
  return commentsArray;
};

// add comment to match
// return the match object with the updated comments array
const addComment = async (matchId, comment, userThatPostedComment) => {
  validation.validateComment(comment);
  const matchesCollection = await matches();
  const commentsCollection = await comments();
  let user = await users.getUserById(userThatPostedComment);
  let matchCommentedOn = await matchesCollection.findOne({ matchId: matchId });
  if (!matchCommentedOn) throw `No Match found with that match id ${matchId}`;

  let commentObject = {
    _id: new ObjectId(),
    userThatPostedComment: userThatPostedComment,
    username: user.displayName,
    comment,
    likes: [],
    replies: [],
  };

  const createdComment = await commentsCollection.insertOne(commentObject);
  if (!createdComment.insertedId) throw `Creating this comment was unsuccessful.`;

  const addCommentToMatch = await matchesCollection.updateOne(
    { matchId: matchId },
    { $addToSet: { comments: commentObject._id.toString() } }
  );
  if (!addCommentToMatch.modifiedCount) throw `Adding comment to match was unsuccessful.`;
  return await matchesCollection.findOne({ matchId: matchId });
};

const deleteComment = async (matchId, commentId, userId) => {
  validation.validateID(commentId);

  const matchesCollection = await matches();
  const commentsCollection = await comments();
  let commentObject = await commentsCollection.findOne({ _id: commentId });
  if (!commentObject) throw `No comment found with match id ${matchId} and comment id <${commentId}>`;
  if (commentObject.userThatPostedComment != userId)
    throw `Unauthorized - User ${userId} is not authorized to delete this comment.`;

  let matchWithComment = await matchesCollection.findOne({ matchId: matchId });
  if (!matchWithComment) throw `No Match found with that match id ${matchId}`;

  let commentsWithoutDeletedComment = matchWithComment.comments.filter(function (comment) {
    return comment != commentId;
  });

  const deletedComment = await commentsCollection.deleteOne({ _id: new ObjectId(commentId) });
  if (deletedComment.deletedCount === 0) throw `Deleting comment was unsuccessful.`;

  const updateMatch = await matchesCollection.updateOne(
    { matchId: matchId },
    { $set: { comments: commentsWithoutDeletedComment } }
  );
  if (!updateMatch.modifiedCount) throw `Updating match was unsuccessful.`;

  return await matchesCollection.findOne({ matchId: matchId });
};

// return the match object with the updated comments array with the added reply
const addReply = async (matchId, commentId, reply, userThatPostedReply) => {
  //validation.validateComment(reply);
  console.log("comment id", commentId);
  const commentsCollection = await comments();
  const matchesCollection = await matches();
  let user = await users.getUserById(userThatPostedReply);
  const replyObject = {
    _id: new ObjectId(),
    userThatPostedReply: userThatPostedReply,
    username: user.displayName,
    text: reply,
    likes: [],
  };

  const addReply = await commentsCollection.updateOne(
    { _id: new ObjectId(commentId) },
    { $addToSet: { replies: replyObject } }
  );
  if (!addReply.modifiedCount) throw `Adding reply to comment was unsuccessful.`;

  let matchAfterReplyAdded = await getCommentObjectsByMatchId(matchId);
  return matchAfterReplyAdded;
};

const deleteReply = async (matchId, commentId, replyId, userId) => {
  validation.validateID(commentId);
  validation.validateID(replyId);
  const commentsCollection = await comments();
  const matchesCollection = await matches();
  let replyObject = await commentsCollection.findOne({ _id: commentId, "replies._id": replyId });
  if (!replyObject) throw `No reply found with match id ${matchId} and reply id <${replyId}>`;
  if (replyObject.userThatPostedReply != userId)
    throw `Unauthorized -User ${userId} is not authorized to delete this reply.`;

  const deleteReply = await commentsCollection.updateOne(
    { _id: new ObjectId(commentId) },
    { $pull: { replies: { _id: new ObjectId(replyId) } } }
  );
  if (!deleteReply.modifiedCount) throw `Deleting reply was unsuccessful.`;

  let matchAfterReplyDeleted = await getMatchByIdFromDB(matchId);
  return matchAfterReplyDeleted;
};

const likeComment = async (matchId, commentId, userId) => {
  validation.validateID(commentId);
  const commentsCollection = await comments();

  let commentAfterLikeAdded = await commentsCollection.updateOne(
    { _id: new ObjectId(commentId) },
    { $addToSet: { likes: userId } }
  );

  if (!commentAfterLikeAdded.modifiedCount) throw `Adding like to comment was unsuccessful.`;

  let matchAfterCommentLiked = await getCommentObjectsByMatchId(matchId);
  return matchAfterCommentLiked;
};

const likeReply = async (matchId, commentId, replyId, userId) => {
  validation.validateID(commentId);
  validation.validateID(replyId);
  const commentsCollection = await comments();

  let replyAfterLikeAdded = await commentsCollection.updateOne(
    { _id: new ObjectId(commentId), "replies._id": new ObjectId(replyId) },
    { $addToSet: { "replies.$.likes": userId } }
  );

  if (!replyAfterLikeAdded.modifiedCount) throw `Adding like to reply was unsuccessful.`;

  let matchAfterReplyLiked = await getCommentObjectsByMatchId(matchId);
  return matchAfterReplyLiked;
};

const unlikeComment = async (matchId, commentId, userId) => {
  validation.validateID(commentId);
  const commentsCollection = await comments();

  let commentAfterLikeRemoved = await commentsCollection.updateOne(
    { _id: new ObjectId(commentId) },
    { $pull: { likes: userId } }
  );

  if (!commentAfterLikeRemoved.modifiedCount) throw `Removing like from comment was unsuccessful.`;

  let matchAfterCommentUnliked = await getCommentObjectsByMatchId(matchId);
  return matchAfterCommentUnliked;
};

const unlikeReply = async (matchId, commentId, replyId, userId) => {
  validation.validateID(commentId);
  validation.validateID(replyId);
  const commentsCollection = await comments();

  let replyAfterLikeRemoved = await commentsCollection.updateOne(
    { _id: new ObjectId(commentId), "replies._id": new ObjectId(replyId) },
    { $pull: { "replies.$.likes": userId } }
  );

  if (!replyAfterLikeRemoved.modifiedCount) throw `Removing like from reply was unsuccessful.`;

  let matchAfterReplyUnliked = await getCommentsByMatchId(matchId);
  return matchAfterReplyUnliked;
};

const predictMatchResult = async (matchId, userId, prediction) => {
  //validation.validatePrediction(prediction);
  const matchesCollection = await matches();
  const match = await matchesCollection.findOne({ matchId: matchId });
  if (!match) throw `No match found with that id ${matchId}`;

  if (prediction === "team1") {
    if (match.predictions.team2.includes(userId)) {
      const updateMatch = await matchesCollection.updateOne(
        { matchId: matchId },
        { $pull: { "predictions.team2": userId } }
      );
      if (!updateMatch.modifiedCount) throw `Updating match was unsuccessful.`;
    } else if (match.predictions.tie.includes(userId)) {
      const updateMatch = await matchesCollection.updateOne(
        { matchId: matchId },
        { $pull: { "predictions.tie": userId } }
      );
      if (!updateMatch.modifiedCount) throw `Updating match was unsuccessful.`;
    }
  } else if (prediction === "team2") {
    if (match.predictions.team1.includes(userId)) {
      const updateMatch = await matchesCollection.updateOne(
        { matchId: matchId },
        { $pull: { "predictions.team1": userId } }
      );
      if (!updateMatch.modifiedCount) throw `Updating match was unsuccessful.`;
    } else if (match.predictions.tie.includes(userId)) {
      const updateMatch = await matchesCollection.updateOne(
        { matchId: matchId },
        { $pull: { "predictions.tie": userId } }
      );
      if (!updateMatch.modifiedCount) throw `Updating match was unsuccessful.`;
    }
  } else if (prediction === "tie") {
    if (match.predictions.team1.includes(userId)) {
      const updateMatch = await matchesCollection.updateOne(
        { matchId: matchId },
        { $pull: { "predictions.team1": userId } }
      );
      if (!updateMatch.modifiedCount) throw `Updating match was unsuccessful.`;
    } else if (match.predictions.team2.includes(userId)) {
      const updateMatch = await matchesCollection.updateOne(
        { matchId: matchId },
        { $pull: { "predictions.team2": userId } }
      );
      if (!updateMatch.modifiedCount) throw `Updating match was unsuccessful.`;
    }
  }

  const updateMatch = await matchesCollection.updateOne(
    { matchId: matchId },
    { $addToSet: { [`predictions.${prediction}`]: userId } }
  );
  if (!updateMatch.modifiedCount) throw `Updating match was unsuccessful.`;

  const updatedMatch = await matchesCollection.findOne({ matchId: matchId });
  return updatedMatch;
};

module.exports = {
  getCricketNews,
  addComment,
  deleteComment,
  getCurrentMatches,
  getLiveScores,
  getAllMatchesByPageNo,
  getMatchById,
  getMatchByIdFromDB,
  getBBBMatchDataById,
  getCommentObjectsByMatchId,
  addReply,
  deleteReply,
  likeComment,
  likeReply,
  unlikeComment,
  unlikeReply,
  predictMatchResult,
};
