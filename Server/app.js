const express = require("express");
const session = require("express-session");
let redisStore = require("connect-redis").default;

// Please change this part accordingly, if you are running in redis version 3, as given in this link
// https://www.npmjs.com/package/connect-redis
const { createClient } = require("redis");
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);
//
const configRoutes = require("./routes");
const app = express();
const cors = require("cors");
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

configRoutes(app);

app.listen(3001, () => {
  console.log("Server started at port 3001!");
});
