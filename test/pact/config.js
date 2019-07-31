module.exports = {
  services: {
    idam: {
      loginUrl: process.env.IDAM_LOGIN_URL || 'https://localhost:8000/login',
      apiUrl: process.env.IDAM_API_URL || 'http://localhost:4501',
      roles: ['probate-private-beta', 'citizen'],
      s2s_url: process.env.IDAM_S2S_URL || 'http://localhost:4502',
      service_name: 'probate_frontend',
      service_key: process.env.IDAM_SERVICE_KEY || 'AAAAAAAAAAAAAAAA',
      divorce_oauth2_client: 'divorce',
      divorce_oauth2_secret: process.env.IDAM_API_OAUTH2_CLIENT_CLIENT_SECRETS_DIVORCE || '123456',
      divorce_oauth_callback_path: '/oauth2/callback',
      divorce_oauth_token_path: '/oauth2/token'
    },
    pact: {
      brokerUrl: process.env.PACT_BROKER_URL || 'http://localhost:80',
      tag: process.env.PACT_BRANCH_NAME || 'Dev',
      pactDirectory: 'pacts'
    }
  }
};