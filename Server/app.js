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

const urlCounter = {};

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

// // 1. You will apply a middleware that will be applied to the POST, PUT and PATCH routes for the /recipes endpoint that will check if there is a logged in user, if there is not a user logged in,
// // you will respond with the proper status code and display and error message. (A non-logged in user SHOULD be able to access the GET /recipes route)
// app.use("/recipes$", async (req, res, next) => {
//   if ((req.method === "PUT" || req.method === "PATCH" || req.method === "POST") && !req.session.userId) {
//     console.log(`Guest user trying to perform unauthorized action on /recipes!`);
//     res.status(401).json({ errorCode: 401, message: `You should be logged to perform this action` });
//     return;
//   }
//   next();
// });

// // 2. You will apply a middleware that will be applied to POST and DELETE for the /recipes/:id/comments and /recipes/:recipeId/:commentId endpoints respectively that will check if there is a logged in user.
// // If there is not a user logged in, you will respond with the proper status code and display and error message.
// app.use("/recipes/:id/comments$", async (req, res, next) => {
//   if ((req.method === "DELETE" || req.method === "POST") && !req.session.userId) {
//     console.log(`Guest user trying to perform unauthorized action`);
//     res.status(401).json({ errorCode: 401, message: `You've to be logged in to perform this action.` });
//     return;
//   }
//   next();
// });

// app.use("/recipes/:recipeId/:commentId$", async (req, res, next) => {
//   if (req.method === "POST" && !req.session.userId) {
//     console.log(`Guest user trying to perform unauthorized action - post a comment!`);
//     res.status(401).json({ errorCode: 401, message: `You should be logged to comment in this recipe` });
//     return;
//   }
//   if (req.method === "DELETE" && !req.session.userId) {
//     console.log(`Guest user trying to perform unauthorized action - delete a comment!`);
//     res.status(401).json({ errorCode: 401, message: `You've to be logged in to perform this action.` });
//     return;
//   }
//   next();
// });

// // 3. The third middleware will apply to the entire application and will log all request bodies if there is a request body (GET routes can/will just log an empty object for the request body).
// // Do not log passwords from the request body if the request body contains a password field. You will also log the url path they are requesting, and the HTTP verb they are using to make the request.
// app.use((req, res, next) => {
//   let requestBody = { ...req.body };
//   //console.log(requestBody);
//   if (req.method === "PUT" || req.method === "PATCH" || req.method === "POST") {
//     if ("password" in requestBody) {
//       delete requestBody.password;
//     }
//     console.log(`${JSON.stringify(requestBody)} - ${req.originalUrl} - ${req.method} `);
//   } else {
//     console.log(`${JSON.stringify(requestBody)} - ${req.originalUrl} - ${req.method} `);
//   }
//   next();
// });

// // 4. The fourth will apply to the entire application and will keep track of how many times a particular URL has been requested, updating and logging with each request.
// app.use((req, res, next) => {
//   let requestedUrl = req.originalUrl;
//   if (requestedUrl in urlCounter) {
//     urlCounter[requestedUrl] += 1;
//   } else {
//     urlCounter[requestedUrl] = 1;
//   }
//   console.log(`Url ${req.originalUrl} is requested ${urlCounter[requestedUrl]} time(s)`);
//   next();
// });

// this middleware authenticates the user based on the authtoken sent in the request
// no authtoken is required for the "/api/users" route (obviously) as the user wouldn't be created at that point
// feel free to add exception cases here

app.use(async (req, res, next) => {
  console.log(req.originalUrl, req.method);
  if (req.originalUrl === "/users/signup" && req.method.toLowerCase() === "post") {
    console.log("User creation process. Skipping authentication check.");
    next();
    return;
  }
  if (req.originalUrl.includes("/users/check")) {
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
