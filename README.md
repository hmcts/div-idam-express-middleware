# Divorce IDAM Express Middleware


## Installation

Ensure you have done the [Requirements][#Requirements] and then run:

```
yarn add @hmcts/div-idam-express-middleware
```


## Requirements

* Node >=8.0
* yarn

As of now, this module is published only in a private repository.
We are working on publishing this project to NPM.


## Available functions

This module exposes three middleware functions that take in an object parameter. These are:

* **authenticate** - checks if the current user has a valid auth token cookie, if not redirects them to the idam login page with a query parameter `args.continueUrl` to determine where the user will be sent on successful login
* **landingPage** - should only run on the page that idam redirects to after successful authentication. This sets auth token cookie based on the jwt query parameter passed back by idam
* **protect** - checks if the user has a valid auth token cookie, and makes sure it matches against the current session user details. If not, this redirects them to a page defined by the user `args.indexUrl`


##  Arguments

Pass a key-value object into the parameter when making the middleware function call.

```javascript
const express = require('express');
const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');

const app = express();
const args = {
  continueUrl: 'http://localhost:8090',
  indexUrl: '/index'
};

app.use(idamExpressMiddleware.landingPage(args));
app.use(idamExpressMiddleware.authenticate(args));
app.use(idamExpressMiddleware.protect(args));
```

### List of available args

* **indexUrl** (required) - the url for the index page of the service, or whatever page you want the user to be redirected to on auth failure
* **continueUrl** (required) - passed to the idamWrapper to determine where to redirect to on successful login
* **authRole** - passed to the idamWrapper to determine which role to authenticate against. Default value is citizen
* **queryName** - the jwt token is passed back to the redirect continueUrl as a query parameter. By default the query parameter is `jwt`
* **authTokenName** - the name of the cookie that the jwt token will be saved to. By default is `__auth-token`
* **stateCookieName** - the name of the cookie that stores the state identifier. By default is `state`
* **hostName** - the main service name / url. By default is the PUBLIC_HOSTNAME environment variable
* **idamApiUrl** - used by the idamWrapper. The url where all API calls will be made to. By default is defined in the config file in the idamWrapper repository
* **idamLoginUrl** - used by the idamWrapper. The url where the user will be redirected to if they require a login for authentication. By default is defined in the config file in the idamWrapper repository
