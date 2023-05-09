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

const validateUsername = (inputUsername) => {
  if (!inputUsername)
    return {
      isValid: false,
      message: "Username not provided.",
    };

  if (typeof inputUsername !== "string")
    return {
      isValid: false,
      message: "Username is not of valid input type.",
    };
  if (inputUsername.trim().length === 0)
    return {
      isValid: false,
      message: "Username is empty.",
    };
  if (inputUsername.includes(" "))
    return {
      isValid: false,
      message: "Username should not contain spaces.",
    };
  if (inputUsername.length < 3) throw `Username must contain at least 3 characters.`;
  const regexLetters = /[a-zA-Z]/;
  if (inputUsername.search(regexLetters) < 0) {
    return {
      isValid: false,
      message: "The userName must contains alphabets.",
    };
  }
  return { isValid: true };
};

const validateComment = (inputComment) => {
  if (inputComment === undefined) return { isValid: false, message: `No comment provided.` };
  if (typeof inputComment !== "string") return { isValid: false, message: `Comment should be string.` };
  if (inputComment.length === 0) return { isValid: false, message: `Comment is empty` };
  if (inputComment.trim().length === 0) return { isValid: false, message: `Comment contains only whitespaces.` };
  return { isValid: true };
};

module.exports = {
  validateUsername,
  validateID,
  validateComment,
  validatePageNo,
};
