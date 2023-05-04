import React, { useState } from "react";
import { Box, Button, Collapse, Grid, IconButton, TextField, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ReplyIcon from "@material-ui/icons/Reply";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  inputField: {
    marginRight: theme.spacing(1),
  },
  iconButton: {
    padding: theme.spacing(1),
  },
}));

const Comment = ({ comment }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    console.log("Submitting reply:", replyText);
    setReplyText("");
  };

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item>
        <Typography variant="subtitle1">{comment.username}</Typography>
      </Grid>
      <Grid item xs>
        <Typography variant="body1">{comment.text}</Typography>
        <Box display="flex" alignItems="center">
          <IconButton className={classes.iconButton} onClick={handleLikeClick}>
            <Badge badgeContent={comment.likes} color="secondary">
              {liked ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
            </Badge>
          </IconButton>
          <IconButton className={classes.iconButton} onClick={handleExpandClick}>
            <Badge badgeContent={comment.replies.length} color="primary">
              <ReplyIcon />
            </Badge>
          </IconButton>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {comment.replies.map((reply) => (
            <Grid container spacing={2} key={reply.id}>
              <Grid item>
                <Typography variant="subtitle2">{reply.username}</Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="body1">{reply.text}</Typography>
                <Box display="flex" alignItems="center">
                  <IconButton className={classes.iconButton} onClick={handleLikeClick}>
                    <Badge badgeContent={reply.likes} color="secondary">
                      {liked ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
                    </Badge>
                  </IconButton>
                  <IconButton className={classes.iconButton}>
                    <ReplyIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}
          <form onSubmit={handleReplySubmit}>
            <Box display="flex" alignItems="center">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className={classes.inputField}
              />
              <Button variant="contained" color="primary" type="submit">
                Reply
              </Button>
            </Box>
          </form>
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default Comment;
