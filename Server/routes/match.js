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

router.get("/liveScores", async (req, res) => {
  try {
    if (!client.isOpen) await client.connect();
    let liveScoresFromCache = await client.get("livescores");
    if (liveScoresFromCache) {
      console.log("live scores from redis");
      res.status(200).json(JSON.parse(liveScoresFromCache));
      return;
    } else {
      let liveScoresList = await matches.getLiveScores();
      try {
        await client.set("livescores", JSON.stringify(liveScoresList));
      } catch (e) {
        console.log("Set livescores in Redis Error");
        console.log(e);
      }
      //console.log(currentMatchesList);
      res.status(200).json(liveScoresList);
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

router.get("/match/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let currentUser = req.authenticatedUser;
    const user = await users.getUserById(currentUser);
    let matchObj = await matches.getMatchById(id);
    console.log("data", matchObj);
    res.status(200).json({ matchObj, user });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.get("/match_bbb/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let matchMetaData = await matches.getMatchById(id);
    if (!matchMetaData.data.bbbEnabled) {
      res.status(400).json({ errorCode: 400, message: "Bad request - BBB is not enabled for this match." });
      return;
    } else {
      let matchObj = await matches.getBBBMatchDataById(id);
      console.log("data", matchObj);
      res.status(200).json(matchObj);
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.post("/match/:matchId/comment", async (req, res) => {
  try {
    let matchId = req.params.matchId;
    let commenter = req.authenticatedUser;
    let comment = req.body.comment;

    try {
      validation.validateID(commenter);
      validation.validateComment(comment);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }

    let validationStatus = validation.validateCommentPostBody(body);
    if (!validationStatus.isValid) {
      res.status(400).json({ errorCode: 400, message: validationStatus.message });
      return;
    }

    const createdComment = await matches.addComment(matchId, comment, commenter);
    res.status(200).json(createdComment);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.get("/match/:matchId/comments", async (req, res) => {
  try {
    let matchId = req.params.matchId;
    let existingComments = await matches.getCommentsByMatchId(matchId);
    res.status(200).json(existingComments);
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: "Sorry, something went wrong." });
  }
});

router.delete("/match/:matchId/:commentId", async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    let matchId = req.params.matchId;
    let commentId = req.params.commentId;

    if (!validation.validateID(commentId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(commentId).message });
      return;
    }

    try {
      let matchAfterCommentDeleted = await matches.deleteComment(matchId, commentId, currentUser);
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

router.post("/match/:matchId/:commentId/replies", async (req, res) => {
  try {
    let matchId = req.params.matchId;
    let commentId = req.params.commentId;
    let commenter = req.authenticatedUser;
    let reply = req.body.reply;

    try {
      validation.validateID(commenter);
      validation.validateComment(reply);
    } catch (e) {
      res.status(400).json({ success: false, message: e, error: e });
      return;
    }

    let validationStatus = validation.validateCommentPostBody(body);
    if (!validationStatus.isValid) {
      res.status(400).json({ errorCode: 400, message: validationStatus.message });
      return;
    }

    const matchAfterCommentReplyAdded = await matches.addReply(matchId, commentId, reply, commenter);
    res.status(200).json(matchAfterCommentReplyAdded);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.delete("/match/:matchId/:commentId/:replyId", async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    let matchId = req.params.matchId;
    let commentId = req.params.commentId;
    let replyId = req.params.replyId;

    if (!validation.validateID(replyId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(replyId).message });
      return;
    }

    try {
      let matchAfterReplyDeleted = await matches.deleteReply(matchId, commentId, replyId, currentUser);
      res.status(200).json(matchAfterReplyDeleted);
      return;
    } catch (e) {
      if (e.toString().includes("Unauthorized")) {
        res.status(403).json({ errorCode: 403, message: "You don't have access to delete this reply." });
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

router.post("/match/:matchId/:commentId/:replyId/likes", async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    let matchId = req.params.matchId;
    let commentId = req.params.commentId;
    let replyId = req.params.replyId;

    if (!validation.validateID(replyId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(replyId).message });
      return;
    }

    let matchAfterReplyLiked = await matches.likeReply(matchId, commentId, replyId, currentUser);
    res.status(200).json(matchAfterReplyLiked);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.delete("/match/:matchId/:commentId/:replyId/likes", async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    let matchId = req.params.matchId;
    let commentId = req.params.commentId;
    let replyId = req.params.replyId;

    if (!validation.validateID(replyId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(replyId).message });
      return;
    }

    let matchAfterReplyUnliked = await matches.unlikeReply(matchId, commentId, replyId, currentUser);
    res.status(200).json(matchAfterReplyUnliked);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.post("/match/:matchId/:commentId/likes", async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    let matchId = req.params.matchId;
    let commentId = req.params.commentId;

    if (!validation.validateID(commentId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(commentId).message });
      return;
    }

    let matchAfterCommentLiked = await matches.likeComment(matchId, commentId, currentUser);
    res.status(200).json(matchAfterCommentLiked);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.delete("/match/:matchId/:commentId/likes", async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    let matchId = req.params.matchId;
    let commentId = req.params.commentId;

    if (!validation.validateID(commentId).isValid) {
      res.status(400).json({ errorCode: 400, message: validation.validateID(commentId).message });
      return;
    }

    let matchAfterCommentUnliked = await matches.unlikeComment(matchId, commentId, currentUser);
    res.status(200).json(matchAfterCommentUnliked);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

router.post("/match/:matchId/predict", async (req, res) => {
  try {
    let currentUser = req.authenticatedUser;
    let matchId = req.params.matchId;
    let prediction = req.body.prediction;

    if (!prediction) {
      let matchObj = await matches.getMatchById(matchId);
      res.status(200).json(matchObj);
      return;
    }

    const matchAfterPredictionAdded = await matches.predictMatchResult(matchId, currentUser, prediction);
    res.status(200).json(matchAfterPredictionAdded);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorCode: 500, message: e });
    return;
  }
});

module.exports = router;
