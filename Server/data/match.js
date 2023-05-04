const mongoCollections = require("../config/mongoCollections");
const validation = require("../validations/dataValidations");
const { ObjectId } = require("mongodb");
const matches = mongoCollections.matches;
const comments = mongoCollections.comments;
const currentMatchesUrl = "https://api.cricapi.com/v1/currentMatches?";
const allMatchesUrl = "https://api.cricapi.com/v1/matches?";
const matchUrl = "https://api.cricapi.com/v1/match_info?";
const API_KEY = "apikey=f9262a85-d559-439c-b1c0-4817f5e46208";
const axios = require("axios");

const getCurrentMatches = async () => {
  const { data } = await axios.get(currentMatchesUrl + API_KEY + "&offset=0");
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
  const { data } = await axios.get(matchUrl + API_KEY + "&id=" + id);
  metaData = data.data;
  console.log("data from data func", metaData);
  let matchObject = {
    _id: new ObjectId(),
    matchId: id,
    data: metaData,
    comments: [],
    predictions: { team1: [], team2: [], tie: [] },
  };
  const matchesCollection = await matches();
  const createdMatch = await matchesCollection.insertOne(matchObject);
  if (!createdMatch.insertedId) throw `Creating this match was unsuccessful.`;
  return metaData;
};

const getMatchByIdFromDB = async (id) => {
  const matchesCollection = await matches();
  const match = await matchesCollection.findOne({ matchId: id });
  if (!match) throw `No match found with that id ${id}`;
  return match;
};

const getCommentById = async (id) => {
  const commentsCollection = await comments();
  const comment = await commentsCollection.findOne({ _id: id });
  if (!comment) throw `No comment found with that id ${id}`;
  return comment;
};

const getCommentsByMatchId = async (id) => {
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
  let matchCommentedOn = await matchesCollection.findOne({ matchId: matchId });
  if (!matchCommentedOn) throw `No Match found with that match id ${matchId}`;

  let commentObject = {
    _id: new ObjectId(),
    userThatPostedComment: userThatPostedComment,
    comment,
    likes: [],
    replies: [],
  };

  const createdComment = await commentsCollection.insertOne(commentObject);
  if (!createdComment.insertedId) throw `Creating this comment was unsuccessful.`;

  const addCommentToMatch = await matchCommentedOn.updateOne(
    { matchId: matchId },
    { $addToSet: { comments: commentObject._id } }
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
  validation.validateComment(reply);
  const commentsCollection = await comments();
  const matchesCollection = await matches();
  const replyObject = {
    _id: new ObjectId(),
    userThatPostedReply: userThatPostedReply,
    reply,
    likes: [],
  };

  const addReply = await commentsCollection.updateOne(
    { _id: new ObjectId(commentId) },
    { $addToSet: { replies: replyObject } }
  );
  if (!addReply.modifiedCount) throw `Adding reply to comment was unsuccessful.`;

  let matchAfterReplyAdded = await getCommentsByMatchId(matchId);
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

  let matchAfterCommentLiked = await getCommentsByMatchId(matchId);
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

  let matchAfterReplyLiked = await getCommentsByMatchId(matchId);
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

  let matchAfterCommentUnliked = await getCommentsByMatchId(matchId);
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
  validation.validatePrediction(prediction);
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
  addComment,
  deleteComment,
  getCurrentMatches,
  getAllMatchesByPageNo,
  getMatchById,
  getMatchByIdFromDB,
  getCommentsByMatchId,
  addReply,
  deleteReply,
  likeComment,
  likeReply,
  unlikeComment,
  unlikeReply,
  predictMatchResult,
};
