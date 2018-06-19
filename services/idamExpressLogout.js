const idamWrapper = require('../wrapper');
const { Logger } = require('@hmcts/nodejs-logging');
const request = require('request-promise-native');
const cookies = require('../utilities/cookies');
const config = require('../config');

const logger = Logger.getLogger(__filename);

const idamExpressLogout = (args = {}) => {
  const idamFunctions = idamWrapper.setup(args);

  const tokenCookieName = args.tokenCookieName || config.tokenCookieName;

  return (req, res, next) => {
    const authToken = cookies.get(req, tokenCookieName);
    const logoutUrl = `${idamFunctions.getIdamApiUrl()}/session/${authToken}`;

    return request.delete(logoutUrl)
      .then(() => {
        logger.info('Token successfully deleted');
        // if logout is successfull remove token cookie
        cookies.remove(res, tokenCookieName);
        next();
      })
      .catch(error => {
        logger.error(`Token deletion failed with error ${error}`);
        next();
      });
  };
};

module.exports = idamExpressLogout;
