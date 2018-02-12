const sinon = require('sinon');
const { expect } = require('chai');
const config = require('../config');
const idamWrapper = require('../wrapper');
const middleware = require('./idamExpressLanding');
const sinonStubPromise = require('sinon-stub-promise');

sinonStubPromise(sinon);

let req = null;
let res = null;
let next = null;
const idamArgs = { indexUrl: '/' };

describe('idamExpressLanding', () => {
  it('returns a middleware handler', () => {
    const handler = middleware();
    expect(handler).to.be.a('function');
  });

  describe('middleware', () => {
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
    });

    {
      let getAccessToken = null;
      let idamExpressLanding = null;
      let getUserDetails = null;

      beforeEach(() => {
        getAccessToken = sinon.stub().returnsPromise();
        getUserDetails = sinon.stub().returnsPromise();
        sinon.stub(idamWrapper, 'setup').returns({ getAccessToken, getUserDetails });
        idamExpressLanding = middleware(idamArgs);
      });

      afterEach(() => {
        idamWrapper.setup.restore();
      });

      it('calls next on successful auth', () => {
        req.query.code = 'code';
        req.cookies[config.stateCookieName] = 'state';

        idamExpressLanding(req, res, next);
        const response = { body: { access_token: 'access_token' } };
        getAccessToken.resolves(response);

        expect(getAccessToken.callCount).to.equal(1);
        expect(getUserDetails.callCount).to.equal(1);
        expect(res.cookie.callCount).to.equal(1);
        expect(next.callCount).to.equal(1);
      });

      it('redirects if error with getAccessToken response', () => {
        req.query.code = 'code';
        req.cookies[config.stateCookieName] = 'state';

        idamExpressLanding(req, res, next);
        getAccessToken.rejects();

        expect(getAccessToken.callCount).to.equal(1);
        expect(res.redirect.callCount).to.equal(1);
        expect(res.redirect.calledWith('/')).to.equal(true);
        expect(next.callCount).to.equal(0);
      });
    }

    it('redirects if no state exists', () => {
      req.query.code = 'code';
      const handler = middleware(idamArgs);
      handler(req, res, next);

      expect(res.redirect.callCount).to.equal(1);
    });

    it('redirects if no code exists', () => {
      req.cookies[config.stateCookieName] = 'state';
      const handler = middleware(idamArgs);
      handler(req, res, next);

      expect(res.redirect.callCount).to.equal(1);
    });

    it('removes old state cookie', () => {
      req.query.code = 'code';
      req.cookies[config.stateCookieName] = 'state';

      const handler = middleware(idamArgs);
      handler(req, res, next);

      expect(res.clearCookie.callCount).to.equal(1);
    });
  });
});
