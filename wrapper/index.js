const loginUrl = require('./loginUrl');
const userDetails = require('./getUserDetails');
const accessToken = require('./accessToken');
const serviceAuth = require('./getServiceAuth');

const setup = (args = {}) => {
  const getIdamLoginUrl = options => loginUrl(options, args);

  const getIdamApiUrl = () => args.idamApiUrl;

  const getUserDetails = authToken => userDetails(authToken, args);

  const getAccessToken = options => accessToken(options, args);

  const getServiceAuth = () => serviceAuth(args);

  return {
    getIdamLoginUrl,
    getUserDetails,
    getAccessToken,
    getIdamApiUrl,
    getServiceAuth
  };
};

module.exports = { setup };
