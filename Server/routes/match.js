const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const matches = require("../data/match");
const users = require("../data/user");
const validation = require("../validations/routeValidations");
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

router.get("/currentMatches", async (req, res) => {
  try {
    // fetch current matches data here and process it
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.get("/allMatches", async (req, res) => {
  try {
    // fetch all matches data here and process it
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.get("/matches/:id", async (req, res) => {
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

router.post("/matches/:id/comments", async (req, res) => {
  try {
    if (!req.session.userId) {
      res.status(401).json({ errorCode: 401, message: "You've to be logged in to perform this action." });
      return;
    }

    let body = req.body;
    let id = req.params.id;
    let idValidate = validation.validateID(id);
    if (!idValidate.isValid) {
      res.status(400).json({ errorCode: 400, message: idValidate.message });
      return;
    }

    let validationStatus = validation.validateCommentPostBody(body);
    if (!validationStatus.isValid) {
      res.status(400).json({ errorCode: 400, message: validationStatus.message });
      return;
    }

    try {
      let userThatPostedComment = {
        _id: req.session.userId,
        username: req.session.username,
      };
      const createdComment = await recipes.addComment(id, body.comment, userThatPostedComment);
      res.status(200).json(createdComment);
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

router.delete("/matches/:matchId/:commentId", async (req, res) => {
  try {
    if (!req.session.userId) {
      res.status(401).json({ errorCode: 401, message: "You must be logged in to perform this action." });
      return;
    }

    let matchId = req.params.matchId;
    let commentId = req.params.commentId;

    if (!validation.validateID(matchId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(matchId).message });
      return;
    }
    if (!validation.validateID(commentId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(commentId).message });
      return;
    }

    let userId = req.session.userId;
    try {
      let matchAfterCommentDeleted = await matches.deleteComment(matchId, commentId, userId);
      res.status(200).json(matchAfterCommentDeleted);
      return;
    } catch (e) {
      if (e.toString().includes("Unauthorized")) {
        res.status(403).json({ errorCode: 403, message: "You don't have access to delete this comment." });
        return;
      } else {
        console.log(e);
        res.status(400).json({ errorCode: 400, message: e });
        return;
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.post("/matches/:matchId/:commentId/replies", async (req, res) => {
  try {
    if (!req.session.userId) {
      res.status(401).json({ errorCode: 401, message: "You've to be logged in to perform this action." });
      return;
    }

    let body = req.body;
    let matchId = req.params.matchId;
    let commentId = req.params.commentId;
    let idValidate = validation.validateID(matchId);
    if (!idValidate.isValid) {
      res.status(400).json({ errorCode: 400, message: idValidate.message });
      return;
    }

    let validationStatus = validation.validateCommentPostBody(body);
    if (!validationStatus.isValid) {
      res.status(400).json({ errorCode: 400, message: validationStatus.message });
      return;
    }

    try {
      let userThatPostedCommentReply = {
        _id: req.session.userId,
        username: req.session.username,
      };
      const createdComment = await matches.addCommentReply(
        matchId,
        commentId,
        body.comment,
        userThatPostedCommentReply
      );
      res.status(200).json(createdComment);
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

router.delete("/matches/:matchId/:commentId/:replyId", async (req, res) => {
  try {
    if (!req.session.userId) {
      res.status(401).json({ errorCode: 401, message: "You must be logged in to perform this action." });
      return;
    }

    let matchId = req.params.matchId;
    let commentId = req.params.commentId;
    let replyId = req.params.replyId;

    if (!validation.validateID(matchId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(matchId).message });
      return;
    }
    if (!validation.validateID(commentId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(commentId).message });
      return;
    }

    if (!validation.validateID(replyId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(replyId).message });
      return;
    }

    let userId = req.session.userId;
    try {
      let matchAfterCommentReplyDeleted = await matches.deleteCommentReply(matchId, commentId, replyId, userId);
      res.status(200).json(matchAfterCommentReplyDeleted);
      return;
    } catch (e) {
      if (e.toString().includes("Unauthorized")) {
        res.status(403).json({ errorCode: 403, message: "You don't have access to delete this comment." });
        return;
      } else {
        console.log(e);
        res.status(400).json({ errorCode: 400, message: e });
        return;
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

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
