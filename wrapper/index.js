const loginUrl = require('./loginUrl');
const userDetails = require('./getUserDetails');
const accessToken = require('./accessToken');

const setup = (args = {}) => {
  const getIdamLoginUrl = options => {
    return loginUrl(options, args);
  };

  const getUserDetails = authToken => {
    return userDetails(authToken, args);
  };

  const getAccessToken = options => {
    return accessToken(options, args);
  };

  return { getIdamLoginUrl, getUserDetails, getAccessToken };
};

module.exports = { setup };
