const set = (res, cookieName, cookieValue,
  domain = process.env.PUBLIC_HOSTNAME) => {
  res.cookie(cookieName, cookieValue, {
    secure: true,
    httpOnly: true,
    domain
  });
};

const get = (req, cookieName) => {
  return req.cookies[cookieName];
};

const remove = (res, cookieName) => {
  return res.clearCookie(cookieName);
};

module.exports = { set, get, remove };
