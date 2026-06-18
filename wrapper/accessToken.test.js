const sinon = require('sinon');
const { expect } = require('chai');
const got = require('got'); // Change this to require 'got'
const accessToken = require('./accessToken');

describe('accessToken', () => {
  const args = {};
  let postStub;

  beforeEach(() => {
    postStub = sinon.stub(got, 'post').returns({ json: sinon.stub().resolves({}) });
  });

  afterEach(() => {
    postStub.restore();
  });

  it('makes the request to obtain token', async () => {
    // Arrange
    const options = { field: 'value' };
    args.idamApiUrl = 'some-url';
    args.idamClientID = 'some-id';
    args.idamSecret = 'some-secret';

    // Act
    await accessToken(options, args);

    // Assert
    expect(postStub.calledOnce).to.equal(true);
    const [url, callOptions] = postStub.getCall(0).args;

    expect(url).to.equal(`${args.idamApiUrl}/oauth2/token`);
    expect(callOptions).to.have.property('username', args.idamClientID);
    expect(callOptions).to.have.property('password', args.idamSecret);
    expect(callOptions.headers).to.deep.include({
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    expect(callOptions.body).to.include('grant_type=authorization_code');
    expect(callOptions.body).to.include('field=value');
  });
});
