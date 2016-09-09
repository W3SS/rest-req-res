# REST Request Response
REST API helper, json and xml format, cors, methods override

[![npm package](https://nodei.co/npm/rest-req-res.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/rest-req-res)

## Installing

Installing of NPM package
``` bash
npm install rest-req-res
```

## How to use

Beginning
``` javascript
var express = require('express');
var app = express();
var router = express.Router();
var config = require('./config.json');
var rest = require('rest-req-res');
config.errors = require('./errors.json');
app.set('config', config);
rest(app);
```

Success response
``` javascript
router.get('/success', function(req, res){
  res.success({
    resultField1: 'value1',
    resultField2: 'value2'
  }, 200, {
    metaField1: 'value1',
    metaField2: 'value2'
  });
});
```

Error response
``` javascript
router.get('/error', function(req, res) {
  res.error('CONFLICT', {
    details1: 'value1',
    details2: 'value2'
  });
});
```

Mounting
``` javascript
app.use('/'+config.api.version, router);
app.listen(config.app.port, config.app.host);
```

Config example `./config.json`
``` json
{
  "app": {
    "port": 8080,
    "host": "127.0.0.1"
  },
  "api": {
    "version": "v1",
    "origin": ["Test", null]
  },
  "cors": {
    "maxAge": 86400,
    "allowHeaders": [
      "Content-Type", "Accept", "Origin", "X-HTTP-Method-Override", "User-Agent", "Authorization",
      "Cache-Control", "Keep-Alive", "X-Requested-With", "If-Modified-Since"
    ],
    "allowMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }
}
```

Errors example `./errors.json`
``` json
{
  "BAD_REQUEST": {"code": 400, "status": 400, "message": "Bad Request"},
  "UNAUTHORIZED": {"code": 401, "status": 401, "message": "Unauthorized"},
  "FORBIDDEN": {"code": 403, "status": 403, "message": "Forbidden"},
  "NOT_FOUND": {"code": 404, "status": 404, "message": "Not Found"},
  "METHOD_NOT_ALLOWED": {"code": 405, "status": 405, "message": "Method Not Allowed"},
  "REQUEST_TIMEOUT": {"code": 408, "status": 408, "message": "Request Timeout"},
  "CONFLICT": {"code": 409, "status": 409, "message": "Conflict"},
  "INTERNAL_SERVER_ERROR": {"code": 500, "status": 500, "message": "Internal Server Error"},
  "SERVICE_UNAVAILABLE": {"code": 503, "status": 503, "message": "Service Unavailable"},
  "UNKNOWN_ERROR": {"code": 520, "status": 520, "message": "Unknown Error"}
}
```

### Method Override

Request headers
``` http
X-HTTP-Method: PUT
X-HTTP-Method-Override: PUT
X-Method-Override: PUT
```

URL query parameter
```
?httpMethod=put
```

If `POST http://url?httpMethod=put` then handle as `PUT http://url`

### Request Content-Type header

Supported Content-Type
``` http
Content-Type: application/xml
Content-Type: application/json
```

If `Content-Type: application/xml` and body
``` xml
<?xml version="1.0" encoding="UTF-8"?><test>1</test>
```
then server will parse request body as
``` json
{
  "test": "1"
}
```

### Request Accept header

Supported Accept
``` http
Accept: application/xml
Accept: application/json
```

URL query parameter
```
?responseFormat=xml
?responseFormat=json
```

### Response status code

URL query parameter
```
?forcedResponseStatus=200
```

## Development

Run tests
``` bash
npm run test
```

Run watch files and autostart test
``` bash
npm run watch
```

## License
ISC
