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

    const options = {
      method: 'DELETE',
      uri: logoutUrl,
    };

    request(options)
    .then(function (response) {
      logger.info(`Token successfully deleted`);
      next();
    })
    .catch(function (err) {
      logger.error(`Token deletion failed with error ${err}`);
      next();
    });
  }
};

module.exports = idamExpressLogout;
