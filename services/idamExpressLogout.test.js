const sinon = require('sinon');
const { expect } = require('chai');
const idamWrapper = require('../wrapper');
const middleware = require('./idamExpressAuthenticate');
const sinonStubPromise = require('sinon-stub-promise');

sinonStubPromise(sinon);

let req = null;
let res = null;
let next = null;
const idamArgs = {};

describe('idamExpressLogout', () => {
  it('should return a middleware handler', () => {
    const handler = middleware();
    expect(handler).to.be.a('function');
  });

  describe('middleware', () => {
    beforeEach(() => {
      req = { cookies: {} };
      res = {
        redirect: sinon.stub(),
        cookie: sinon.stub(),
        clearCookie: sinon.stub()
      };
      next = sinon.stub();
    });

    {
      let getIdamApiUrl = null;
      let idamExpressLogout = null;

      beforeEach(() => {

        getIdamApiUrl = sinon.stub().returns('/');
        sinon.stub(idamWrapper, 'setup').returns({ getIdamApiUrl });
        idamExpressLogout = middleware(idamArgs);
      });

      afterEach(() => {
        idamWrapper.setup.restore();
      });

      describe('no auth token', () => {
        it('should call getIdamApiUrl', () => {
          idamExpressLogout(req, res, next);

          expect(getIdamApiUrl.callCount).to.equal(1);
          expect(res.cookie.callCount).to.equal(1);
        });
      });
      describe('with auth token', () => {
        beforeEach(() => {
          req = { cookies: { '__auth-token': 'token' } };
        });


        it('should call next if getIdamLoginUrl if getUserDetails rejects', () => {
          idamExpressLogout(req, res, next);

          expect(getIdamApiUrl.callCount).to.equal(1);
          expect(res.cookie.callCount).to.equal(1);
        });
      });
    }

  });
});
