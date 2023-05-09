const express = require("express");
const session = require("express-session");
const http = require("http");
const socketio = require("socket.io");
let redisStore = require("connect-redis").default;

// Please change this part accordingly, if you are running in redis version 3, as given in this link
// https://www.npmjs.com/package/connect-redis
const { createClient } = require("redis");
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);
const configRoutes = require("./routes");
const app = express();
const cors = require("cors");

// Firebase Middle ware variables and imports
const { firebaseApp } = require("./initFirebaseAdmin");
require("dotenv").config();

//Chat App Middleware variables
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const port = 3002;
const matchRooms = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(
  session({
    name: "AuthCookie",
    secret: "shhhhh",
    resave: false,
    saveUninitialized: true,
  })
);

// Chat App Middleware
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("join", (matchId) => {
    console.log(`Socket ${socket.id} joining match ${matchId}`);

    // Join the chat room for the current match
    socket.join(matchId);

    // Create the chat room for the current match if it doesn't exist
    if (!matchRooms[matchId]) {
      matchRooms[matchId] = [];
    }

    // Send the existing messages
    socket.emit("message", matchRooms[matchId]);
  });

  socket.on("message", ({ id, message }) => {
    const matchId = id;
    if (!matchRooms[matchId]) {
      matchRooms[matchId] = [];
    }

    console.log(`Socket ${socket.id} sending message to match ${matchId}: ${message}`);

    // Add the new message to the chat room for the current match
    matchRooms[matchId].push(message);

    // Send the new message to all sockets in the chat room
    io.to(matchId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Chat Server listening on port ${port}`);
});

// Firebase Middleware and authentication check for all routes except signup and check username and landing page

app.use(async (req, res, next) => {
  console.log(req.originalUrl, req.method);
  if (req.originalUrl === "/users/signup" && req.method.toLowerCase() === "post") {
    console.log("User creation process. Skipping authentication check.");
    next();
    return;
  }
  if (req.originalUrl.includes("/users/check/")) {
    console.log("Username checking process. Skipping authentication check.");
    next();
    return;
  }

  if (req.originalUrl === "/") {
    console.log("Display Cricket News - Home. Skipping authentication check.");
    next();
    return;
  }

  const idToken = req.headers.authtoken;
  try {
    if (!idToken) {
      throw `No authtoken in incoming request. Cannot authenticate user.`;
    }
    let { uid, email, auth_time } = await firebaseApp.auth().verifyIdToken(idToken);
    console.info(`Authenticated user with email ${email}. Authenticated on: ${new Date(auth_time * 1000)}`);
    req["authenticatedUser"] = uid;
  } catch (e) {
    console.log(e);
    res.status(401).json({ success: false, message: "You must be logged in to perform this action. Please login." });
    return;
  }
  next();
});

configRoutes(app);

app.listen(3001, () => {
  console.log("Server started at port 3001!");
});
