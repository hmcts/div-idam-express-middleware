# Divorce IDAM Express Middleware


## Requirements

* Node >=8.0
* yarn


## Installation

yarn add @hmcts/div-idam-express-middleware


## Available functions

This module exposes three middleware functions that take in an object parameter. These are:

* **authenticate** - checks if the current user has a valid auth token cookie, if not redirects them to the idam login page with a query parameter `args.continueUrl` to determine where the user will be sent on successful login
* **landingPage** - should only run on the page that idam redirects to after successful authentication. This sets auth token cookie based on the jwt query parameter passed back by idam
* **protect** - checks if the user has a valid auth token cookie, and makes sure it matches against the current session user details. If not, this redirects them to a page defined by the user `args.indexUrl`
* **logout** - This makes a request to idam to invalidate the session Jwt token on exit/logout. It provides the jwt token to idam as a path parameter in the http request url.


##  Arguments

Pass a key-value object into the parameter when making the middleware function call.

```javascript
const express = require('express');
const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');

const app = express();
const args = {
  redirectUri: {URL_TO_REDIRECT_TO_AFTER_LOGIN},
  indexUrl: '/index',
  idamApiUrl: {URL_TO_IDAM_API},
  idamLoginUrl: {URL_TO_REDIRECT_USER_TO_LOGIN},
  idamSecret: {IDAM_SECRET},
  idamClientID: {IDAM_CLIENT_ID}
};

app.use(idamExpressMiddleware.userDetails(args));
app.get(paths.login, idamExpressMiddleware.authenticateMiddleware(args));
app.get(paths.redirectUrl, idamExpressMiddleware.landingPage(idamConfig));
app.use(idamExpressMiddleware.protect(args));
app.get(paths.logout, idamExpressMiddleware.logout(args));
```

NB. as the cookies have `secure: true` set you need to make browser requests using https. In a deployed environment 
where we terminate https on a load balancer that is fine, but if you are running without a loadbalancer (most likely
localhost) you will need to be using https.  

### List of available args

* **indexUrl** (required) - the url for the index page of the service, or whatever page you want the user to be redirected to on auth failure.
* **redirectUri** (required) - passed to the idamWrapper to determine where to redirect to on successful login. Should create user session and redirect to first logged in page.
* **idamClientID** (required) - id of service to use idam.
* **idamSecrete** (required) - secret for service to use idam.
* **idamApiUrl** (required) - used by the idamWrapper. The url where all API calls will be made to.
* **idamLoginUrl** (required) - used by the idamWrapper. The url where the user will be redirected to if they require a login for authentication.
* **tokenCookieName** - the name of the cookie that the jwt token will be saved to. By default is `__auth-token`.
* **stateCookieName** - the name of the cookie that stores the state identifier. By default is `state`.
* **hostName** - the main service name / url. By default is the PUBLIC_HOSTNAME environment variable.
* **state** - state to padd the oauth flow. By default is a random string.
* **openId** - boolean true to use openId endpoints false to use legacy endpoints. By default is false.

### OpenId

To use the open id endpoints rather than the legacy endpoints for getting a token and user details add the argument openId when initialising idamExpressMiddleware 

```javascript
const args = {
  redirectUri: {URL_TO_REDIRECT_TO_AFTER_LOGIN},
  indexUrl: '/index',
  idamApiUrl: {URL_TO_IDAM_API},
  idamLoginUrl: {URL_TO_REDIRECT_USER_TO_LOGIN},
  idamSecret: {IDAM_SECRET},
  idamClientID: {IDAM_CLIENT_ID},
  openId: true
};
```
