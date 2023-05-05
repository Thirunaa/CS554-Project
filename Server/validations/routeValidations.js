const { ObjectId } = require("mongodb");

const validateID = (id) => {
  if (!id) return { isValid: false, message: `No id provided.` };
  if (typeof id !== "string")
    return { isValid: false, message: `Please enter a valid id. The type of id must be a string` };
  if (id.trim().length === 0)
    return {
      isValid: false,
      message: `Please enter a valid id. The id field cannot be an empty string or just spaces`,
    };
  id = id.trim();
  if (!ObjectId.isValid(id))
    return { isValid: false, message: `Please give a valid objectid. The object id is not valid.` };
  return { isValid: true };
};

const validatePageNo = (PageNo) => {
  if (PageNo.includes(".")) {
    return { isValid: false, message: `400 - Bad request` };
  }
  if (Number.isInteger(parseInt(PageNo))) {
    if (parseInt(PageNo) < 0) {
      return { isValid: false, message: `404 - Page not found` };
    }
  } else {
    return { isValid: false, message: `400 - Bad request` };
  }
  return { isValid: true };
};

const validateName = (name) => {
  if (!name)
    return {
      isValid: false,
      message: "Invalid query params - Expected: [ name: string]",
    };

  if (typeof name !== "string")
    return {
      isValid: false,
      message: "Invalid datatype for name - Expected: [ name: string]",
    };
  return { isValid: true };
};

const validateLogin = (inputBody) => {
  if (typeof inputBody !== "object") return { isValid: false, message: `Invalid body provided for login.` };
  if (!inputBody.username || !inputBody.password) return { isValid: false, message: `Invalid params in request body.` };
  if (typeof inputBody.username !== "string")
    return {
      isValid: false,
      message: `Invalid datatype for username. Expecting a String`,
    };
  if (typeof inputBody.password !== "string")
    return {
      isValid: false,
      message: "Invalid datatype for password. Expecting a String",
    };
  if (inputBody.username.length === 0 || inputBody.username.trim().length === 0)
    return { isValid: false, message: `Either the username or password is invalid` };
  if (inputBody.password.length === 0 || inputBody.password.trim().length === 0)
    return { isValid: false, message: `Either the username or password is invalid` };
  return { isValid: true };
};

const validateCommentPostBody = (commentBody) => {
  if (commentBody === undefined) return { isValid: false, message: `Invalid input.` };
  if (typeof commentBody !== "object" || Array.isArray(commentBody))
    return { isValid: false, message: `Invalid body type. Expecting a object` };
  if (!commentBody.comment) return { isValid: false, message: `Body does not have comment parameter.` };

  if (Object.keys(commentBody).some((element) => element !== "comment")) {
    return {
      isValid: false,
      message: `Allowed parameter is "comment". Unexpected parameter ${element} passed`,
    };
  }

  return { isValid: true };
};

module.exports = {
  validateName,
  validateLogin,
  validateID,
  validateCommentPostBody,
  validatePageNo,
};
