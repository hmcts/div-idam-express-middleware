'use strict';

const expect = require('chai').expect;
const testConfig = require('../config');
const request = require('supertest');
const statusCodes = require('http-status-codes');

const prepareBody = () => {
  return {
    code: '', // use test harness to retrieve it from Idam
    grant_type: 'authorization_code',
    redirect_uri: 'https://div-pfe-aat.service.core-compute-aat.internal/authenticated', // config
    client_id: 'divorce',
    client_secret: 'thUphEveC2Ekuqedaneh4jEcRuba4t2t' // get it from vault
  };
};

describe('Access token', () => {
  const endpoint = `${testConfig.services.idam.apiUrl}/oauth2/token`;

  describe('Should return 401 when', () => {
    it('No Authorisation header set', done => {
      request(endpoint)
        .type('form')
        .set('Accept', 'application/json')
        .send(prepareBody())
        .expect(statusCodes.BAD_REQUEST)
        .end((error, res) => {
          if (error) {
            done(error);
          } else {
            expect(res.text).to.contain('Bad Request');
            expect(error).to.be.equal(null);
            done();
          }
        });
    });

    it('Invalid Authorisation header', done => {
      request(endpoint)
        .post()
        .set('Accept', 'application/json')
        .set('Authorization', 'invalid token')
        .type('form')
        .send(prepareBody())
        .expect(statusCodes.BAD_REQUEST)
        .end((error, res) => {
          if (error) {
            done(error);
          } else {
            expect(error).to.be.equal(null);
            expect(res.text).to.contain('Bad Request');
          }
          done();
        });
    });
  });

  describe('Should return 200 when', () => {
    it('Valid Authorisation header provided', done => {
      // call
      done();
    });
  });
});
