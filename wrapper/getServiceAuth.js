const getServiceAuth = (args = {}) => {
  if (!args.idamClientID || !args.idamSecret) {
    throw new Error('ClientID or Secret is undefined');
  }
  const base64EncodedString = Buffer.from(`${args.idamClientID}:${args.idamSecret}`)
    .toString('base64');

  return `Basic ${base64EncodedString}`;
};

module.exports = getServiceAuth;
