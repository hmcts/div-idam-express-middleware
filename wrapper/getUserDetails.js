const got = require('got');

function getUserDetails(authToken, args) {
  const options = {
    headers: { Authorization: `Bearer ${authToken}` },
    responseType: 'json'
  };

  const url = `${args.idamApiUrl}/details`;

  return got.get(url, options).then(response => response.body);
}

module.exports = getUserDetails;
