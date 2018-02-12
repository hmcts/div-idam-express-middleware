const request = require('request-promise-native');

const getUserDetails = (authToken, args) => {
  const options = {
    uri: `${args.idamApiUrl}/details`,
    headers: { Authorization: `Bearer ${authToken}` },
    json: true
  };

  return request.get(options);
};

module.exports = getUserDetails;
