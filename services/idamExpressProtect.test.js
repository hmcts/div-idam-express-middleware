const sinon = require('sinon');
const { expect } = require('chai');
const config = require('../config');
const idamWrapper = require('../wrapper');
const middleware = require('./idamExpressProtect');
const sinonStubPromise = require('sinon-stub-promise');
const cookies = require('../utilities/cookies');

sinonStubPromise(sinon);

let req = null;
let res = null;
let next = null;
const idamArgs = {};
const userDetails = {
  id: 'idam.user.id',
  email: 'email@email.com'
};

describe('idamExpressLogout', () => {
  it('should return a middleware handler', () => {
    const handler = middleware();
    expect(handler).to.be.a('function');
  });

  describe('middleware', () => {
    let idamExpressProtect = null;
    let getUserDetails = null;

    beforeEach(() => {
      req = {
        cookies: {},
        query: []
      };
      res = {
        redirect: sinon.stub(),
        cookie: sinon.stub(),
        clearCookie: sinon.stub()
      };
      next = sinon.stub();
      sinon.stub(cookies, 'remove');
      getUserDetails = sinon.stub().returnsPromise();
      sinon.stub(idamWrapper, 'setup').returns({ getUserDetails });
      idamExpressProtect = middleware(idamArgs);
    });

    afterEach(() => {
      idamWrapper.setup.restore();
      cookies.remove.restore();
    });

    it('calls next on successful auth', () => {
      req.cookies[config.tokenCookieName] = 'token';

      getUserDetails.resolves(userDetails);
      idamExpressProtect(req, res, next);

      expect(getUserDetails.callCount).to.equal(1);
      expect(next.callCount).to.equal(1);
    });

    it('should set idam userDetails', () => {
      req.cookies[config.tokenCookieName] = 'token';

      getUserDetails.resolves(userDetails);
      idamExpressProtect(req, res, next);

      expect(getUserDetails.callCount).to.equal(1);
      expect(next.callCount).to.equal(1);
      expect(req.idam.userDetails).to.equal(userDetails);
    });

    it('redirects if getUserDetails rejects', () => {
      req.cookies[config.tokenCookieName] = 'token';

      getUserDetails.rejects();
      idamExpressProtect(req, res, next);

      expect(res.redirect.callCount).to.equal(1);
    });

    it('cookie to be removed if getUserDetails rejects', () => {
      req.cookies[config.tokenCookieName] = 'token';

      getUserDetails.rejects();
      idamExpressProtect(req, res, next);

      expect(cookies.remove.calledTwice).to.equal(true);
    });

    it('cookie to be removed if getUserDetails rejects', () => {
      req.cookies[config.tokenCookieName] = 'token';

      getUserDetails.rejects();
      idamExpressProtect(req, res, next);

      expect(cookies.remove.calledTwice).to.equal(true);
    });

    it('redirects if no token cookie', () => {
      const handler = middleware(idamArgs);
      handler(req, res, next);

      expect(res.redirect.callCount).to.equal(1);
    });
  });
});
