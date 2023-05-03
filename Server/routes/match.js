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
    if (!client.isOpen) await client.connect();
    let currentMatchesFromCache = await client.get("currentmatches");
    if (currentMatchesFromCache) {
      console.log("current matches from redis");
      res.status(200).json(JSON.parse(currentMatchesFromCache));
      return;
    } else {
      let currentMatchesList = await matches.getCurrentMatches();
      try {
        await client.set("currentmatches", JSON.stringify(currentMatchesList));
      } catch (e) {
        console.log("Set current matches in Redis Error");
        console.log(e);
      }
      //console.log(currentMatchesList);
      res.status(200).json(currentMatchesList);
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.get("/allMatches/page/:pageNo", async (req, res) => {
  try {
    let pageNo = req.params.pageNo;
    //write validatePageNo in route validation
    validation.validatePageNo(pageNo);
    if (!client.isOpen) await client.connect();
    let allMatchesFromCache = await client.get("allmatches" + pageNo);
    if (allMatchesFromCache) {
      console.log("all matches from redis");
      res.status(200).json(JSON.parse(allMatchesFromCache));
      return;
    } else {
      let allMatchesList = await matches.getAllMatchesByPageNo(pageNo);
      try {
        await client.set("allmatches" + pageNo, JSON.stringify(allMatchesList));
      } catch (e) {
        console.log("Set all matches in Redis Error");
        console.log(e);
      }
      //console.log(allMatchesList);
      res.status(200).json(allMatchesList);
      return;
    }
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

module.exports = router;
