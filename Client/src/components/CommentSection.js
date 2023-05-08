import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "../styles/CommentSection.css";
import { CircularProgress } from "@material-ui/core";
// eslint-disable-next-line
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
// eslint-disable-next-line
import DeleteIcon from "@material-ui/icons/Delete";
//import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
function CommentSection() {
  const { currentUser } = useContext(AuthContext);
  // eslint-disable-next-line
  const [matchData, setMatchData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState();
  // eslint-disable-next-line
  const [currentUsername, setCurrentUsername] = useState("");
  const [commentInput, setCommentInput] = useState("");
  // eslint-disable-next-line
  const [replyInput, setReplyInput] = useState("");
  // eslint-disable-next-line
  const [currentCommentId, setCurrentCommentId] = useState("");
  let { id } = useParams();
  // eslint-disable-next-line
  const [matchId, setMatchId] = useState(id);
  let currentUserid = currentUser.uid;

  async function fetchData() {
    setLoading(true);
    let authtoken = await currentUser.getIdToken();
    try {
      const {
        data: { matchObj, user, commentObjects },
      } = await axios.get("http://localhost:3001/matches/match/" + matchId, {
        headers: { authtoken: authtoken },
      });

      console.log(matchObj);
      setCurrentUsername(user.displayName);
      setComments(commentObjects);
      setMatchData(matchObj);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log("Match data useEffect fired");
    fetchData();
    // eslint-disable-next-line
  }, [matchId, currentUser]);

  function handleCommentInputChange(event) {
    setCommentInput(event.target.value);
  }

  // function handleReplyInputChange(e) {
  //   setReplyInput(e.target.value);
  // }

  async function handleCommentSubmit() {
    if (commentInput && commentInput.trim() !== "") {
      // axios call to add comment to database
      setLoading(true);
      let authtoken = await currentUser.getIdToken();
      try {
        const { data } = await axios.post(
          "http://localhost:3001/matches/match/" + id + "/comment",
          { commentInput, currentUserid },
          {
            headers: { authtoken: authtoken },
          }
        );

        console.log(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
      fetchData();
    }
    setCommentInput("");
  }

  async function handleReplySubmit(event, commentId) {
    console.log(commentId);
    event.preventDefault();
    let replyInput = document.getElementById(commentId).value;
    if (replyInput && replyInput.trim() !== "") {
      // axios call to add reply to database
      setLoading(true);
      let authtoken = await currentUser.getIdToken();
      try {
        const { data } = await axios.post(
          "http://localhost:3001/matches/match/" + id + "/" + commentId + "/reply",
          { replyInput, currentUserid },
          {
            headers: { authtoken: authtoken },
          }
        );

        console.log(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
      fetchData();
    }
    document.getElementById(commentId).value = "";
  }

  async function likeReply(commentId, replyId) {
    setLoading(true);
    let authtoken = await currentUser.getIdToken();
    try {
      const { data } = await axios.post(
        "http://localhost:3001/matches/match/" + id + "/" + commentId + "/" + replyId + "/like",
        {},
        {
          headers: { authtoken: authtoken },
        }
      );

      console.log(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
    fetchData();
  }

  async function unlikeReply(commentId, replyId) {
    setLoading(true);
    let authtoken = await currentUser.getIdToken();
    try {
      const { data } = await axios.post(
        "http://localhost:3001/matches/match/" + id + "/" + commentId + "/" + replyId + "/unlike",
        {},
        {
          headers: { authtoken: authtoken },
        }
      );

      console.log(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
    fetchData();
  }

  async function likeComment(commentId) {
    setLoading(true);
    let authtoken = await currentUser.getIdToken();
    try {
      const { data } = await axios.post(
        "http://localhost:3001/matches/match/" + id + "/" + commentId + "/like",
        { currentUserid },
        {
          headers: { authtoken: authtoken },
        }
      );

      console.log(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
    fetchData();
  }

  async function unlikeComment(commentId) {
    setLoading(true);
    let authtoken = await currentUser.getIdToken();
    try {
      const { data } = await axios.post(
        "http://localhost:3001/matches/match/" + id + "/" + commentId + "/unlike",
        { currentUserid },
        {
          headers: { authtoken: authtoken },
        }
      );

      console.log(data);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
    fetchData();
  }

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div className="comment-section">
        {/* <h2>Comments ({comments.length})</h2> */}
        <ul>
          {comments &&
            comments.map((comment) => (
              <li key={comment._id}>
                <div className="comment-div">
                  <span>
                    <strong>
                      <Link to={"/user/" + comment.username}>{comment.username}</Link>
                      {": "}
                    </strong>{" "}
                    {comment.comment}
                  </span>
                  <button
                    className={comment.likes.includes(currentUserid) ? "like-btn active" : "like-btn"}
                    onClick={() => {
                      comment.likes.includes(currentUserid) ? unlikeComment(comment._id) : likeComment(comment._id);
                    }}
                  >
                    {comment.likes.includes(currentUserid) ? (
                      <ThumbUpIcon className="heart-icon" />
                    ) : (
                      <ThumbUpIcon className="heart-icon-outline" />
                    )}
                    {comment.likes.length > 0 && <span className="like-count">{comment.likes.length}</span>}
                  </button>
                </div>
                {comment.replies && (
                  <ul className="reply-list">
                    {comment.replies.map((reply, replyIndex) => (
                      <li key={reply._id}>
                        <div className="reply-div">
                          <span>
                            <strong>
                              <Link to={"/user/" + reply.username}>{reply.username}</Link>
                              {": "}
                            </strong>{" "}
                            {reply.text}
                          </span>
                          <button
                            className={reply.likes.includes(currentUserid) ? "like-btn active" : "like-btn"}
                            onClick={() => {
                              reply.likes.includes(currentUserid)
                                ? unlikeReply(comment._id, reply._id)
                                : likeReply(comment._id, reply._id);
                            }}
                          >
                            {reply.likes.includes(currentUserid) ? (
                              <ThumbUpIcon className="heart-icon" />
                            ) : (
                              <ThumbUpIcon className="heart-icon-outline" />
                            )}
                            {reply.likes.length > 0 && <span className="like-count">{reply.likes.length}</span>}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <form
                  className="reply-form"
                  onSubmit={(event) => {
                    handleReplySubmit(event, comment._id);
                  }}
                >
                  <input
                    required
                    id={comment._id}
                    type="text"
                    className="reply-input"
                    placeholder="Write a reply"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleReplySubmit(e, comment._id);
                      }
                    }}
                  />
                  <button type="submit" className="reply-btn">
                    Reply
                  </button>
                </form>
              </li>
            ))}
        </ul>
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <input
            required
            type="text"
            className="comment-input"
            placeholder="Write a comment"
            value={commentInput}
            onChange={handleCommentInputChange}
          />
          <button type="submit" className="comment-btn">
            Post
          </button>
        </form>
      </div>
    );
  }
}

export default CommentSection;
