const mongoCollections = require("../config/mongoCollections");
const validation = require("../validations/dataValidations");
const { ObjectId } = require("mongodb");
const matches = mongoCollections.matches;
const currentMatchesUrl = "https://api.cricapi.com/v1/currentMatches?";
const allMatchesUrl = "https://api.cricapi.com/v1/matches?";
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

const addComment = async (id, comment, userThatPostedComment) => {
  validation.validateID(id);
  validation.validateComment(comment);

  const recipesCollection = await recipes();
  let recipeCommentedOn = await recipesCollection.findOne({ _id: new ObjectId(id) });
  if (!recipeCommentedOn) throw `No Recipe found with id ${id}`;

  let commentObject = {
    _id: new ObjectId(),
    userThatPostedComment: userThatPostedComment,
    comment,
  };

  const addComment = await recipesCollection.updateOne(
    { _id: new ObjectId(id) },
    { $addToSet: { comments: commentObject } }
  );

  if (!addComment.modifiedCount) throw `Adding comment was unsuccessful.`;
  return await recipesCollection.findOne({ _id: new ObjectId(id) });
};

const deleteComment = async (recipeId, commentId, userId) => {
  validation.validateID(recipeId);
  validation.validateID(commentId);
  validation.validateID(userId);

  const recipesCollection = await recipes();
  let recipeWithComment = await recipesCollection.findOne({
    _id: new ObjectId(recipeId),
    "comments._id": new ObjectId(commentId),
  });
  if (!recipeWithComment) throw `No comment found with recipe id ${recipeId} and comment id <${commentId}>`;

  for (const comment of recipeWithComment.comments) {
    if (comment._id.toString() === commentId) {
      if (comment.userThatPostedComment._id.toString() !== userId) {
        throw `Unauthorized. You do not have access to delete this comment`;
      }
    }
  }

  let deletedComment = await recipesCollection.updateOne(
    { _id: new ObjectId(recipeId), "comments._id": new ObjectId(commentId) },
    {
      $pull: {
        comments: {
          _id: new ObjectId(commentId),
        },
      },
    }
  );

  if (deletedComment.modifiedCount === 0) throw `Deleting comment was unsuccessful.`;
  return await recipesCollection.findOne({ _id: new ObjectId(recipeId) });
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
};
