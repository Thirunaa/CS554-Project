const matchRoutes = require("./match");
const playerRoutes = require("./player");
const userRoutes = require("./user");

const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/matches", matchRoutes);
  app.use("/players", playerRoutes);
  app.use("*", async (req, res) => {
    res.status(404);
    return;
  });
};

module.exports = constructorMethod;
