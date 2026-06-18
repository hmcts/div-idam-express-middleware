const idamWrapper = require('../wrapper');
const { Logger } = require('@hmcts/nodejs-logging');
const got = require('got');
const cookies = require('../utilities/cookies');
const config = require('../config');

const logger = Logger.getLogger(__filename);

function idamExpressLogout(options) {
  const args = options || {};
  const idamFunctions = idamWrapper.setup(args);
  const tokenCookieName = args.tokenCookieName || config.tokenCookieName;

  return function idamLogout(req, res, next) {
    const authToken = cookies.get(req, tokenCookieName);
    const logoutUrl = `${idamFunctions.getIdamApiUrl()}/session/${authToken}`;

    const requestOptions = {
      headers: {
        Authorization: `Basic ${idamFunctions.getServiceAuth()}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    return got.delete(logoutUrl, requestOptions)
      .then(() => {
        logger.info('Token successfully deleted');
        cookies.remove(res, tokenCookieName);
        next();
      })
      .catch(error => {
        logger.error(`Token deletion failed with error ${error}`);
        next();
      });
  };
}

module.exports = idamExpressLogout;
