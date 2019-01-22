const idamWrapper = require('../wrapper');
const { Logger } = require('@hmcts/nodejs-logging');
const config = require('../config');
const cookies = require('../utilities/cookies');

const logger = Logger.getLogger(__filename);

const idamExpressProtect = (args = {}) => {
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
          res.redirect(args.indexUrl);
        });
    } else {
      // No authentication cookie set, so redirect to index.
      res.redirect(args.indexUrl);
    }
  };
};

module.exports = idamExpressProtect;
