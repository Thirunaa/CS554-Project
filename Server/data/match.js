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
  };
  const matchesCollection = await matches();
  const createdMatch = await matchesCollection.insertOne(matchObject);
  if (!createdMatch.insertedId) throw `Creating this match was unsuccessful.`;
  return metaData;
};

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
  if (commentObject.userThatPostedComment != userId) throw `User ${userId} is not authorized to delete this comment.`;

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

const addLike = async (id, userIdThatPostedLike) => {
  validation.validateID(id);
  let likes = [];

  const recipesCollection = await recipes();
  let recipeToBeLiked = await recipesCollection.findOne({ _id: new ObjectId(id) });
  if (!recipeToBeLiked) throw `No Recipe found with id ${id}`;

  if (recipeToBeLiked.likes.includes(userIdThatPostedLike.toString())) {
    likes = recipeToBeLiked.likes.filter(function (likerId) {
      return likerId != userIdThatPostedLike.toString();
    });
  } else {
    likes = recipeToBeLiked.likes;
    likes.push(userIdThatPostedLike.toString());
  }

  const addLike = await recipesCollection.updateOne({ _id: new ObjectId(id) }, { $set: { likes: likes.flat() } });

  if (!addLike.modifiedCount) throw `Like/Unlike was unsuccessful.`;
  return await recipesCollection.findOne({ _id: new ObjectId(id) });
};

module.exports = {
  addComment,
  deleteComment,
  addLike,
  getCurrentMatches,
  getAllMatchesByPageNo,
  getMatchById,
};
