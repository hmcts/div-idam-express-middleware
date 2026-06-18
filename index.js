const idamExpressAuthenticate = require('./services/idamExpressAuthenticate');
const idamExpressLanding = require('./services/idamExpressLanding');
const idamExpressProtect = require('./services/idamExpressProtect');
const idamExpressLogout = require('./services/idamExpressLogout');
const idamUserDetails = require('./services/idamUserDetails');

const authenticate = (args = {}) => idamExpressAuthenticate(args);

const landingPage = (args = {}) => idamExpressLanding(args);

const protect = (args = {}) => idamExpressProtect(args);

const logout = (args = {}) => idamExpressLogout(args);

const userDetails = (args = {}) => idamUserDetails(args);

module.exports = { authenticate, landingPage, protect, logout, userDetails };
