const mongoCollections = require("../config/mongoCollections");
const bcrypt = require("bcrypt");
const validation = require("../validations/dataValidations");
const users = mongoCollections.users;
const SALT_ROUNDS = 10;

const createUser = async (name, username, password) => {
  validation.validateName(name);
  validation.validateUsername(username);
  validation.validatePassword(password);

  const usersCollection = await users();
  let userAlreadyExists = await usersCollection.findOne({ username: { $regex: new RegExp(username, "i") } });
  if (userAlreadyExists) throw `Username taken. Try a different username`;
  let hashedPw = await bcrypt.hash(password, SALT_ROUNDS);

  let newUser = {
    name: name,
    username: username,
    password: hashedPw,
  };

  let signUp = await usersCollection.insertOne(newUser);
  if (signUp.insertedCount === 0) throw `User Signup unsuccessful.`;

  let createdUser = await usersCollection.findOne({ _id: signUp.insertedId });
  createdUser._id = createdUser._id.toString();
  delete createdUser.password;

  return createdUser;
};

const loginUser = async (username, password) => {
  validation.validateUsername(username);
  validation.validatePassword(password);

  const usersCollection = await users();
  let user = await usersCollection.findOne({ username: { $regex: new RegExp(username, "i") } });
  if (!user) throw `Either the username or password is invalid`;

  let passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) throw `Either the username or password is invalid`;
  delete user.password;

  return { isAuthenticated: true, userDetails: user };
};

module.exports = {
  createUser,
  loginUser,
};
