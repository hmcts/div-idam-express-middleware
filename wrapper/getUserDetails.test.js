const sinon = require('sinon');
const { expect } = require('chai');
const got = require('got');
const getUserDetails = require('./getUserDetails');

describe('getUserDetails', () => {
  var args = {};
  var getStub;

  beforeEach(() => {
    getStub = sinon.stub(got, 'get').returns(Promise.resolve({ body: {} }));
  });

  afterEach(() => {
    getStub.restore();
  });

  it('makes the request to obtain user details', () => {
    // Arrange
    var token = 'some-token';
    args.idamApiUrl = 'some-url';

    // Act
    return getUserDetails(token, args).then(() => {
      // Assert
      expect(getStub.calledOnce).to.equal(true);

      var [url, options] = getStub.getCall(0).args;

      expect(url).to.equal(args.idamApiUrl + '/details');
      expect(options).to.have.property('responseType', 'json');
      expect(options.headers).to.have.property('Authorization', 'Bearer ' + token);
    });
  });
});
