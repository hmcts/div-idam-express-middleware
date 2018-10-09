const idamWrapper = require('../wrapper');
const { Logger } = require('@hmcts/nodejs-logging');
const config = require('../config');
const cookies = require('../utilities/cookies');

const logger = Logger.getLogger(__filename);

const idamExpressLanding = (args = {}) => {
  const idamFunctions = idamWrapper.setup(args);

  const tokenCookieName = args.tokenCookieName || config.tokenCookieName;
  const stateCookieName = args.stateCookieName || config.stateCookieName;

  return (req, res, next) => {
    const state = cookies.get(req, stateCookieName);
    if (!state) {
      logger.error('State cookie does not exist');
      res.redirect(args.indexUrl);
      return;
    }

    const code = req.query.code;
    if (!code) {
      logger.error('Code has not been set on the query string');
      res.redirect(args.indexUrl);
      return;
    }

    cookies.remove(res, stateCookieName);

    idamFunctions
      .getAccessToken({
        code,
        state,
        redirect_uri: args.redirectUri
      })
      .then(response => {
        cookies.set(res, tokenCookieName, response.access_token, args.hostName);
        // set cookie on req so it can be used during this request
        req.cookies = req.cookies || {};
        req.cookies[tokenCookieName] = response.access_token;
        return idamFunctions
          .getUserDetails(response.access_token, args);
      })
      .then(userDetails => {
        req.idam = { userDetails };
        next();
      })
      .catch(error => {
        logger.error(`An error occurred when authenticating the user: ${error}`);
        res.redirect(args.indexUrl);
      });
  };
};

module.exports = idamExpressLanding;
