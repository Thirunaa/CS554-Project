import React, { useState } from "react";
import "../styles/CommentSection.css";
import FavoriteIcon from "@material-ui/icons/Favorite";

function CommentSection() {
  const [comments, setComments] = useState([
    {
      username: "user1",
      text: "This is the first comment",
      likes: 3,
      likedByUser: false,
      replies: [
        {
          username: "user2",
          text: "Thanks for commenting!",
          likes: 2,
          likedByUser: false,
        },
        {
          username: "user1",
          text: "I agree with you.",
          likes: 1,
          likedByUser: true,
        },
        {
          username: "user3",
          text: "What do you think about the second comment?",
          likes: 0,
          likedByUser: false,
        },
      ],
    },
    {
      username: "user2",
      text: "This is the second comment",
      likes: 2,
      likedByUser: false,
      replies: [
        {
          username: "user1",
          text: "I think it's a great comment!",
          likes: 2,
          likedByUser: false,
        },
      ],
    },
  ]);
  const [commentInput, setCommentInput] = useState("");

  function handleCommentInputChange(event) {
    setCommentInput(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (commentInput !== "") {
      setComments([
        ...comments,
        {
          username: "user3",
          text: commentInput,
          likes: 0,
          likedByUser: false,
          replies: [],
        },
      ]);
    }
    setCommentInput("");
  }

  function handleReply(event, index) {
    event.preventDefault();
    const replyInput = document.getElementById("reply-input-" + index).value;
    if (replyInput && replyInput !== "") {
      const updatedComments = [...comments];
      updatedComments[index] = {
        ...updatedComments[index],
        replies: updatedComments[index].replies
          ? [
              ...updatedComments[index].replies,
              {
                username: "user3",
                text: replyInput,
                likes: 0,
                likedByUser: false,
              },
            ]
          : [
              {
                username: "user3",
                text: replyInput,
                likes: 0,
                likedByUser: false,
              },
            ],
      };
      setComments(updatedComments);
      document.getElementById("reply-input-" + index).value = "";
    }
  }

  function handleLike(event, index) {
    event.preventDefault();
    const updatedComments = [...comments];
    const comment = updatedComments[index];
    if (comment.likedByUser) {
      comment.likedByUser = false;
      comment.likes = comment.likes > 0 ? comment.likes - 1 : 0;
    } else {
      comment.likedByUser = true;
      comment.likes += 1;
    }
    setComments(updatedComments);
  }

  function handleReplyLike(event, index, replyIndex) {
    event.preventDefault();
    const updatedComments = [...comments];
    const comment = updatedComments[index];
    const reply = comment.replies[replyIndex];
    if (reply.likedByUser) {
      reply.likedByUser = false;
      reply.likes = reply.likes > 0 ? reply.likes - 1 : 0;
    } else {
      reply.likedByUser = true;
      reply.likes += 1;
    }
    updatedComments[index].replies[replyIndex] = reply;
    setComments(updatedComments);
  }

  return (
    <div className="comment-section">
      <h2>Comments ({comments.length})</h2>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            <div className="comment-div">
              <span>
                <strong>{comment.username}</strong> {comment.text}
              </span>
              <button
                className={comment.likedByUser ? "like-btn active" : "like-btn"}
                onClick={(event) => handleLike(event, index)}
              >
                {comment.likedByUser ? (
                  <FavoriteIcon className="heart-icon" />
                ) : (
                  <FavoriteIcon className="heart-icon-outline" />
                )}
                {comment.likes > 0 && (
                  <span className="like-count">{comment.likes}</span>
                )}
              </button>
            </div>
            {comment.replies && (
              <ul className="reply-list">
                {comment.replies.map((reply, replyIndex) => (
                  <li key={replyIndex}>
                    <div className="reply-div">
                      <span>
                        <strong>{reply.username}</strong> {reply.text}
                      </span>
                      <button
                        className={
                          reply.likedByUser ? "like-btn active" : "like-btn"
                        }
                        onClick={(event) =>
                          handleReplyLike(event, index, replyIndex)
                        }
                      >
                        {reply.likedByUser ? (
                          <FavoriteIcon className="heart-icon" />
                        ) : (
                          <FavoriteIcon className="heart-icon-outline" />
                        )}
                        {reply.likes > 0 && (
                          <span className="like-count">{reply.likes}</span>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <form
              className="reply-form"
              onSubmit={(event) => handleReply(event, index)}
            >
              <input
                type="text"
                id={"reply-input-" + index}
                className="reply-input"
                placeholder="Write a reply"
              />
              <button type="submit" className="reply-btn">
                Reply
              </button>
            </form>
          </li>
        ))}
      </ul>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
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

export default CommentSection;
