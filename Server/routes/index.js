const matchRoutes = require("./match");
const playerRoutes = require("./player");
//const userRoutes = require("./user");

const constructorMethod = (app) => {
  app.use("/match", matchRoutes);
  app.use("/player", playerRoutes);
  app.use("*", async (req, res) => {
    res.status(404);
    return;
  });
};

module.exports = constructorMethod;
