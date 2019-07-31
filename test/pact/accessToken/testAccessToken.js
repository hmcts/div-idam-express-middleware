'use strict';

const expect = require('chai').expect;
const testConfig = require('test/config');
const logger = require('app/components/logger')('Init');
const request = require('supertest');
const statusCodes = require('http-status-codes');

describe('Access token', () => {
  const endpoint = `${testConfig.idam.apiUrl}/oauth2/token`;

  describe('Missing Session-Id which should produce a 400 Bad Request', () => {
    it('Returns HTTP 400 status', done => {
      request(endpoint)
        .get('')
        .expect(statusCodes.BAD_REQUEST)
        .end((error, res) => {
          if (error) {
            logger.error(`error raised: ${error} using URL ${endpoint}`);
          } else {
            expect(error).to.be.equal(null);
            expect(res.text).to.contain('Bad Request');
          }
          done();
        });
    });
  });
});