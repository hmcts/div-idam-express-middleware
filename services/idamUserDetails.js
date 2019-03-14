const idamWrapper = require('../wrapper');
const { Logger } = require('@hmcts/nodejs-logging');
const config = require('../config');
const cookies = require('../utilities/cookies');

const logger = Logger.getLogger(__filename);

const idamExpressUserDetails = (args = {}) => {
  const idamFunctions = idamWrapper.setup(args);

  const tokenCookieName = args.tokenCookieName || config.tokenCookieName;

  return (req, res, next) => {
    const authToken = cookies.get(req, tokenCookieName);

    if (authToken) {
      idamFunctions
        .getUserDetails(authToken, args)
        .then(userDetails => {
          req.idam = { userDetails };
          next();
        })
        .catch(error => {
          logger.error(`User failed authentication when getting user details: ${error}`);
          cookies.remove(res, tokenCookieName);
          next();
        });
    } else {
      next();
    }
  };
};

module.exports = idamExpressUserDetails;
