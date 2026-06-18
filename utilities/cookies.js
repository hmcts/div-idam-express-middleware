const set = (res, cookieName, cookieValue,
  domain = process.env.PUBLIC_HOSTNAME) => {
  res.cookie(cookieName, cookieValue, {
    secure: true,
    httpOnly: true,
    domain
  });
};

const get = (req, cookieName) => {
  if (req.cookies) {
    return req.cookies[cookieName];
  }
  return undefined;  
};

const remove = (res, cookieName) => res.clearCookie(cookieName);

module.exports = { set, get, remove };
