const matchRoutes = require("./match");
const playerRoutes = require("./player");

const constructorMethod = (app) => {
  app.use("/", matchRoutes);
  app.use("/", playerRoutes);
  app.use("*", async (req, res) => {
    res.status(404).json({ errorCode: 404, message: `Resource not found.` });
    return;
  });
};

module.exports = constructorMethod;
