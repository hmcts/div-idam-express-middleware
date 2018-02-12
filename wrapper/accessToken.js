const request = require('request-promise-native');

const requestDefaults = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  json: true
};
const formDefaults = { grant_type: 'authorization_code' };

const accessToken = (options = {}, args) => {
  const requestOptions = Object.assign({
    uri: `${args.idamApiUrl}/oauth2/token`,
    form: Object.assign({}, formDefaults, options),
    auth: {
      user: args.idamClientID,
      pass: args.idamSecret
    }
  }, requestDefaults);

  return request.post(requestOptions);
};

module.exports = accessToken;
