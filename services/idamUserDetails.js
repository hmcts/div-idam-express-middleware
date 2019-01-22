const idamWrapper = require('../wrapper');
const { Logger } = require('@hmcts/nodejs-logging');
const config = require('../config');
const cookies = require('../utilities/cookies');

const logger = Logger.getLogger(__filename);

const idamUserDetails = (args = {}) => {
  const idamFunctions = idamWrapper.setup(args);

  const tokenCookieName = args.tokenCookieName || config.tokenCookieName;
  const appInsightsCookieName = args.appInsightsCookieName || config.appInsightsCookieName;

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
          logger.error(`User failed authentication: ${error}`);
          cookies.remove(res, tokenCookieName);
          cookies.remove(res, appInsightsCookieName);
          next();
        });
    } else {
      next();
    }
  };
};

module.exports = idamUserDetails;
