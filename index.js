const idamExpressAuthenticate = require('./services/idamExpressAuthenticate');
const idamExpressLanding = require('./services/idamExpressLanding');
const idamExpressProtect = require('./services/idamExpressProtect');

const authenticate = (args = {}) => {
  return idamExpressAuthenticate(args);
};

const landingPage = (args = {}) => {
  return idamExpressLanding(args);
};

const protect = (args = {}) => {
  return idamExpressProtect(args);
};

module.exports = { authenticate, landingPage, protect };
