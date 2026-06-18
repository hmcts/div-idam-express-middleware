const got = require('got');
const qs = require('qs');

function accessToken(options = {}, args) {
  const url = `${args.idamApiUrl}/oauth2/token`;
  const body = qs.stringify(Object.assign({}, { grant_type: 'authorization_code' }, options));

  return got.post(url, {
    body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    username: args.idamClientID,
    password: args.idamSecret
  }).json();
}

accessToken.post = accessToken;

module.exports = accessToken;
