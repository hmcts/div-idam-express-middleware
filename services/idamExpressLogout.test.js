const sinon = require('sinon');
const { expect } = require('chai');
const idamWrapper = require('../wrapper');
const middleware = require('./idamExpressLogout');
const got = require('got');
const cookies = require('../utilities/cookies');

let req = null;
let res = null;
let next = null;
const idamApiUrl = '/idamApiUrl';
const authToken = 'token';
const logoutUrl = idamApiUrl + '/session/' + authToken;
const serviceAuth = 'base64String';
const options = {
  headers: {
    Authorization: 'Basic ' + serviceAuth,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

describe('idamExpressLogout', () => {
  it('should return a middleware handler', () => {
    const handler = middleware();
    expect(handler).to.be.a('function');
  });

  describe('middleware', () => {
    beforeEach(() => {
      req = { cookies: {} };
      res = { cookie: sinon.stub() };
      next = sinon.stub();
      const idamFunctionsStub = {
        getIdamApiUrl: sinon.stub().returns(idamApiUrl),
        getServiceAuth: sinon.stub().returns(serviceAuth)
      };
      sinon.stub(idamWrapper, 'setup').returns(idamFunctionsStub);
      sinon.stub(cookies, 'get').returns(authToken);
      sinon.stub(cookies, 'remove').returns(authToken);
      sinon.stub(got, 'delete');
    });

    afterEach(() => {
      cookies.get.restore();
      cookies.remove.restore();
      idamWrapper.setup.restore();
      got.delete.restore();
    });

    it('logs the user out of idam', () => {
      got.delete.resolves();
      const handler = middleware();

      return handler(req, res, next).then(() => {
        expect(idamWrapper.setup.calledOnce).to.eql(true);
        expect(cookies.get.calledOnce).to.eql(true);
        expect(got.delete.calledOnce).to.eql(true);
        expect(got.delete.calledWith(logoutUrl, options)).to.eql(true);
        expect(cookies.remove.calledOnce).to.eql(true);
        expect(next.calledOnce).to.eql(true);
      });
    });

    it('logs error and calls next when promise rejects', () => {
      got.delete.rejects(new Error('Test error'));
      const handler = middleware();

      return handler(req, res, next).then(() => {
        expect(idamWrapper.setup.calledOnce).to.eql(true);
        expect(cookies.get.calledOnce).to.eql(true);
        expect(got.delete.calledOnce).to.eql(true);
        expect(got.delete.calledWith(logoutUrl, options)).to.eql(true);
        expect(next.calledOnce).to.eql(true);
      });
    });
  });
});
