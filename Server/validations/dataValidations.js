const { ObjectId } = require("mongodb");

const validateComment = (inputComment) => {
  if (inputComment === undefined) throw `No comment provided.`;
  if (typeof inputComment !== "string") throw `Comment should be string.`;
  if (inputComment.length === 0) throw `Comment is empty`;
  if (inputComment.trim().length === 0) throw `Comment contains only whitespaces.`;
};

const validatePageNo = (PageNo) => {
  if (PageNo.includes(".")) {
    throw `400 - Bad request`;
  }
  if (Number.isInteger(parseInt(PageNo))) {
    if (parseInt(PageNo) < 0) {
      throw `404 - Page not found`;
    }
  } else {
    throw `400 - Bad request`;
  }
};

const validateID = (id) => {
  if (!id) {
    throw `All fields need to have valid values`;
  }
  if (typeof id !== "string") {
    throw `Please enter a valid id. The type of id must be a string`;
  }
  if (id.trim().length === 0) {
    throw `Please enter a valid id. The id field cannot be an empty string or just spaces`;
  }
  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw `please give a valid objectid. The object id is not valid`;
  }
};

const validateUsername = (inputUsername) => {
  if (!inputUsername) throw `Username not provided.`;
  if (typeof inputUsername !== "string") throw `Username is not of valid input type.`;
  if (inputUsername.trim().length === 0) throw `Username is empty.`;
  if (inputUsername.includes(" ")) throw `Username should not contain spaces.`;
  if (inputUsername.length < 3) throw `Username must contain at least 3 characters.`;
  const regexLetters = /[a-zA-Z]/;
  if (inputUsername.search(regexLetters) < 0) {
    throw `The userName must contains alphabets.`;
  }
};

module.exports = {
  validateComment,
  validateID,
  validateUsername,
  validatePageNo,
};
