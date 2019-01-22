const idamWrapper = require('../wrapper');
const { Logger } = require('@hmcts/nodejs-logging');
const config = require('../config');
const cookies = require('../utilities/cookies');
const jwtDecode = require('jwt-decode');

const logger = Logger.getLogger(__filename);

const idamExpressLanding = (args = {}) => {
  const idamFunctions = idamWrapper.setup(args);

  const tokenCookieName = args.tokenCookieName || config.tokenCookieName;
  const stateCookieName = args.stateCookieName || config.stateCookieName;
  const appInsightsCookieName = args.appInsightsCookieName || config.appInsightsCookieName;

  return (req, res, next) => {
    const authToken = req.query[tokenCookieName];
    const code = req.query.code;

    // If no code then landing page was not reached through IDAM
    if (!code) {
      if (authToken) {
        try {
          // validate authToken, do nothing if error
          jwtDecode(authToken);

          cookies.set(res, tokenCookieName, authToken, args.hostName);
          // set cookie on req so it can be used during this request
          req.cookies = req.cookies || {};
          req.cookies[tokenCookieName] = authToken;
          idamFunctions.getUserDetails(authToken, args)
            .then(userDetails => {
              req.idam = { userDetails };
              next();
            })
            .catch(error => {
              logger.error(`An error occurred when authenticating the user: ${error}`);
              res.redirect(args.indexUrl);
            });
        } catch (error) {
          next();
        }
      } else {
        logger.error('Code has not been set on the query string');
        res.redirect(args.indexUrl);
      }
      return;
    }

    const state = cookies.get(req, stateCookieName);
    if (!state) {
      logger.error('State cookie does not exist');
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
        cookies.set(res, appInsightsCookieName, userDetails.id, args.hostName);
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
